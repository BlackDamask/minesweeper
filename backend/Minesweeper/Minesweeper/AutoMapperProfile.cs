using AutoMapper;
using Minesweeper.DTOs.PlayerDTO;
using Minesweeper.models;

namespace Minesweeper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<RegisterPlayerDTO, Player>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password))
                .ForMember(dest => dest.PlayerName, opt => opt.MapFrom(src => src.PlayerName));
            CreateMap<Player, GetPlayerDTO>();
        }
    }
}
