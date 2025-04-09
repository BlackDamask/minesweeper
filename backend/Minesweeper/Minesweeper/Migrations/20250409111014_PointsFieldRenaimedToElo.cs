using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class PointsFieldRenaimedToElo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Points",
                schema: "identity",
                table: "AspNetUsers",
                newName: "Elo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Elo",
                schema: "identity",
                table: "AspNetUsers",
                newName: "Points");
        }
    }
}
