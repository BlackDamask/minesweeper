using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

using Minesweeper.data;
using Minesweeper.DTOs.GameDTO;
using Minesweeper.models;
using Minesweeper.models.MinesweeperGame;


namespace Minesweeper.Services
{
    [Authorize]
    public class GameHub : Hub
    {
        private readonly ApplicationDbContext dbContext;

        public GameHub(ApplicationDbContext context)
        {
            this.dbContext = context;
        }

        public async Task SendProgress(ReceiveProgressDTO response)
        {
            try
            {
                var player = dbContext.Users
                    .FirstOrDefault(p => p.Id == Context.UserIdentifier) ?? throw new Exception("Player not found");

                Console.WriteLine("Received progress: " + Convert.ToString(response.Progress)+ Convert.ToString(response.IsExploaded) + " from user: " + player.UserName);

                string gameId = dbContext.GameParticipants
                    .Where(gp => gp.PlayerId == Context.UserIdentifier)
                    .Select(gp => gp.GameId)
                    .FirstOrDefault() ?? throw new Exception("Game not found");

                var enemyGp = dbContext.GameParticipants
                    .FirstOrDefault(gp => gp.GameId == gameId && gp.PlayerId != Context.UserIdentifier) ?? throw new Exception("Enemy not found");

                var sendResponse = new SendProgressDTO { IsExploaded = response.IsExploaded, Progress = response.Progress };

                await Clients.User(enemyGp.PlayerId).SendAsync("ReceiveProgress", sendResponse);

                var playerGp = dbContext.GameParticipants
                    .FirstOrDefault(p => p.PlayerId == Context.UserIdentifier) ?? throw new Exception("PlayerGP not found");
                playerGp.Progress = response.Progress;

                await dbContext.SaveChangesAsync();


                if (response.Progress == 100)
                {
                    var game = dbContext.Games
                        .FirstOrDefault(g => g.Id == gameId) ?? throw new Exception("Game not found");

                    game.IsActive = false;

                    var enemy = dbContext.Users.FirstOrDefault(u => u.Id == enemyGp.PlayerId) ?? throw new Exception("Enemy not found");
                    var winnerTime = DateTime.Now - game.StartTime;

                    

                    var playerGameEndResponse = new GameEndDto
                    {
                        EloChange = 8,
                        NewElo = player.Elo + 8,
                        IsWon = true,
                        WinnersTime = winnerTime,
                    };

                    var enemyGameEndResponse = new GameEndDto
                    {
                        EloChange = -8,
                        NewElo = enemy.Elo - 8,
                        IsWon = false,
                        WinnersTime = winnerTime,
                        IsNewRecord = false
                    };

                    player.Elo += 8;
                    enemy.Elo -= 8;

                    await Clients.User(player.Id).SendAsync("GameEnd", playerGameEndResponse);
                    await Clients.User(enemyGp.PlayerId).SendAsync("GameEnd", enemyGameEndResponse);

                    dbContext.GameParticipants.Remove(enemyGp);
                    dbContext.GameParticipants.Remove(playerGp);
                    await dbContext.SaveChangesAsync();

                    Console.WriteLine("GameEnded");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
            

        }

        public async Task SendPvpGameInvitation(string invitedPlayerId)
        {
            try
            {
                var sender = dbContext.Users
                    .FirstOrDefault(p => p.Id == Context.UserIdentifier) ?? throw new Exception("Sender not found");

                var invitation = new
                {
                    sender.Id,
                    Name = sender.UserName,
                    sender.Elo
                };

                await Clients.User(invitedPlayerId).SendAsync("ReceivePvpGameInvitation", invitation);
                Console.WriteLine($"Sent PvP game invitation from {sender.UserName} to player {invitedPlayerId}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending PvP game invitation: {ex.Message}");
            }
        }

        public async Task AcceptPvpGameInvitation(string inviterPlayerId)
        {
            try
            {
                var accepterPlayerId = Context.UserIdentifier;
                if (accepterPlayerId == inviterPlayerId)
                    throw new Exception("Cannot accept your own invitation.");

                var inviter = dbContext.Users.FirstOrDefault(u => u.Id == inviterPlayerId);
                var accepter = dbContext.Users.FirstOrDefault(u => u.Id == accepterPlayerId);

                if (inviter == null || accepter == null)
                    throw new Exception("Player(s) not found.");

                MinesweeperGame minesweeperGame = new MinesweeperGame(1);

                var newGame = new Game
                {
                    Id = Guid.NewGuid().ToString(),
                    StartTime = DateTime.UtcNow,
                    GameField = minesweeperGame.gameField,
                    ColBeginIndex = minesweeperGame.colStartIndex,
                    RowBeginIndex = minesweeperGame.rowStartIndex,
                    Difficulty = 1,
                    StartTimeNumeric = (int)DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                };

                await dbContext.Games.AddAsync(newGame);
                await dbContext.SaveChangesAsync();

                var participants = new List<GameParticipant>
                {
                    new GameParticipant { Id = Guid.NewGuid().ToString(), GameId = newGame.Id, PlayerId = inviterPlayerId },
                    new GameParticipant { Id = Guid.NewGuid().ToString(), GameId = newGame.Id, PlayerId = accepterPlayerId }
                };

                await dbContext.GameParticipants.AddRangeAsync(participants);
                await dbContext.SaveChangesAsync();

                var inviterResponse = new GameBeginDTO
                {
                    GameField = minesweeperGame.gameField,
                    ColBeginIndex = minesweeperGame.colStartIndex,
                    RowBeginIndex = minesweeperGame.rowStartIndex,
                    EnemyName = accepter.PlayerName,
                    EnemyId = accepterPlayerId,
                    EnemyProgress = minesweeperGame.CountProgress(),
                    StartTime = newGame.StartTimeNumeric
                };

                var accepterResponse = new GameBeginDTO
                {
                    GameField = minesweeperGame.gameField,
                    ColBeginIndex = minesweeperGame.colStartIndex,
                    RowBeginIndex = minesweeperGame.rowStartIndex,
                    EnemyName = inviter.PlayerName,
                    EnemyId = inviterPlayerId,
                    EnemyProgress = minesweeperGame.CountProgress(),
                    StartTime = newGame.StartTimeNumeric
                };

                await Clients.User(inviterPlayerId).SendAsync("GameStarted", inviterResponse);
                await Clients.User(accepterPlayerId).SendAsync("GameStarted", accepterResponse);

                Console.WriteLine($"PvP game created between {inviter.PlayerName} and {accepter.PlayerName}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error accepting PvP game invitation: {ex.Message}");
            }
        }

        public override Task OnConnectedAsync()
        {
            Console.WriteLine(Clients.ToString());
            return Task.CompletedTask;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Console.WriteLine("Client closed");

            var playerId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(playerId))
            {
                // Remove player from matchmaking queue if present
                var queueEntry = dbContext.MatchmakingQueue.FirstOrDefault(q => q.PlayerId == playerId);
                if (queueEntry != null)
                {
                    dbContext.MatchmakingQueue.Remove(queueEntry);
                    await dbContext.SaveChangesAsync();
                    Console.WriteLine($"Removed player {playerId} from matchmaking queue on disconnect.");
                }
                
            }

            await base.OnDisconnectedAsync(exception);
        } 
    }
}
