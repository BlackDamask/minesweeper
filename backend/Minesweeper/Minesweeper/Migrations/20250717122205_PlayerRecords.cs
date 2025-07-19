using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class PlayerRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameParticipants_AspNetUsers_PlayerId",
                schema: "identity",
                table: "GameParticipants");

            migrationBuilder.AlterColumn<string>(
                name: "PlayerId",
                schema: "identity",
                table: "GameParticipants",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int?[]>(
                name: "Records",
                schema: "identity",
                table: "AspNetUsers",
                type: "integer[]",
                nullable: false,
                defaultValue: new int?[0]);

            migrationBuilder.AddForeignKey(
                name: "FK_GameParticipants_AspNetUsers_PlayerId",
                schema: "identity",
                table: "GameParticipants",
                column: "PlayerId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GameParticipants_AspNetUsers_PlayerId",
                schema: "identity",
                table: "GameParticipants");

            migrationBuilder.DropColumn(
                name: "Records",
                schema: "identity",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<string>(
                name: "PlayerId",
                schema: "identity",
                table: "GameParticipants",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_GameParticipants_AspNetUsers_PlayerId",
                schema: "identity",
                table: "GameParticipants",
                column: "PlayerId",
                principalSchema: "identity",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
