using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class RequestTableAndPlayerFriendsId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<string>>(
                name: "FriendsId",
                schema: "identity",
                table: "AspNetUsers",
                type: "text[]",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Requests",
                schema: "identity",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RequestedPlayerId = table.Column<string>(type: "text", nullable: false),
                    RequestingPlayerId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Requests", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Requests",
                schema: "identity");

            migrationBuilder.DropColumn(
                name: "FriendsId",
                schema: "identity",
                table: "AspNetUsers");
        }
    }
}
