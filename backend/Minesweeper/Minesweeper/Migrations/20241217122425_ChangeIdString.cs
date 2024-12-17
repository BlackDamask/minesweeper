using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class ChangeIdString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // MatchmakingQueue table
            migrationBuilder.DropPrimaryKey(
                name: "PK_MatchmakingQueue",
                schema: "identity",
                table: "MatchmakingQueue");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "identity",
                table: "MatchmakingQueue");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                schema: "identity",
                table: "MatchmakingQueue",
                type: "nvarchar(450)",
                nullable: false);

            migrationBuilder.AlterColumn<string>(
                name: "PlayerId",
                schema: "identity",
                table: "MatchmakingQueue",
                type: "nvarchar(max)",
                nullable: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MatchmakingQueue",
                schema: "identity",
                table: "MatchmakingQueue",
                column: "Id");

            // Games table
            migrationBuilder.DropPrimaryKey(
                name: "PK_Games",
                schema: "identity",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "identity",
                table: "Games");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                schema: "identity",
                table: "Games",
                type: "nvarchar(450)",
                nullable: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Games",
                schema: "identity",
                table: "Games",
                column: "Id");

            // GameParticipants table
            migrationBuilder.DropPrimaryKey(
                name: "PK_GameParticipants",
                schema: "identity",
                table: "GameParticipants");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "identity",
                table: "GameParticipants");

            migrationBuilder.AddColumn<string>(
                name: "Id",
                schema: "identity",
                table: "GameParticipants",
                type: "nvarchar(450)",
                nullable: false);

            migrationBuilder.AlterColumn<string>(
                name: "PlayerId",
                schema: "identity",
                table: "GameParticipants",
                type: "nvarchar(max)",
                nullable: false);

            migrationBuilder.AlterColumn<string>(
                name: "GameId",
                schema: "identity",
                table: "GameParticipants",
                type: "nvarchar(max)",
                nullable: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GameParticipants",
                schema: "identity",
                table: "GameParticipants",
                column: "Id");
        }


        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // MatchmakingQueue table
            migrationBuilder.DropPrimaryKey(
                name: "PK_MatchmakingQueue",
                schema: "identity",
                table: "MatchmakingQueue");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "identity",
                table: "MatchmakingQueue");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                schema: "identity",
                table: "MatchmakingQueue",
                type: "int",
                nullable: false)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "PlayerId",
                schema: "identity",
                table: "MatchmakingQueue",
                type: "int",
                nullable: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_MatchmakingQueue",
                schema: "identity",
                table: "MatchmakingQueue",
                column: "Id");

            // Games table
            migrationBuilder.DropPrimaryKey(
                name: "PK_Games",
                schema: "identity",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "identity",
                table: "Games");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                schema: "identity",
                table: "Games",
                type: "int",
                nullable: false)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Games",
                schema: "identity",
                table: "Games",
                column: "Id");

            // GameParticipants table
            migrationBuilder.DropPrimaryKey(
                name: "PK_GameParticipants",
                schema: "identity",
                table: "GameParticipants");

            migrationBuilder.DropColumn(
                name: "Id",
                schema: "identity",
                table: "GameParticipants");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                schema: "identity",
                table: "GameParticipants",
                type: "int",
                nullable: false)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "PlayerId",
                schema: "identity",
                table: "GameParticipants",
                type: "int",
                nullable: false);

            migrationBuilder.AlterColumn<int>(
                name: "GameId",
                schema: "identity",
                table: "GameParticipants",
                type: "int",
                nullable: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_GameParticipants",
                schema: "identity",
                table: "GameParticipants",
                column: "Id");
        }

    }
}
