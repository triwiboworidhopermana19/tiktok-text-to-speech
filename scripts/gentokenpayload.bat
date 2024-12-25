@echo off

:: Check if token-payload-generator.ts exists, and delete it if it does
if exist "token-payload-generator.ts" (
    echo Deleting existing token-payload-generator.ts...
    del /f /q "token-payload-generator.ts"
)

:: Generate token-payload-generator.ts content
echo Writing token-payload-generator.ts...

echo import fs from 'fs';import moment from 'moment-timezone';import { Encryptor, LicensePayload } from './lib/license-checker';var privateKey = fs.readFileSync('./id_rsa', 'utf8');var encryptor: Encryptor = new Encryptor(privateKey);var payload: LicensePayload = {timezone: 'Asia/Jakarta',expiredAt: moment().tz('Asia/Jakarta').add(50, 'years').toDate()};var signature = encryptor.encrypt(payload);console.log(signature); > token-payload-generator.ts

:: Check if the file was created successfully
if not exist "token-payload-generator.ts" (
    echo Error: Failed to create token-payload-generator.ts.
    exit /b 1
)

:: Execute the generated token-payload-generator.ts using tsx
echo Running token-payload-generator.ts...
tsx token-payload-generator.ts
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to execute token-payload-generator.ts.
    exit /b 1
)

echo Token payload generated successfully.
