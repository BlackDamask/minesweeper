using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class GameIsActive : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                schema: "identity",
                table: "Games");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                schema: "identity",
                table: "Games",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                schema: "identity",
                table: "Games");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                schema: "identity",
                table: "Games",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
