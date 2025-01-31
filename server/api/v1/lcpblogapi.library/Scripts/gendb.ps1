$pthproj = "$HOME\Documents\projects\lcpblog\server\api\v1\lcpblogapi"
$pthmig = "$pthproj\Migrations"
$pthdbp = "$pthproj.library\Scripts\dbproviders.json"

$listdbm = @("SQLite", "SQLServer", "MySQL", "PostgresSQL")
$DefDBMode = $listdbm[1]

if (!(Test-Path $pthproj)) {
    Write-Host "Error: Directory $pthproj does not exist."
    exit 1
}

function Get-ListDbm {
    jq -M -r '.dbproviders[] | "$($_.id) - $($_.name)"' $pthdbp | Out-Null
    if ($?) { 
        $mlistdbm = Get-Content $pthdbp | jq -M -r '.dbproviders[] | "\(.id) - \(.name)"'
    } else { 
        Write-Host "Error reading database providers."
        exit 1
    }
}

function Check-DotnetEfInstalled {
    if (!(Get-Command dotnet-ef -ErrorAction SilentlyContinue)) {
        dotnet tool install --global dotnet-ef
    } else {
        Write-Host "Dotnet EF Core Tools installed"
    }
}

function Check-JqInstalled {
    if (!(Get-Command jq -ErrorAction SilentlyContinue)) {
        Write-Host "Please install jq following this url: https://jqlang.github.io/jq/"
        exit 1
    } else {
        Write-Host "jq is installed!"
    }
}

function Add-Db {
    param([string]$dbName)
    $Global:DefDBMode = $dbName

    Clear-Host
    Write-Host "Setting up database: $dbName"

    Check-DotnetEfInstalled

    if (Test-Path "$pthmig\$dbName") { Remove-Item "$pthmig\$dbName" -Recurse }
    if (Test-Path "$pthproj\Database\$dbName") { Remove-Item "$pthproj\Database\$dbName" -Recurse }

    New-Item -ItemType Directory -Path "$pthproj\Database\$dbName"

    dotnet ef migrations remove --force --context "MyDBContext$dbName"
    dotnet ef database drop --force --context "MyDBContext$dbName"
    dotnet ef migrations add "InitialCreate$dbName" --context "MyDBContext$dbName" --output-dir "$pthmig\$dbName"
    dotnet ef database update --context "MyDBContext$dbName"
    dotnet ef migrations script --context "MyDBContext$dbName" --output "Scripts\sql\migscr$dbName.sql"
}

function Add-All {
    foreach ($dbModeVal in $listdbm) {
        Add-Db -dbName $dbModeVal
    }
}

function Update-Migrations {
    param([string]$dbMode)
    $Global:DefDBMode = $dbMode

    Clear-Host
    Write-Host "Updating migrations for $dbMode database..."

    dotnet ef migrations script --context "MyDBContext$dbMode" --output "Scripts\sql\migscr$dbMode.sql"

    if (Test-Path "Scripts\sql\migscr$dbMode.sql") {
        Write-Host "Updated migrations for $dbMode database!"
    } else {
        Write-Host "Failed to update migrations for $dbMode database."
    }
}

function Update-AllMigrations {
    foreach ($dbModeVal in $listdbm) {
        Update-Migrations -dbMode $dbModeVal
    }
}

function Inv-Choice {
    Clear-Host
    Write-Host "Invalid choice!"
    Exit-Prog
}

function Main-Menu {
    Check-JqInstalled

    Clear-Host

    Write-Host "`nGenerate DB for API`n"
    Write-Host "--------------------------------------"
    Write-Host "Author Info:"
    Write-Host "Name: Luis Carvalho"
    Write-Host "Email: luiscarvalho239@gmail.com"
    Write-Host "Date creation of script: 30/09/2024"
    Write-Host "Date modification of script: 14/01/2025"
    Write-Host "--------------------------------------"
    Write-Host "`nNote: The default option is $DefDBMode"
    Write-Host "`nChoose your option:`n"

    for ($i = 0; $i -lt $listdbm.Count; $i++) {
        Write-Host "$($i + 1) - $($listdbm[$i])"
    }

    Write-Host "A - All"
    Write-Host "B - Others"
    Write-Host "C - Exit from program"
    Write-Host ""

    $choice = Read-Host
    switch ($choice.ToUpper()) {
        "" { Add-Db -dbName $listdbm[0] }
        "1" { Add-Db -dbName $listdbm[0] }
        "2" { Add-Db -dbName $listdbm[1] }
        "3" { Add-Db -dbName $listdbm[2] }
        "4" { Add-Db -dbName $listdbm[3] }
        "A" { Add-All }
        "B" { Other-Menu }
        "C" { Exit-Prog }
        default { Inv-Choice }
    }
}

function Other-Menu {
    Clear-Host
    Write-Host "Others`n"
    Write-Host "A - Update database migrations"
    Write-Host "B - Back"
    Write-Host "`nNote: The default option is B"
    Write-Host "`nChoose your option:`n"

    $choice = Read-Host
    switch ($choice.ToUpper()) {
        "" { Main-Menu }
        "B" { Main-Menu }
        "A" { Update-DbMigrationsMenu }
        default { Inv-Choice }
    }
}

function Update-DbMigrationsMenu {
    Clear-Host
    Write-Host "`nUpdate database migrations`n"
    Write-Host "A - All"
    Write-Host "B - Specific"
    Write-Host "C - Back"
    Write-Host "`nNote: The default option is C"
    Write-Host "`nChoose your option:`n"

    $choice = Read-Host
    switch ($choice.ToUpper()) {
        "" { Other-Menu }
        "C" { Other-Menu }
        "A" { Update-AllMigrations }
        "B" { Update-SpecificMigrationMenu }
        default { Inv-Choice }
    }
}

function Update-SpecificMigrationMenu {
    Clear-Host
    Write-Host "`nUpdate specific database migration`n"

    for ($i = 0; $i -lt $listdbm.Count; $i++) {
        Write-Host "$($i + 1) - $($listdbm[$i])"
    }

    Write-Host "`nSelect the option (1-$($listdbm.Count)):`n"

    $choice = Read-Host
    if ($choice -match '^[1-4]$') {
        Update-Migrations -dbMode $listdbm[$choice - 1]
    } else {
        Inv-Choice
    }

    Update-DbMigrationsMenu
}

function Exit-Prog {
    exit 0
}

Main-Menu
