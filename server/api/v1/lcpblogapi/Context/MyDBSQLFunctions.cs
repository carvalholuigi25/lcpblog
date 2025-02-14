using System.Data;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Data.Sqlite;
using MySql.Data.MySqlClient;
using Npgsql;

namespace lcpblogapi.Context;

public class MyDBSQLFunctions: ControllerBase {

    private readonly IConfiguration _config;
    private readonly string _defdbmode = null!;

    public MyDBSQLFunctions(IConfiguration config)
    {
        _config = config;
        _defdbmode = config.GetSection("DefDBMode").Value!;
    }

    public static string CapitalizeFirstLetter(string input)
    {
        if (string.IsNullOrEmpty(input))
            return input;

        return char.ToUpper(input[0]) + input.Substring(1);
    }

    public async Task<IActionResult> ResetAIID(string tblname = "posts", int? id = 0) {
        if(_defdbmode.Contains("SQLServer", StringComparison.OrdinalIgnoreCase)) {
            var qry = "DBCC CHECKIDENT(@tblname, RESEED, @aid)";

            using SqlConnection connection = GetSqlConnection();
            using SqlCommand command = GetSqlCommand(qry, connection);

            command.CommandType = CommandType.Text;
            command.Parameters.AddWithValue("@tblname", "'dbo." + tblname + "'");
            command.Parameters.AddWithValue("@aid", id);
            
            try
            {
                Stopwatch sw = Stopwatch.StartNew();

                await connection.OpenAsync();
                var rowsAffected = await command.ExecuteNonQueryAsync();
                
                await connection.CloseAsync();
                sw.Stop();
                
                return Ok("Database Provider: "+_defdbmode+"\nQuery: "+command.CommandText+"\nMessage: Reseted AI Id to "+id+"\nRows affected: "+rowsAffected+"\nTime: "+sw.Elapsed.TotalMilliseconds+"ms");
            }
            catch (Exception ex)
            {
                if (connection.State != ConnectionState.Closed)
                {
                    await connection.CloseAsync();
                }
                return Ok(ex.Message);
            }
        } else if(_defdbmode.Contains("SQLite", StringComparison.OrdinalIgnoreCase)) {
            var qry = @"UPDATE sqlite_sequence SET seq = "+id+" WHERE name = '"+CapitalizeFirstLetter(tblname)+"'";

            using SqliteConnection connection = GetSqliteConnection();
            using SqliteCommand command = GetSqliteCommand(qry, connection);

            command.CommandType = CommandType.Text;

            try
            {
                Stopwatch sw = Stopwatch.StartNew();

                await connection.OpenAsync();
                var rowsAffected = await command.ExecuteNonQueryAsync();
                
                await connection.CloseAsync();
                sw.Stop();
                
                return Ok("Database Provider: "+_defdbmode+"\nQuery: "+command.CommandText+"\nMessage: Reseted AI Id to "+id+"\nRows affected: "+rowsAffected+"\nTime: "+sw.Elapsed.TotalMilliseconds+"ms");
            }
            catch (Exception ex)
            {
                if (connection.State != ConnectionState.Closed)
                {
                    await connection.CloseAsync();
                }
                return Ok(ex.Message);
            }
        } else if(_defdbmode.Contains("MySQL", StringComparison.OrdinalIgnoreCase)) {
            var qry = "ALTER TABLE @tblname AUTO_INCREMENT = @aid";

            using MySqlConnection connection = GetMySqlConnection();
            using MySqlCommand command = GetMySqlCommand(qry, connection);

            command.CommandType = CommandType.Text;
            command.Parameters.AddWithValue("@tblname", tblname);
            command.Parameters.AddWithValue("@aid", id);
            
            try
            {
                Stopwatch sw = Stopwatch.StartNew();

                await connection.OpenAsync();
                var rowsAffected = await command.ExecuteNonQueryAsync();
                
                await connection.CloseAsync();
                sw.Stop();
                
                return Ok("Database Provider: "+_defdbmode+"\nQuery: "+command.CommandText+"\nMessage: Reseted AI Id to "+id+"\nRows affected: "+rowsAffected+"\nTime: "+sw.Elapsed.TotalMilliseconds+"ms");
            }
            catch (Exception ex)
            {
                if (connection.State != ConnectionState.Closed)
                {
                    await connection.CloseAsync();
                }
                return Ok(ex.Message);
            }
        } else if(_defdbmode.Contains("PostgresSQL", StringComparison.OrdinalIgnoreCase)) {
            var qry = "ALTER SEQUENCE @tblname RESTART WITH @aid;";

            using NpgsqlConnection connection = GetPSqlConnection();
            using NpgsqlCommand command = GetPSqlCommand(qry, connection);

            command.CommandType = CommandType.Text;
            command.Parameters.AddWithValue("@tblname", tblname + "_id_seq");
            command.Parameters.AddWithValue("@aid", id!);
            
            try
            {
                Stopwatch sw = Stopwatch.StartNew();

                await connection.OpenAsync();
                var rowsAffected = await command.ExecuteNonQueryAsync();
                
                await connection.CloseAsync();
                sw.Stop();
                
                return Ok("Database Provider: "+_defdbmode+"\nQuery: "+command.CommandText+"\nMessage: Reseted AI Id to "+id+"\nRows affected: "+rowsAffected+"\nTime: "+sw.Elapsed.TotalMilliseconds+"ms");
            }
            catch (Exception ex)
            {
                if (connection.State != ConnectionState.Closed)
                {
                    await connection.CloseAsync();
                }
                return Ok(ex.Message);
            }
        } else {
            var qry = @"UPDATE sqlite_sequence SET seq = "+id+" WHERE name = '"+CapitalizeFirstLetter(tblname)+"'";

            using SqliteConnection connection = GetSqliteConnection();
            using SqliteCommand command = GetSqliteCommand(qry, connection);

            command.CommandType = CommandType.Text;

            try
            {
                Stopwatch sw = Stopwatch.StartNew();

                await connection.OpenAsync();
                var rowsAffected = await command.ExecuteNonQueryAsync();
                
                await connection.CloseAsync();
                sw.Stop();
                
                return Ok("Database Provider: "+_defdbmode+"\nQuery: "+command.CommandText+"\nMessage: Reseted AI Id to "+id+"\nRows affected: "+rowsAffected+"\nTime: "+sw.Elapsed.TotalMilliseconds+"ms");
            }
            catch (Exception ex)
            {
                if (connection.State != ConnectionState.Closed)
                {
                    await connection.CloseAsync();
                }
                return Ok(ex.Message);
            }
        }
    }

    private SqlConnection GetSqlConnection() {
        return new SqlConnection(_config.GetConnectionString("SQLServer"));
    }

    private SqliteConnection GetSqliteConnection() {
        return new SqliteConnection(_config.GetConnectionString("SQLite"));
    }

    private MySqlConnection GetMySqlConnection() {
        return new MySqlConnection(_config.GetConnectionString("MySQL"));
    }

    private NpgsqlConnection GetPSqlConnection() {
        return new NpgsqlConnection(_config.GetConnectionString("PostgresSQL"));
    }

    private dynamic GetSqlCommand(string query, SqlConnection connection) {
        return new SqlCommand(query, connection);
    }

    private dynamic GetSqliteCommand(string query, SqliteConnection connection) {
        return new SqliteCommand(query, connection);
    }

    private dynamic GetMySqlCommand(string query, MySqlConnection connection) {
        return new MySqlCommand(query, connection);
    }

    private dynamic GetPSqlCommand(string query, NpgsqlConnection connection) {
        return new NpgsqlCommand(query, connection);
    }
}