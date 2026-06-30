@echo off
title OGFN Matchmaker v27.11 - WebSocket Server
color 0A

echo ============================================
echo    OGFN Matchmaker v27.11 - Startup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Check if port 5353 is in use
echo [INFO] Checking port 5353...
netstat -ano | findstr ":5353" >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Port 5353 is in use!
    echo [INFO] Attempting to free port...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5353"') do taskkill /F /PID %%a >nul 2>nul
    timeout /t 2 >nul
)

REM Install dependencies if needed
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
) else (
    echo [OK] Dependencies found
)

REM Build TypeScript
echo [INFO] Building TypeScript...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Build successful

REM Start WebSocket Server
echo [INFO] Starting WebSocket Server...
echo ============================================
call npm start

pause
