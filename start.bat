@echo off
REM OGFN Matchmaker - Backend Service
REM This batch file runs the matchmaker as a backend API service

setlocal enabledelayedexpansion

echo.
echo ============================================
echo   OGFN Matchmaker v27.11 - Backend Service
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

REM Change to script directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
)

REM Build TypeScript
echo [INFO] Building TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo [OK] Build successful
echo.

REM Check if port 5353 is in use and kill it
echo [INFO] Checking port 5353...
netstat -ano | findstr :5353 >nul 2>nul
if %errorlevel% equ 0 (
    echo [INFO] Port 5353 is in use, freeing it...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5353') do (
        taskkill /PID %%a /F >nul 2>nul
    )
    timeout /t 2 /nobreak
)

REM Start the backend service
echo.
echo ============================================
echo   BACKEND SERVICE RUNNING
echo ============================================
echo.
echo Matchmaker API running on:
echo   http://26.101.130.210:5353
echo.
echo Endpoints:
echo   GET  /                 - Health check
echo   POST /api/game/enter   - Enter game (from frontend)
echo.
echo Press CTRL+C to stop the service
echo ============================================
echo.

call http-server dist -p 5353 -c-1

pause


