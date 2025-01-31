@echo off
setlocal

set "pthproj=%USERPROFILE%\Documents\projects\lcpblog\server\api\v1\lcpblogapi"
set "pthmig=%pthproj%\Migrations"
set "pthdbp=%pthproj%.library\Scripts\dbproviders.json"

set "listdbm=SQLite SQLServer MySQL PostgresSQL"
set "DefDBMode=SQLServer"

cd "%pthproj%" || (
    echo Error: Directory %pthproj% does not exist.
    exit /b 1
)

:check_jq_installed
where jq >nul 2>&1 || (
    echo Please install jq following this url: https://jqlang.github.io/jq/
    exit /b 1
)

:get_list_dbm
for /f "delims=" %%i in ('jq -M -r ".dbproviders[] | \"%%.id - %%\".name" "%pthdbp%"') do (
    set "mlistdbm=%%i"
)

:check_dotnet_ef_installed
where dotnet-ef >nul 2>&1 || (
    dotnet tool install --global dotnet-ef
)

:add_db
set "dbName=%1"
set "DefDBMode=%dbName%"

cls
echo Setting up database: %dbName%

call :check_dotnet_ef_installed

if exist "%pthmig%\%dbName%" rmdir /s /q "%pthmig%\%dbName%"
if exist "%pthproj%\Database\%dbName%" rmdir /s /q "%pthproj%\Database\%dbName%"

mkdir "%pthproj%\Database\%dbName%"

dotnet ef migrations remove --force --context "MyDBContext%dbName%"
dotnet ef database drop --force --context "MyDBContext%dbName%"
dotnet ef migrations add "InitialCreate%dbName%" --context "MyDBContext%dbName%" --output-dir "%pthmig%\%dbName%"
dotnet ef database update --context "MyDBContext%dbName%"
dotnet ef migrations script --context "MyDBContext%dbName%" --output "Scripts\sql\migscr%dbName%.sql"

goto :eof

:add_all
for %%d in (%listdbm%) do (
    call :add_db %%d
)

:update_migrations
set "dbMode=%1"
set "DefDBMode=%dbMode%"

cls
echo Updating migrations for %dbMode% database...

dotnet ef migrations script --context "MyDBContext%dbMode%" --output "Scripts\sql\migscr%dbMode%.sql"

if exist "Scripts\sql\migscr%dbMode%.sql" (
    echo Updated migrations for %dbMode% database!
) else (
    echo Failed to update migrations for %dbMode% database.
)

goto :eof

:update_all_migrations
for %%d in (%listdbm%) do (
    call :update_migrations %%d
)

:main_menu
call :check_jq_installed

cls

echo.
echo Generate DB for API
echo --------------------------------------
echo Author Info:
echo Name: Luis Carvalho
echo Email: luiscarvalho239@gmail.com
echo Date creation of script: 30/09/2024
echo Date modification of script: 14/01/2025
echo --------------------------------------
echo.
echo Note: The default option is %DefDBMode%
echo.
echo Choose your option:
echo.

for /l %%i in (1,1,4) do (
    for /f "tokens=1* delims= " %%d in ("%listdbm%") do (
        echo %%i - %%d
        set "listdbm=%%e"
    )
)

echo A - All
echo B - Others
echo C - Exit from program
echo.

set /p choice=

if "%choice%"=="" (set choice=1)
if /i "%choice%"=="A" goto add_all
if /i "%choice%"=="B" goto other_menu
if /i "%choice%"=="C" goto exit_prog
if "%choice%" geq "1" if "%choice%" leq "4" call :add_db %listdbm%

goto inv_choice

:other_menu
cls
echo Others
echo A - Update database migrations
echo B - Back
echo.
echo Note: The default option is B
echo.
echo Choose your option:
echo.

set /p choice=

if "%choice%"=="" set choice=B
if /i "%choice%"=="A" goto update_db_migrations_menu
if /i "%choice%"=="B" goto main_menu

goto inv_choice

:update_db_migrations_menu
cls
echo Update database migrations
echo A - All
echo B - Specific
echo C - Back
echo.
echo Note: The default option is C
echo.
echo Choose your option:
echo.

set /p choice=

if "%choice%"=="" set choice=C
if /i "%choice%"=="A" goto update_all_migrations
if /i "%choice%"=="B" goto update_specific_migration_menu
if /i "%choice%"=="C" goto other_menu

goto inv_choice

:update_specific_migration_menu
cls
echo Update specific database migration

for /l %%i in (1,1,4) do (
    for /f "tokens=1* delims= " %%d in ("%listdbm%") do (
        echo %%i - %%d
        set "listdbm=%%e"
    )
)

echo.
echo Select the option (1-4):
echo.

set /p choice=

if "%choice%" geq "1" if "%choice%" leq "4" (
    for /l %%i in (1,1,4) do (
        if "%choice%"=="%%i" (
            set "dbMode=%%listdbm: =%%"
            call :update_migrations %dbMode%
        )
    )
    goto update_db_migrations_menu
)

goto inv_choice

:inv_choice
cls
echo Invalid choice!
goto exit_prog

:exit_prog
exit /b 0
