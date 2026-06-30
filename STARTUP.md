# OGFN Matchmaker v27.11 - Startup Guide

## Quick Start

### Windows (BAT File)

Simply double-click or run:

```bash
start.bat
```

The script will:
1. ✅ Check if Node.js is installed
2. ✅ Check if port 5353 is available (and free it if needed)
3. ✅ Install dependencies (if not already installed)
4. ✅ Build TypeScript code
5. ✅ Start the WebSocket server

### Windows (PowerShell)

Right-click PowerShell script and "Run with PowerShell" or:

```powershell
.\start.ps1
```

### Manual Startup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start server
npm start
```

---

## What You'll See

When the server starts successfully:

```
============================================
   OGFN Matchmaker v27.11 - WebSocket Server
============================================
✅ Server started successfully
📡 Listening on: ws://26.101.130.210:5353
🎮 Game Modes: SOLO, ONLINE
🌍 Regions: NA_EAST, NA_WEST, EU, ASIA_PACIFIC, SOUTH_AMERICA, MIDDLE_EAST
============================================
Waiting for client connections...
```

---

## Testing the Server

### Option 1: Using the Test Client (Recommended)

```bash
node test-client.js
```

You'll see:
```
============================================
   OGFN Matchmaker Test Client
============================================

Connecting to: ws://26.101.130.210:5353

✅ Connected to matchmaker

📥 [200ms] Received: StatusUpdate
   🔗 State: Connecting to matchmaker...

📥 [1000ms] Received: StatusUpdate
   ⏳ State: Waiting for players
      Total players: 1
      Connected: 1

📥 [2000ms] Received: StatusUpdate
   🎫 State: In matchmaking queue
      Ticket ID: abc123def456...
      Queued players: 0
      Estimated wait: 0s

📥 [6000ms] Received: StatusUpdate
   🎯 State: Match found!
      Match ID: def456ghi789...

📥 [8000ms] Received: Play
   ✅ MATCHMAKING COMPLETE!

   Game Information:
      Match ID:   def456ghi789jkl012...
      Session ID: ghi789jkl012mno345...
      Join delay: 1 second(s)

   🎮 Ready to join game!
```

### Option 2: Using wscat (CLI Tool)

Install wscat globally:
```bash
npm install -g wscat
```

Connect to the server:
```bash
wscat -c ws://26.101.130.210:5353
```

You'll receive 5 JSON messages over 8 seconds.

### Option 3: Using Browser Console

Open `index.html` in a browser, then open developer console and run:

```javascript
const ws = new WebSocket('ws://26.101.130.210:5353');

ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log(JSON.parse(e.data));
ws.onclose = () => console.log('Disconnected');
```

---

## Server Logs

When a client connects, you'll see:

```
🔌 New connection from: 192.168.1.100
🎫 Ticket ID: abc123def456
🎯 Match ID: def456ghi789
📋 Session ID: ghi789jkl012
📤 [abc123de] → Connecting
📤 [abc123de] → Waiting (1/1 players)
📤 [abc123de] → Queued (0 waiting)
📤 [abc123de] → SessionAssignment (Match: def456gh)
📤 [abc123de] → Play (Session: ghi789jk)
✅ Matchmaking complete for ticket abc123de

🔌 Connection closed for ticket abc123de
```

---

## Stopping the Server

Press **CTRL+C** in the terminal window where the server is running.

You'll see:
```
🛑 Shutting down OGFN Matchmaker...
✅ Server closed gracefully
```

---

## Troubleshooting

### Port 5353 Already in Use

**Symptom:**
```
Error: listen EADDRINUSE: address already in use 0.0.0.0:5353
```

**Solution:**

The startup scripts automatically handle this, but if needed manually:

**Windows CMD:**
```bash
netstat -ano | findstr :5353
taskkill /PID <PID> /F
```

**PowerShell:**
```powershell
Get-NetTCPConnection -LocalPort 5353 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

---

### Node.js Not Found

**Symptom:**
```
[ERROR] Node.js is not installed!
```

**Solution:**

Install Node.js from: https://nodejs.org/

Recommended version: v18.0.0 or higher

---

### Cannot Connect to Server

**Symptom:**
```
Connection error: ECONNREFUSED
```

**Checklist:**
1. ✅ Is the server running? (`npm start`)
2. ✅ Is VPN connected to 26.101.130.210?
3. ✅ Is firewall blocking port 5353?
4. ✅ Can you ping 26.101.130.210?

**Test connectivity:**
```bash
ping 26.101.130.210
telnet 26.101.130.210 5353
```

---

### Build Errors

**Symptom:**
```
[ERROR] Build failed!
```

**Solution:**

Clean and rebuild:
```bash
# Delete compiled output and dependencies
rmdir /s /q dist node_modules

# Reinstall and rebuild
npm install
npm run build
```

---

### TypeScript Errors

**Symptom:**
```
error TS2307: Cannot find module 'ws'
```

**Solution:**

Install TypeScript definitions:
```bash
npm install --save-dev @types/ws @types/node
```

---

## Development Mode

For development with auto-rebuild on file changes:

```bash
npm run dev
```

This watches TypeScript files and rebuilds automatically. You'll need to restart the server manually after changes.

**Recommended workflow:**

Terminal 1 (Watch mode):
```bash
npm run dev
```

Terminal 2 (Run server):
```bash
npm start
```

When you make code changes:
1. Watch mode rebuilds automatically
2. Press CTRL+C in Terminal 2
3. Run `npm start` again

---

## Configuration

### Change Port

Edit `src/index.ts`:

```typescript
const PORT = 5353; // Change this
```

Then rebuild:
```bash
npm run build
```

### Change IP Address

Edit `src/index.ts`:

```typescript
const HOST = '26.101.130.210'; // Change this
```

Then rebuild:
```bash
npm run build
```

### Adjust Matchmaking Timing

Edit `src/index.ts`:

```typescript
const TIMING = {
  CONNECTING: 200,          // Change these values
  WAITING: 1000,
  QUEUED: 2000,
  SESSION_ASSIGNMENT: 6000,
  JOIN: 8000
};
```

Then rebuild:
```bash
npm run build
```

---

## File Structure

```
Matchmaker/
├── src/
│   └── index.ts          # Main WebSocket server (EDIT HERE)
├── dist/
│   └── index.js          # Compiled JavaScript (AUTO-GENERATED)
├── node_modules/         # Dependencies (AUTO-GENERATED)
├── start.bat             # Windows startup script
├── start.ps1             # PowerShell startup script
├── test-client.js        # Test client
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── README.md             # Project overview
├── API.md                # API documentation
├── ARCHITECTURE.md       # Technical documentation
└── STARTUP.md            # This file
```

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start the WebSocket server |
| `npm run dev` | Watch mode (rebuild on changes) |
| `node test-client.js` | Run test client |

---

## System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: 8.0.0 or higher (comes with Node.js)
- **Operating System**: Windows 10/11
- **Network**: VPN access to 26.101.130.210
- **Port**: 5353 must be available

---

## Next Steps

After starting the server:

1. **Test the server** using `node test-client.js`
2. **Read the API documentation** in `API.md`
3. **Integrate with your OGFN client** using the WebSocket protocol
4. **Monitor server logs** for debugging

---

## Support

For issues or questions:
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Check [API.md](API.md) for integration guide
- Check [README.md](README.md) for project overview

---

## Quick Commands Reference

```bash
# Start server (BAT)
start.bat

# Start server (PowerShell)
.\start.ps1

# Start server (Manual)
npm install && npm run build && npm start

# Test server
node test-client.js

# Check server status
netstat -ano | findstr :5353

# Stop server
CTRL+C (in server terminal)
```

---

**Made with ❤️ for the OGFN Community**
