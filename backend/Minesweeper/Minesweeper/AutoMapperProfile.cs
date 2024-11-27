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
                .ForMember(dest => dest.PasswordHash, opt => opt.MapFrom(src => src.Password));
            CreateMap<Player, GetPlayerDTO>();
        }
    }
}
