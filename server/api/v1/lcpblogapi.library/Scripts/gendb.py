import os
import subprocess
import json
from shutil import rmtree

pthproj = os.path.expanduser("~/Documents/projects/lcpblog/server/api/v1/lcpblogapi")
pthmig = os.path.join(pthproj, "Migrations")
pthdbp = os.path.join(pthproj + ".library", "Scripts", "dbproviders.json")

listdbm = ["SQLite", "SQLServer", "MySQL", "PostgresSQL"]
DefDBMode = listdbm[1]

if not os.path.exists(pthproj):
    print(f"Error: Directory {pthproj} does not exist.")
    exit(1)

def get_list_dbm():
    try:
        with open(pthdbp, 'r') as f:
            data = json.load(f)
        return [f"{db['id']} - {db['name']}" for db in data['dbproviders']]
    except Exception as e:
        print(f"Error reading database providers: {e}")
        exit(1)

mlistdbm = get_list_dbm()

def check_dotnet_ef_installed():
    if subprocess.call(["which", "dotnet-ef"], stdout=subprocess.PIPE, stderr=subprocess.PIPE) != 0:
        subprocess.call(["dotnet", "tool", "install", "--global", "dotnet-ef"])
    else:
        print("Dotnet EF Core Tools installed")

def check_jq_installed():
    if subprocess.call(["which", "jq"], stdout=subprocess.PIPE, stderr=subprocess.PIPE) != 0:
        print("Please install jq following this url: https://jqlang.github.io/jq/")
        exit(1)
    else:
        print("jq is installed!")

def add_db(dbName):
    global DefDBMode
    DefDBMode = dbName

    os.system('clear')
    print(f"Setting up database: {dbName}")

    check_dotnet_ef_installed()

    db_mig_path = os.path.join(pthmig, dbName)
    db_proj_path = os.path.join(pthproj, "Database", dbName)

    if os.path.exists(db_mig_path):
        rmtree(db_mig_path)
    if os.path.exists(db_proj_path):
        rmtree(db_proj_path)

    os.makedirs(db_proj_path)

    subprocess.call(["dotnet", "ef", "migrations", "remove", "--force", "--context", f"MyDBContext{dbName}"])
    subprocess.call(["dotnet", "ef", "database", "drop", "--force", "--context", f"MyDBContext{dbName}"])
    subprocess.call(["dotnet", "ef", "migrations", "add", f"InitialCreate{dbName}", "--context", f"MyDBContext{dbName}", "--output-dir", db_mig_path])
    subprocess.call(["dotnet", "ef", "database", "update", "--context", f"MyDBContext{dbName}"])
    subprocess.call(["dotnet", "ef", "migrations", "script", "--context", f"MyDBContext{dbName}", "--output", f"Scripts/sql/migscr{dbName}.sql"])

def add_all():
    for dbModeVal in listdbm:
        add_db(dbModeVal)

def update_migrations(dbMode):
    global DefDBMode
    DefDBMode = dbMode

    os.system('clear')
    print(f"Updating migrations for {dbMode} database...")

    subprocess.call(["dotnet", "ef", "migrations", "script", "--context", f"MyDBContext{dbMode}", "--output", f"Scripts/sql/migscr{dbMode}.sql"])

    if os.path.exists(f"Scripts/sql/migscr{dbMode}.sql"):
        print(f"Updated migrations for {dbMode} database!")
    else:
        print(f"Failed to update migrations for {dbMode} database.")

def update_all_migrations():
    for dbModeVal in listdbm:
        update_migrations(dbModeVal)

def inv_choice():
    os.system('clear')
    print("Invalid choice!")
    exit_prog()

def main_menu():
    check_jq_installed()

    os.system('clear')

    print("\nGenerate DB for API\n")
    print("--------------------------------------")
    print("Author Info:")
    print("Name: Luis Carvalho")
    print("Email: luiscarvalho239@gmail.com")
    print("Date creation of script: 30/09/2024")
    print("Date modification of script: 14/01/2025")
    print("--------------------------------------")
    print(f"\nNote: The default option is {DefDBMode}")
    print("\nChoose your option:\n")

    for i, db in enumerate(listdbm):
        print(f"{i + 1} - {db}")

    print("A - All")
    print("B - Others")
    print("C - Exit from program")
    print("")

    choice = input("").strip().upper()
    if choice == "" or choice == "1":
        add_db(listdbm[0])
    elif choice == "2":
        add_db(listdbm[1])
    elif choice == "3":
        add_db(listdbm[2])
    elif choice == "4":
        add_db(listdbm[3])
    elif choice == "A":
        add_all()
    elif choice == "B":
        other_menu()
    elif choice == "C":
        exit_prog()
    else:
        inv_choice()

def other_menu():
    os.system('clear')
    print("Others\n")
    print("A - Update database migrations")
    print("B - Back")
    print(f"\nNote: The default option is B")
    print("\nChoose your option:\n")

    choice = input("").strip().upper()
    if choice == "" or choice == "B":
        main_menu()
    elif choice == "A":
        update_db_migrations_menu()
    else:
        inv_choice()

def update_db_migrations_menu():
    os.system('clear')
    print("\nUpdate database migrations\n")
    print("A - All")
    print("B - Specific")
    print("C - Back")
    print(f"\nNote: The default option is C")
    print("\nChoose your option:\n")

    choice = input("").strip().upper()
    if choice == "" or choice == "C":
        other_menu()
    elif choice == "A":
        update_all_migrations()
    elif choice == "B":
        update_specific_migration_menu()
    else:
        inv_choice()

def update_specific_migration_menu():
    os.system('clear')
    print("\nUpdate specific database migration\n")

    for i, db in enumerate(listdbm):
        print(f"{i + 1} - {db}")

    print(f"\nSelect the option (1-{len(listdbm)}):\n")

    choice = input("").strip()
    if choice.isdigit() and 1 <= int(choice) <= len(listdbm):
        update_migrations(listdbm[int(choice) - 1])
    else:
        inv_choice()

    update_db_migrations_menu()

def exit_prog():
    exit(0)

main_menu()
