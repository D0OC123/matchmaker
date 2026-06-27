# OGFN Matchmaker - Backend Service
# This script runs the matchmaker as a backend API service

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  OGFN Matchmaker v27.11 - Backend Service" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Change to script directory
Set-Location $PSScriptRoot

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Build TypeScript
Write-Host "[INFO] Building TypeScript..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "[OK] Build successful" -ForegroundColor Green
Write-Host ""

# Check if port 5353 is in use and kill it
Write-Host "[INFO] Checking port 5353..." -ForegroundColor Yellow
try {
    $portProcess = Get-NetTCPConnection -LocalPort 5353 -ErrorAction SilentlyContinue
    if ($portProcess) {
        Write-Host "[INFO] Port 5353 is in use, freeing it..." -ForegroundColor Yellow
        $pid = $portProcess.OwningProcess
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
} catch { }

# Start the backend service
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  BACKEND SERVICE RUNNING" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Matchmaker API running on:" -ForegroundColor Green
Write-Host "  http://26.101.130.210:5353" -ForegroundColor Green
Write-Host ""
Write-Host "Endpoints:" -ForegroundColor Yellow
Write-Host "  GET  /                 - Health check" -ForegroundColor White
Write-Host "  POST /api/game/enter   - Enter game (from frontend)" -ForegroundColor White
Write-Host ""
Write-Host "Press CTRL+C to stop the service" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

http-server dist -p 5353 -a 26.101.130.210 -c-1

Read-Host "Press Enter to exit"


