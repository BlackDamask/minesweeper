using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;

namespace Minesweeper.Services.PlayerService
{
    public class PlayerService : IPlayerService
    {

        private readonly UserManager<Player> playerManager;
        private readonly SignInManager<Player> signInManager;
        private readonly IMapper mapper;

        public PlayerService(UserManager<Player> playerManager, SignInManager<Player> signInManager,IMapper mapper)
        {
            this.playerManager = playerManager;
            this.signInManager = signInManager;
            this.mapper = mapper;
        }
        public async Task<ServiceResponse<string>> Login(string username, string password)
        {
            var serviceResponse = new ServiceResponse<string>();
            var signInResult = await signInManager.PasswordSignInAsync(
                userName: username!,
                password: password,
                isPersistent: true,
                lockoutOnFailure: false
                );
            if (signInResult.Succeeded)
            {
                serviceResponse.Message = "Login succeesed";
                serviceResponse.Success = true;
            }
            else
            {
                serviceResponse.Success = false;
            }
            return serviceResponse;
        }

        public async Task<ServiceResponse<string>> Register(RegisterPlayerDTO newPlayer)
        {
            var serviceResponse = new ServiceResponse<string>();
            var player = mapper.Map<Player>(newPlayer);
            var result = await playerManager.CreateAsync(player, player.PasswordHash!);
            if (result.Succeeded)
            {
                serviceResponse.Message = "Register succeesed";
                serviceResponse.Success = true;
            }
            else
            {
                serviceResponse.Success = false;
            }
            return serviceResponse;
        }
    }
}
