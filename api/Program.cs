using api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
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

// Configure auth
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
            
            if (!string.IsNullOrEmpty(email))
            {
                await dbService.EnsureUserExistsAsync(email);
            }
        }
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowWeb");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => "Why hello! \n What are you snooping around here for?\n\nDon't worry; all the important endpoints require authorization. ;)");

app.MapPost("/user-login", async (DatabaseService db, UserLogin request) =>
{
    if (string.IsNullOrEmpty(request.Email)) return Results.BadRequest("Email is required");
    await db.EnsureUserExistsAsync(request.Email);
    return Results.Ok();
})
.RequireAuthorization();

app.Run();

record UserLogin(string Email);
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
