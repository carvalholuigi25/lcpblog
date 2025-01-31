#!/bin/bash

pthproj="$HOME/Documents/projects/lcpblog/server/api/v1/lcpblogapi"
pthmig="$pthproj/Migrations"
pthdbp="$pthproj.library/Scripts/dbproviders.json"

listdbm=("SQLite" "SQLServer" "MySQL" "PostgresSQL")
DefDBMode="${listdbm[1]}"

cd "$pthproj" || { echo "Error: Directory $pthproj does not exist."; exit 1; }

function get_list_dbm {
    jq -M -r '.dbproviders[] | "\(.id) - \(.name)"' "$pthdbp" || { echo "Error reading database providers."; exit 1; }
}

mlistdbm=$(get_list_dbm)

function check_dotnet_ef_installed {
    if ! command -v dotnet-ef &>/dev/null; then
        dotnet tool install --global dotnet-ef
    else
        echo "Dotnet EF Core Tools installed"
    fi
}

function check_jq_installed {
    if ! command -v jq &>/dev/null; then
        echo "Please install jq following this url: https://jqlang.github.io/jq/"
        exit 1
    else
        echo "jq is installed!"
    fi
}

function add_db {
    local dbName=$1
    export DefDBMode="$dbName"

    clear
    echo "Setting up database: $dbName"

    check_dotnet_ef_installed

    [ -d "$pthmig/$dbName" ] && rm -rf "$pthmig/$dbName"
    [ -d "$pthproj/Database/$dbName" ] && rm -rf "$pthproj/Database/$dbName"

    mkdir -p "$pthproj/Database/$dbName"

    dotnet ef migrations remove --force --context "MyDBContext$dbName"
    dotnet ef database drop --force --context "MyDBContext$dbName"
    dotnet ef migrations add "InitialCreate$dbName" --context "MyDBContext$dbName" --output-dir "$pthmig/$dbName"
    dotnet ef database update --context "MyDBContext$dbName"
    dotnet ef migrations script --context "MyDBContext$dbName" --output "Scripts/sql/migscr$dbName.sql"
}

function add_all {
    for dbModeVal in "${listdbm[@]}"; do
        add_db "$dbModeVal"
    done
}

function update_migrations {
    local dbMode=$1
    export DefDBMode="$dbMode"

    clear
    echo "Updating migrations for $dbMode database..."

    dotnet ef migrations script --context "MyDBContext$dbMode" --output "Scripts/sql/migscr$dbMode.sql"

    if [ -f "Scripts/sql/migscr$dbMode.sql" ]; then
        echo "Updated migrations for $dbMode database!"
    else
        echo "Failed to update migrations for $dbMode database."
    fi
}

function update_all_migrations {
    for dbModeVal in "${listdbm[@]}"; do
        update_migrations "$dbModeVal"
    done
}

function inv_choice {
    clear
    echo "Invalid choice!"
    exit_prog
}

function main_menu {
    check_jq_installed

    clear

    echo -e "\nGenerate DB for API\n"
    echo "--------------------------------------"
    echo "Author Info:"
    echo "Name: Luis Carvalho"
    echo "Email: luiscarvalho239@gmail.com"
    echo "Date creation of script: 30/09/2024"
    echo "Date modification of script: 14/01/2025"
    echo "--------------------------------------"
    echo -e "\nNote: The default option is $DefDBMode"
    echo -e "\nChoose your option:\n"
        
    for i in "${!listdbm[@]}"; do
        echo "$((i+1)) - ${listdbm[$i]}"
    done

    echo "A - All"
    echo "B - Others"
    echo "C - Exit from program"
    echo ""

    read -rp "" choice
    case ${choice^} in
        ""|1) add_db "${listdbm[0]}" ;;
        2) add_db "${listdbm[1]}" ;;
        3) add_db "${listdbm[2]}" ;;
        4) add_db "${listdbm[3]}" ;;
        A) add_all ;;
        B) other_menu ;;
        C) exit_prog ;;
        *) inv_choice ;;
    esac
}

function other_menu {
    clear
    echo -e "Others\n"
    echo "A - Update database migrations"
    echo "B - Back"
    echo -e "\nNote: The default option is B"
    echo -e "\nChoose your option:\n"
    read -rp "" choice

    case ${choice^} in
        ""|B) main_menu ;;
        A) update_db_migrations_menu ;;
        *) inv_choice ;;
    esac
}

function update_db_migrations_menu {
    clear
    echo -e "\nUpdate database migrations\n"
    echo "A - All"
    echo "B - Specific"
    echo "C - Back"
    echo -e "\nNote: The default option is C"
    echo -e "\nChoose your option:\n"
    read -rp "" choice

    case ${choice^} in
        ""|C) other_menu ;;
        A) update_all_migrations ;;
        B) update_specific_migration_menu ;;
        *) inv_choice ;;
    esac
}

function update_specific_migration_menu {
    clear
    echo -e "\nUpdate specific database migration\n"

    for dbv in "${!listdbm[@]}"; do
        echo "$((dbv+1)) - ${listdbm[$dbv]}"
    done

    echo -e "\nSelect the option (1-${#listdbm[@]}):\n"
    read -rp "" choice

    if [[ "$choice" =~ ^[1-4]$ ]]; then
        update_migrations "${listdbm[$((choice-1))]}"
    else
        inv_choice
    fi

    update_db_migrations_menu
}

function exit_prog {
    exit 0
}

main_menu
