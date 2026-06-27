# 🚀 OGFN Matchmaker - Startup Guide

## Prerequisites

- Node.js 16+ installed ([Download](https://nodejs.org/))
- Windows OS (for .bat file)
- Connected to VPN (for 26.101.130.210 access)

---

## ⚡ Quick Start

### Option 1: Using Batch File (Easiest)

1. **Double-click** `start.bat` in the Matchmaker folder
2. Wait for the build to complete
3. Server will start automatically on `http://26.101.130.210:5353`

```bash
start.bat
```

### Option 2: Using PowerShell

1. Right-click `start.ps1` → "Run with PowerShell"
2. Wait for the build to complete
3. Server will start automatically

```powershell
.\start.ps1
```

### Option 3: Manual Command Line

```bash
# Install dependencies (first time only)
npm install

# Build the project
npm run build

# Start the server
http-server dist -p 5353
```

---

## 📋 What the Startup Script Does

1. ✅ Checks if Node.js is installed
2. ✅ Installs npm dependencies (if needed)
3. ✅ Builds TypeScript to JavaScript
4. ✅ Starts HTTP server on port 5353
5. ✅ Shows server URL and instructions

---

## 🌐 Access the Matchmaker

Once the server is running, open your browser:

```
http://26.101.130.210:5353
```

---

## 🎮 How It Works

1. **Select Region & Mode** - Choose your preferences
2. **Click PLAY** - Redirects directly to game server
3. **Game parameters** sent to: `http://26.101.130.210:5353/game`

---

## ⚙️ Server Details

| Property | Value |
|----------|-------|
| **Address** | 26.101.130.210 |
| **Port** | 5353 |
| **Protocol** | HTTP |
| **Type** | Static file server |

---

## 🔧 Troubleshooting

### "Node.js not found"
- Install Node.js from https://nodejs.org/
- Restart your computer after installation

### "Port 5353 in use"
- Change port in `start.bat` or `start.ps1`
- Or kill the process using port 5353

### "Build failed"
- Delete `node_modules` folder
- Delete `dist` folder
- Run the script again

### "Can't access 26.101.130.210"
- Check VPN connection
- Verify you're connected to the correct network

---

## 📝 Manual Build Commands

```bash
# Install dependencies
npm install

# Build only (no server)
npm run build

# Watch for changes (auto-rebuild)
npm run dev

# Start server (manual)
http-server dist -p 5353
```

---

## 🛑 Stopping the Server

- Press **CTRL+C** in the terminal/command window
- Or close the window

---

## 📞 Support

For issues or questions, check:
- `README.md` - Project documentation
- `ARCHITECTURE.md` - Technical architecture
- `package.json` - Dependencies and scripts

---

**Version:** 27.11.0  
**Last Updated:** June 27, 2026
