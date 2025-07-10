using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Minesweeper.data;
using Minesweeper.models;
using Minesweeper.Services.PlayerService;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using Microsoft.OpenApi.Models;
using Minesweeper.Services.MatchmakingService;
using Minesweeper.Services;
using Minesweeper.Services.AuthenticationService;
using Minesweeper.Services.GameService;
using Minesweeper.Services.EmailService;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => {
    c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = """Authorization header using Bearer. "bearer {token}" """,
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    c.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddScoped<IAuthenticationService, AuthenticationService>();
builder.Services.AddScoped<IPlayerService, PlayerService>();
builder.Services.AddScoped<IMatchmakingService, MatchmakingService>();
builder.Services.AddScoped<IGameService, GameService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHostedService<MatchmakingBackgroundService>();
builder.Services.AddAuthorization();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddSignalR().AddNewtonsoftJsonProtocol();

builder.Services.AddIdentityCore<Player>(options =>
{
    options.User.AllowedUserNameCharacters = string.Empty; 
    options.User.RequireUniqueEmail = true; 
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddApiEndpoints();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

string[] allowedOrigins = new[]
{
    "http://localhost:3000",
    "https://127.0.0.1:3000",
    "http://213.176.114.172:5000",
    "https://213.176.114.172:5000",
    "http://213.176.114.172",
    "https://213.176.114.172",
    "http://localhost",
    "https://localhost",
    "http://127.0.0.1",
    "https://127.0.0.1"
};

// Add the CORS policy.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins(allowedOrigins) 
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()); 
});

builder.Services.AddSingleton<EmailService>();

var app = builder.Build();

builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
});


    app.UseSwagger();
    app.UseSwaggerUI();


    app.UseRouting();

    app.UseCors("AllowFrontend");

    app.UseAuthentication(); // <<< Add this!
    app.UseAuthorization();
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers(); // Maps controllers.
    endpoints.MapHub<GameHub>("/game"); // Maps SignalR hub.
});

app.MapControllers();

app.Run();

