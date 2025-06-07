# (DEVS) Tutorial - How to trust and use my api ssl certificate

## Requirements: Windows or Linux or Mac with [.NET](https://dotnet.microsoft.com/pt-br/) installed

1. Go to my api project

    `cd server\api\v1\lcpblogapi`

2. Initiate of dotnet user-secrets: (if you have it installed, skip it)

    `dotnet user-secrets init`

3. Execute the commands in command line (or other)

    1. For all endpoints

        ```text
        dotnet user-secrets set "ASPNETCORE_Kestrel__Certificates__Default__Password" "PASSWORD"
        dotnet user-secrets set "ASPNETCORE_Kestrel__Certificates__Default__Path" "PFX-PATH"
        dotnet user-secrets set "ASPNETCORE_HTTPS_PORTS" "PORT" (eg: 5000)
        ```

    2. For specific endpoints

        `dotnet user-secrets set "Kestrel:Endpoints:Https:Certificate:Password" "PASSWORD"`

        Note: This command will set `$CREDENTIAL_PLACEHOLDER$` value into certificate password in **appsettings.Development.json** of api project
        These commands will set the config of ssl certificate into your user secrets of dotnet.

4. Now, execute the commands again in command line (or other)

    1. Trust the new ssl certificate and check

        ```text
        dotnet dev-certs https -ep "PFX-PATH" -p "PASSWORD" (this will install my ssl certificate with password into your machine)
        dotnet dev-certs https --clean (this will clear any old certificates)
        dotnet dev-certs https --check (this will verify the current certificate is trusted or not)
        dotnet dev-certs https --trust (and finally, this will trust my new ssl certificate)
        ```

5. Clear and run it

    ```text
    dotnet clean
    dotnet run
    ```
