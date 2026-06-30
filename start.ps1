# OGFN Matchmaker v27.11 - WebSocket Server Startup Script
# PowerShell version

$host.UI.RawUI.WindowTitle = "OGFN Matchmaker v27.11 - WebSocket Server"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "   OGFN Matchmaker v27.11 - Startup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "[OK] Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if port 5353 is in use
Write-Host "[INFO] Checking port 5353..." -ForegroundColor Yellow
$port5353 = Get-NetTCPConnection -LocalPort 5353 -ErrorAction SilentlyContinue
if ($port5353) {
    Write-Host "[WARNING] Port 5353 is in use!" -ForegroundColor Yellow
    Write-Host "[INFO] Attempting to free port..." -ForegroundColor Yellow
    $port5353 | ForEach-Object {
        Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "[OK] Dependencies found" -ForegroundColor Green
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

# Start WebSocket Server
Write-Host "[INFO] Starting WebSocket Server..." -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
npm start

Read-Host "Press Enter to exit"
