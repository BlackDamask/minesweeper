using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minesweeper.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRefreshTokens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the primary key constraint
            migrationBuilder.DropPrimaryKey(
                name: "PK_RefreshTokens",
                schema: "identity",
                table: "RefreshTokens");

            // Modify the 'Id' column
            migrationBuilder.AlterColumn<Guid>(
                name: "Id",
                schema: "identity",
                table: "RefreshTokens",
                type: "uniqueidentifier",
                nullable: false, // Make the column NOT NULL
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            // Recreate the primary key constraint
            migrationBuilder.AddPrimaryKey(
                name: "PK_RefreshTokens",
                schema: "identity",
                table: "RefreshTokens",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the primary key constraint
            migrationBuilder.DropPrimaryKey(
                name: "PK_RefreshTokens",
                schema: "identity",
                table: "RefreshTokens");

            // Revert the 'Id' column back to string
            migrationBuilder.AlterColumn<string>(
                name: "Id",
                schema: "identity",
                table: "RefreshTokens",
                type: "nvarchar(450)",
                nullable: false, // Make the column NOT NULL
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            // Recreate the primary key constraint
            migrationBuilder.AddPrimaryKey(
                name: "PK_RefreshTokens",
                schema: "identity",
                table: "RefreshTokens",
                column: "Id");
        }
    }

}
