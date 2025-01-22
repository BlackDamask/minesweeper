using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class DifficultyFieldAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Difficulty",
                schema: "identity",
                table: "Games",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Difficulty",
                schema: "identity",
                table: "Games");
        }
    }
}
