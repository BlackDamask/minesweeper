using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class IsGuestPlayer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsGuest",
                schema: "identity",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsGuest",
                schema: "identity",
                table: "AspNetUsers");
        }
    }
}
