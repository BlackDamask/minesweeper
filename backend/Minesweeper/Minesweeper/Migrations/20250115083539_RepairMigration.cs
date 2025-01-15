using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class RepairMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ColBeginIndex",
                schema: "identity",
                table: "Games",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RowBeginIndex",
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
                name: "ColBeginIndex",
                schema: "identity",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "RowBeginIndex",
                schema: "identity",
                table: "Games");
        }
    }
}
