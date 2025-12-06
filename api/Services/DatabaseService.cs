using Dapper;
using Npgsql;
using System.Data;

namespace api.Services;

public class DatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
    }

    public IDbConnection CreateConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }

    public async Task EnsureAccountExistsAsync(string email, string displayName)
    {
        using var connection = CreateConnection();
        var sql = "SELECT COUNT(1) FROM secretarai.account WHERE email = @Email";
        var count = await connection.ExecuteScalarAsync<int>(sql, new { Email = email });

        if (count == 0)
        {
            var insertSql = "INSERT INTO secretarai.account (email, display_name) VALUES (@Email, @DisplayName)";
            await connection.ExecuteAsync(insertSql, new { Email = email, DisplayName = displayName });
        }
    }
}