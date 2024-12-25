@echo off

:: Check if the private key already exists
echo Generating Key Pair Encrypt/Decrypt
if exist "./id_rsa" (
    echo Skip generating Key Pair. Reason: Key pair already exists.
) else (
    echo Generating Key Pair...
    call .\scripts\genkeypair.bat
    if %ERRORLEVEL% NEQ 0 (
        echo Error generating key pair
        exit /b 1
    )
)

echo.

:: Generate the token payload
echo Generating Token Payload
call .\scripts\gentokenpayload.bat
if %ERRORLEVEL% NEQ 0 (
    echo Error generating token payload
    exit /b 1
)

echo.

:: Install dependencies & Start the application in development mode
echo Installing dependencies && Starting an application in development mode
npm install && npm run dev
if %ERRORLEVEL% NEQ 0 (
    echo Error installing dependencies or Starting an application
    exit /b 1
)

echo Done.
