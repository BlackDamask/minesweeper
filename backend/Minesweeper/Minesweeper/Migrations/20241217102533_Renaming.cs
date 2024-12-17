using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class Renaming : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MatchmakingQueues",
                schema: "identity",
                table: "MatchmakingQueues");

            migrationBuilder.RenameTable(
                name: "MatchmakingQueues",
                schema: "identity",
                newName: "MatchmakingQueue",
                newSchema: "identity");

            migrationBuilder.RenameColumn(
                name: "startTime",
                schema: "identity",
                table: "Games",
                newName: "StartTime");

            migrationBuilder.RenameColumn(
                name: "gameType",
                schema: "identity",
                table: "Games",
                newName: "GameType");

            migrationBuilder.RenameColumn(
                name: "endTime",
                schema: "identity",
                table: "Games",
                newName: "EndTime");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MatchmakingQueue",
                schema: "identity",
                table: "MatchmakingQueue",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_MatchmakingQueue",
                schema: "identity",
                table: "MatchmakingQueue");

            migrationBuilder.RenameTable(
                name: "MatchmakingQueue",
                schema: "identity",
                newName: "MatchmakingQueues",
                newSchema: "identity");

            migrationBuilder.RenameColumn(
                name: "StartTime",
                schema: "identity",
                table: "Games",
                newName: "startTime");

            migrationBuilder.RenameColumn(
                name: "GameType",
                schema: "identity",
                table: "Games",
                newName: "gameType");

            migrationBuilder.RenameColumn(
                name: "EndTime",
                schema: "identity",
                table: "Games",
                newName: "endTime");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MatchmakingQueues",
                schema: "identity",
                table: "MatchmakingQueues",
                column: "Id");
        }
    }
}
