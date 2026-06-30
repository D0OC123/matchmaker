# OGFN Matchmaker v27.11

**Real-time WebSocket Matchmaking Server for OGFN (Original Fortnite)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-ws%208.18-green.svg)](https://github.com/websockets/ws)

---

## 📋 Overview

OGFN Matchmaker is a real-time WebSocket server that provides matchmaking functionality for OGFN v27.11 clients. Based on the [FortMatchmaker](https://github.com/Lawin0129/FortMatchmaker) architecture, this TypeScript implementation handles player connections, queue management, and session assignments.

### Key Features

✅ **Real-time WebSocket Communication** - Fast, bidirectional communication with game clients  
✅ **Automatic Matchmaking Flow** - 5-stage matchmaking process (Connecting → Waiting → Queued → SessionAssignment → Play)  
✅ **TypeScript Implementation** - Type-safe, maintainable codebase  
✅ **Two Game Modes** - SOLO and ONLINE modes  
✅ **Six Regional Servers** - NA_EAST, NA_WEST, EU, ASIA_PACIFIC, SOUTH_AMERICA, MIDDLE_EAST  
✅ **XMPP Protocol Filter** - Automatically rejects XMPP connections  
✅ **Unique Session IDs** - MD5-hashed ticket, match, and session identifiers  

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **VPN** configured with IP: `26.101.130.210`

### Installation & Startup

#### Windows (BAT)
```bash
# Simply run the batch file
start.bat
```

#### Windows (PowerShell)
```powershell
# Run PowerShell script
.\start.ps1
```

#### Manual Startup
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start server
npm start
```

The server will start on:
```
ws://26.101.130.210:5353
```

---

## 🏗️ Architecture

### Matchmaking Flow

```
Client Connect → Connecting (200ms) → Waiting (1s) → Queued (2s) 
              → SessionAssignment (6s) → Play (8s) → Client Joins Game
```

### Message Protocol

The server sends JSON messages with this structure:

```typescript
{
  "name": "StatusUpdate" | "Play",
  "payload": {
    // Status-specific data
  }
}
```

### Status Stages

#### 1. **Connecting** (200ms)
Client is establishing connection to matchmaker.
```json
{
  "name": "StatusUpdate",
  "payload": {
    "state": "Connecting"
  }
}
```

#### 2. **Waiting** (1000ms)
Client is waiting for other players.
```json
{
  "name": "StatusUpdate",
  "payload": {
    "totalPlayers": 1,
    "connectedPlayers": 1,
    "state": "Waiting"
  }
}
```

#### 3. **Queued** (2000ms)
Client is added to matchmaking queue.
```json
{
  "name": "StatusUpdate",
  "payload": {
    "ticketId": "abc123...",
    "queuedPlayers": 0,
    "estimatedWaitSec": 0,
    "status": {},
    "state": "Queued"
  }
}
```

#### 4. **SessionAssignment** (6000ms)
Match found, assigning game session.
```json
{
  "name": "StatusUpdate",
  "payload": {
    "matchId": "def456...",
    "state": "SessionAssignment"
  }
}
```

#### 5. **Play** (8000ms)
Ready to join game - final message.
```json
{
  "name": "Play",
  "payload": {
    "matchId": "def456...",
    "sessionId": "ghi789...",
    "joinDelaySec": 1
  }
}
```

---

## 🎮 Game Modes

| Mode | Description | Players |
|------|-------------|---------|
| **SOLO** | Single player mode | 1 |
| **ONLINE** | Multiplayer mode | 2+ |

---

## 🌍 Regions

- **NA_EAST** - North America East
- **NA_WEST** - North America West
- **EU** - Europe
- **ASIA_PACIFIC** - Asia Pacific
- **SOUTH_AMERICA** - South America
- **MIDDLE_EAST** - Middle East

---

## 🛠️ Configuration

### Server Settings

Edit `src/index.ts` to change configuration:

```typescript
const PORT = 5353;           // WebSocket port
const HOST = '26.101.130.210'; // Server IP (VPN)
```

### Timing Configuration

Adjust matchmaking timing in `src/index.ts`:

```typescript
const TIMING = {
  CONNECTING: 200,          // Initial connection
  WAITING: 1000,            // Wait for players
  QUEUED: 2000,             // Queue entry
  SESSION_ASSIGNMENT: 6000, // Match found
  JOIN: 8000                // Ready to play
};
```

---

## 📁 Project Structure

```
Matchmaker/
├── src/
│   └── index.ts              # Main WebSocket server
├── dist/                     # Compiled JavaScript output
├── node_modules/             # Dependencies
├── package.json              # Project configuration
├── tsconfig.json             # TypeScript configuration
├── start.bat                 # Windows startup script
├── start.ps1                 # PowerShell startup script
├── README.md                 # This file
└── ARCHITECTURE.md           # Detailed architecture docs
```

---

## 🔌 Client Integration

### Connecting to Matchmaker

```javascript
// Example client code
const ws = new WebSocket('ws://26.101.130.210:5353');

ws.onopen = () => {
  console.log('Connected to matchmaker');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message.name, message.payload);
  
  if (message.name === 'Play') {
    // Join game with matchId and sessionId
    joinGame(message.payload.matchId, message.payload.sessionId);
  }
};
```

---

## 🐛 Troubleshooting

### Port Already in Use

If port 5353 is already in use, the startup scripts will automatically attempt to free it. If this fails:

**Windows:**
```bash
netstat -ano | findstr :5353
taskkill /PID <PID> /F
```

**PowerShell:**
```powershell
Get-NetTCPConnection -LocalPort 5353 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

### Connection Refused

Ensure:
1. VPN is connected to `26.101.130.210`
2. Firewall allows port `5353`
3. Server is running (`npm start`)

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## 📊 Logging

The server provides detailed logging:

```
🔌 New connection from: 192.168.1.100
🎫 Ticket ID: abc123...
🎯 Match ID: def456...
📋 Session ID: ghi789...
📤 [abc123] → Connecting
📤 [abc123] → Waiting (1/1 players)
📤 [abc123] → Queued (0 waiting)
📤 [abc123] → SessionAssignment (Match: def456)
📤 [abc123] → Play (Session: ghi789)
✅ Matchmaking complete for ticket abc123
```

---

## 🔒 Security Notes

- **XMPP Protocol Blocking**: Connections using XMPP protocol are automatically rejected
- **Unique Session IDs**: Each matchmaking session gets unique MD5-hashed identifiers
- **VPN Required**: Server binds to VPN IP `26.101.130.210` only

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- Based on [FortMatchmaker](https://github.com/Lawin0129/FortMatchmaker) by Lawin0129
- Adapted for OGFN v27.11 with TypeScript
- WebSocket library: [ws](https://github.com/websockets/ws)

---

## 🔗 Related Projects

- [FortMatchmaker](https://github.com/Lawin0129/FortMatchmaker) - Original JavaScript implementation
- [OGFN Backend](https://github.com/D0OC123/matchmaker) - Full OGFN backend server

---

## 📞 Support

For issues, questions, or contributions, please refer to the [Issues](https://github.com/D0OC123/matchmaker/issues) page.

---

**Made with ❤️ for the OGFN Community**
