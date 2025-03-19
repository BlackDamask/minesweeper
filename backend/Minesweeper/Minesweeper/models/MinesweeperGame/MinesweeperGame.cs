namespace Minesweeper.models.MinesweeperGame
{
    public class MinesweeperGame
    {
        public Tile[][]? gameField { get; set; }

        public int colStartIndex { get; set; }
        public int rowStartIndex { get; set; }

        private int difficulty;
        private int numberOfTilesX;
        private int numberOfTilesY;
        private int numberOfBombs;
        private bool isStarted = false;

        public MinesweeperGame(int difficulty)
        {
            this.difficulty = difficulty;
            Generate();
        }

        private void Generate()
        {
            switch (difficulty)
            {
                case 1: // Beginner
                    numberOfTilesX = 9;
                    numberOfTilesY = 9;
                    break;
                case 2: // Intermediate
                    numberOfTilesX = 16;
                    numberOfTilesY = 16;
                    break;
                case 3: // Expert
                    numberOfTilesX = 30;
                    numberOfTilesY = 16;
                    break;
                default:
                    numberOfTilesX = 9;
                    numberOfTilesY = 9;
                    break;
            }

            gameField = new Tile[numberOfTilesY][];

            for (int i = 0; i < numberOfTilesY; i++)
            {
                gameField[i] = new Tile[numberOfTilesX];
                for (int j = 0; j < numberOfTilesX; j++)
                {
                    string color = (i + j) % 2 == 0 ? "light-tile" : "dark-tile";
                    gameField[i][j] = new Tile
                    {
                        Color = color,
                        HasBomb = false,
                        NearbyBombs = null,
                        IsFlagged = false,
                        IsRevealed = false
                    };
                }
            }

            Random rnd = new Random();
            int rowIndex = rnd.Next(0, numberOfTilesY);
            int colIndex = rnd.Next(0, numberOfTilesX);
            this.colStartIndex = colIndex;
            this.rowStartIndex = rowIndex;
            PlaceBombs(colIndex, rowIndex);
        }
        public int CountProgress()
        {
            int revealedTiles = 0;
            for (int i = 0; i < numberOfTilesY; i++)
            {
                for (int j = 0; j < numberOfTilesX; j++)
                {
                    if (gameField!= null && gameField[i][j].IsRevealed)
                    {
                        revealedTiles++;
                    }
                }
            }
            return revealedTiles / (numberOfTilesY * numberOfTilesX) * 100;
        }


        public void PlaceBombs(int colIndex, int rowIndex)
        {
            isStarted = true;
            HashSet<string> exclusionZone = new HashSet<string>();

            // Exclude initial tile and its neighbors from bomb placement
            for (int x = -1; x <= 1; x++)
            {
                for (int y = -1; y <= 1; y++)
                {
                    int newRow = rowIndex + x;
                    int newCol = colIndex + y;

                    if (newRow >= 0 && newRow < numberOfTilesY && newCol >= 0 && newCol < numberOfTilesX)
                    {
                        exclusionZone.Add($"{newRow},{newCol}");
                    }
                }
            }

            // Set number of bombs based on difficulty
            switch (difficulty)
            {
                case 1:
                    numberOfBombs = 10;
                    break;
                case 2:
                    numberOfBombs = 40;
                    break;
                case 3:
                    numberOfBombs = 99;
                    break;
                default:
                    Console.WriteLine($"Unknown difficulty level: {difficulty}. Defaulting to 10 bombs.");
                    numberOfBombs = 10;
                    break;
            }

            // Place bombs avoiding the initial clicked tile
            Random random = new Random();
            int bombsPlaced = 0;
            while (bombsPlaced < numberOfBombs)
            {
                int randomRow = random.Next(numberOfTilesY);
                int randomCol = random.Next(numberOfTilesX);

                if (
                    (randomCol != colIndex || randomRow != rowIndex) &&
                    !gameField[randomRow][randomCol].HasBomb &&
                    !exclusionZone.Contains($"{randomRow},{randomCol}")
                )
                {
                    gameField[randomRow][randomCol].HasBomb = true;
                    bombsPlaced++;
                }
            }

            // Calculate nearby bombs for each tile
            for (int i = 0; i < numberOfTilesY; i++)
            {
                for (int j = 0; j < numberOfTilesX; j++)
                {
                    if (gameField[i][j].HasBomb) continue;

                    int nearbyBombs = 0;

                    for (int x = -1; x <= 1; x++)
                    {
                        for (int y = -1; y <= 1; y++)
                        {
                            if (x == 0 && y == 0) continue;

                            int newRow = i + x;
                            int newCol = j + y;

                            if (newRow >= 0 && newRow < numberOfTilesY && newCol >= 0 && newCol < numberOfTilesX)
                            {
                                if (gameField[newRow][newCol].HasBomb)
                                {
                                    nearbyBombs++;
                                }
                            }
                        }
                    }
                    gameField[i][j].NearbyBombs = nearbyBombs;
                }
            }
        }
    }
}
