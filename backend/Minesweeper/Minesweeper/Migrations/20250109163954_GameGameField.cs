using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class GameGameField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameFieldSerialized",
                schema: "identity",
                table: "GameParticipants");

            migrationBuilder.AddColumn<string>(
                name: "GameFieldSerialized",
                schema: "identity",
                table: "Games",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GameFieldSerialized",
                schema: "identity",
                table: "Games");

            migrationBuilder.AddColumn<string>(
                name: "GameFieldSerialized",
                schema: "identity",
                table: "GameParticipants",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
