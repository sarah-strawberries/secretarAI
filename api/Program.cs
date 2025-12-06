using api.Services;
using api.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddScoped<DatabaseService>();
var allowedOrigin = builder.Configuration["ALLOWED_ORIGIN"] ?? "http://localhost:5173";
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowWeb",
        policy => policy.WithOrigins(allowedOrigin)
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = builder.Configuration["Keycloak:Authority"];
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateAudience = false,
        NameClaimType = "email"
    };
    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = async context =>
        {
            var dbService = context.HttpContext.RequestServices.GetRequiredService<DatabaseService>();
            var email = context.Principal?.FindFirst("email")?.Value;
            var name = context.Principal?.FindFirst("name")?.Value ?? "Unknown";

            if (!string.IsNullOrEmpty(email))
            {
                await dbService.EnsureAccountExistsAsync(new Account { Email = email, DisplayName = name });
            }
        }
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowWeb");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => "Why hello! \n What are you snooping around here for?\n\nDon't worry; all the important endpoints require authorization. ;)");

app.MapPost("/account-login", async (DatabaseService db, AccountLogin request) =>
{
    if (string.IsNullOrEmpty(request.Email)) return Results.BadRequest("Email is required");
    await db.EnsureAccountExistsAsync(new Account { Email = request.Email, DisplayName = request.DisplayName });
    return Results.Ok();
})
.RequireAuthorization();

app.Run();

record AccountLogin(string Email, string DisplayName);
