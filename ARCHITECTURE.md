# OGFN Matchmaker v27.11 - Architecture Documentation

## System Overview

The OGFN Matchmaker is a **real-time WebSocket server** that handles matchmaking for OGFN (Original Fortnite) v27.11 clients. It provides a stateful, event-driven matchmaking flow that simulates the process of finding and joining game sessions.

---

## Technology Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | v18+ |
| **Language** | TypeScript | v5.0 |
| **WebSocket** | ws (WebSocket library) | v8.18 |
| **Protocol** | WebSocket (ws://) | - |
| **Hashing** | crypto (Node.js built-in) | - |

---

## Server Architecture

### Core Components

```
┌─────────────────────────────────────────┐
│         WebSocket Server (ws)           │
│         Port: 5353                      │
│         Host: 26.101.130.210            │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│       Connection Handler                │
│  - Protocol Validation (No XMPP)        │
│  - ID Generation (ticket/match/session) │
│  - Event Scheduling                     │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│       Matchmaking State Machine         │
│  1. Connecting                          │
│  2. Waiting                             │
│  3. Queued                              │
│  4. SessionAssignment                   │
│  5. Play (Join)                         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│          Client (OGFN Game)             │
│  - Receives status updates              │
│  - Joins game on "Play" message         │
└─────────────────────────────────────────┘
```

---

## Matchmaking Flow

### State Transition Diagram

```
    [Client Connects]
           │
           ▼
    ┌──────────────┐
    │  Connecting  │ ◄──── 200ms after connection
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │   Waiting    │ ◄──── 1000ms (waiting for players)
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │    Queued    │ ◄──── 2000ms (in matchmaking queue)
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │SessionAssign │ ◄──── 6000ms (match found)
    └──────────────┘
           │
           ▼
    ┌──────────────┐
    │     Play     │ ◄──── 8000ms (ready to join)
    └──────────────┘
           │
           ▼
    [Client Joins Game]
```

### Timing Configuration

All timings are configurable in `src/index.ts`:

```typescript
const TIMING = {
  CONNECTING: 200,          // Initial connection acknowledgment
  WAITING: 1000,            // Waiting for additional players
  QUEUED: 2000,             // Placed in matchmaking queue
  SESSION_ASSIGNMENT: 6000, // Match found, assigning session
  JOIN: 8000                // Final message to join game
};
```

**Total Matchmaking Time**: ~8 seconds from connection to game join

---

## WebSocket Protocol

### Message Format

All messages use JSON with this structure:

```typescript
interface MatchmakerMessage {
  name: string;           // Message type: "StatusUpdate" or "Play"
  payload: Record<string, unknown>; // Message-specific data
}
```

### Message Types

#### 1. StatusUpdate

Used for all intermediate matchmaking states.

**Structure:**
```json
{
  "name": "StatusUpdate",
  "payload": {
    "state": string,        // Current state
    ...additionalFields     // State-specific data
  }
}
```

#### 2. Play

Final message instructing client to join the game.

**Structure:**
```json
{
  "name": "Play",
  "payload": {
    "matchId": string,      // Unique match identifier
    "sessionId": string,    // Unique session identifier
    "joinDelaySec": number  // Delay before joining (seconds)
  }
}
```

---

## Unique ID Generation

The server generates three unique identifiers for each matchmaking session:

### Ticket ID
- **Purpose**: Identifies the matchmaking request
- **Format**: MD5 hash of `"ticket_" + timestamp + random`
- **Used in**: Queued state

### Match ID
- **Purpose**: Identifies the found match/game session
- **Format**: MD5 hash of `"match_" + timestamp + random`
- **Used in**: SessionAssignment and Play states

### Session ID
- **Purpose**: Identifies the specific player session
- **Format**: MD5 hash of `"session_" + timestamp + random`
- **Used in**: Play state

**Implementation:**
```typescript
function createUniqueId(prefix: string): string {
  return crypto
    .createHash('md5')
    .update(`${prefix}${Date.now()}${Math.random()}`)
    .digest('hex');
}
```

---

## Connection Lifecycle

### 1. Connection Establishment

```typescript
wss.on('connection', async (ws: WebSocket, req) => {
  // Extract client IP
  const clientIp = req.socket.remoteAddress;
  
  // Validate protocol (reject XMPP)
  const protocol = req.headers['sec-websocket-protocol'] || '';
  if (protocol.toLowerCase().includes('xmpp')) {
    ws.close();
    return;
  }
  
  // Generate unique IDs
  const ticketId = createUniqueId('ticket_');
  const matchId = createUniqueId('match_');
  const sessionId = createUniqueId('session_');
  
  // Schedule status updates...
});
```

### 2. Event Scheduling

Five timed events are scheduled immediately upon connection:

```typescript
setTimeout(() => sendConnecting(ws), TIMING.CONNECTING);
setTimeout(() => sendWaiting(ws), TIMING.WAITING);
setTimeout(() => sendQueued(ws, ticketId), TIMING.QUEUED);
setTimeout(() => sendSessionAssignment(ws, matchId), TIMING.SESSION_ASSIGNMENT);
setTimeout(() => sendJoin(ws, matchId, sessionId), TIMING.JOIN);
```

### 3. Message Handlers

The server registers handlers for:
- **Incoming messages** from client (logged but not processed)
- **Connection close** events
- **Error** events

### 4. Connection Termination

After the "Play" message is sent, the client is expected to:
1. Parse the `matchId` and `sessionId`
2. Close the WebSocket connection
3. Connect to the game server with the provided IDs

---

## Game Modes

The server supports two game modes:

```typescript
enum GameMode {
  SOLO = 'SOLO',      // Single player
  ONLINE = 'ONLINE'   // Multiplayer
}
```

**Note**: Game mode is currently not extracted from client requests. Future versions may parse mode from connection query parameters.

---

## Regional Servers

The server supports six regions:

```typescript
enum Region {
  NA_EAST = 'NA_EAST',              // North America East
  NA_WEST = 'NA_WEST',              // North America West
  EU = 'EU',                        // Europe
  ASIA_PACIFIC = 'ASIA_PACIFIC',    // Asia Pacific
  SOUTH_AMERICA = 'SOUTH_AMERICA',  // South America
  MIDDLE_EAST = 'MIDDLE_EAST'       // Middle East
}
```

**Note**: Region selection is not currently implemented in the connection handler. Future versions may route to different server instances based on region.

---

## Security Features

### 1. XMPP Protocol Filtering

XMPP (Extensible Messaging and Presence Protocol) connections are automatically rejected:

```typescript
const protocol = req.headers['sec-websocket-protocol'] || '';
if (protocol.toLowerCase().includes('xmpp')) {
  ws.close();
  return;
}
```

**Reason**: OGFN clients use standard WebSocket protocol, not XMPP. This prevents incompatible clients from connecting.

### 2. IP Binding

The server binds exclusively to the VPN IP address:

```typescript
const HOST = '26.101.130.210';
```

This ensures the server is only accessible through the configured VPN network.

### 3. Unique Session Identifiers

MD5 hashing with timestamp and random component prevents:
- Session ID collisions
- Predictable session IDs
- Session hijacking attempts

---

## Logging System

The server provides comprehensive logging for monitoring and debugging:

### Connection Logs
```
🔌 New connection from: 192.168.1.100
```

### ID Generation Logs
```
🎫 Ticket ID: abc123...
🎯 Match ID: def456...
📋 Session ID: ghi789...
```

### Status Update Logs
```
📤 [abc123] → Connecting
📤 [abc123] → Waiting (1/1 players)
📤 [abc123] → Queued (0 waiting)
📤 [abc123] → SessionAssignment (Match: def456)
📤 [abc123] → Play (Session: ghi789)
```

### Completion Logs
```
✅ Matchmaking complete for ticket abc123
```

### Error Logs
```
❌ WebSocket error for ticket abc123: Connection reset
```

---

## Scalability Considerations

### Current Limitations

1. **Single Server Instance**: No load balancing or horizontal scaling
2. **No Database**: Session data not persisted
3. **No Match Queuing**: Players are immediately matched (simulated)
4. **No Cross-Region Routing**: All regions handled by single server

### Future Improvements

1. **Redis Integration**: Store active sessions and queue state
2. **Load Balancer**: Distribute connections across multiple instances
3. **Region-Specific Servers**: Deploy separate servers per region
4. **Real Match Logic**: Implement skill-based matchmaking (MMR/ELO)
5. **Player Pool Management**: Queue multiple players and form real matches

---

## Error Handling

### Server Errors

```typescript
wss.on('error', (error) => {
  console.error('❌ WebSocket Server Error:', error.message);
});
```

### Connection Errors

```typescript
ws.on('error', (error) => {
  console.error(`❌ WebSocket error for ticket ${ticketId}:`, error.message);
});
```

### Graceful Shutdown

```typescript
process.on('SIGINT', () => {
  wss.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});
```

---

## Development Workflow

### 1. Development Mode

```bash
npm run dev
```

Watches TypeScript files and rebuilds on changes (does not restart server).

### 2. Build Production

```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/` folder.

### 3. Start Server

```bash
npm start
```

Runs the compiled JavaScript server.

---

## Testing

### Manual Testing with wscat

Install wscat (WebSocket CLI client):
```bash
npm install -g wscat
```

Connect to the matchmaker:
```bash
wscat -c ws://26.101.130.210:5353
```

Expected output:
```json
{"name":"StatusUpdate","payload":{"state":"Connecting"}}
{"name":"StatusUpdate","payload":{"totalPlayers":1,"connectedPlayers":1,"state":"Waiting"}}
{"name":"StatusUpdate","payload":{"ticketId":"abc...","queuedPlayers":0,"estimatedWaitSec":0,"status":{},"state":"Queued"}}
{"name":"StatusUpdate","payload":{"matchId":"def...","state":"SessionAssignment"}}
{"name":"Play","payload":{"matchId":"def...","sessionId":"ghi...","joinDelaySec":1}}
```

### Testing with JavaScript Client

```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://26.101.130.210:5353');

ws.on('open', () => {
  console.log('Connected to matchmaker');
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);
  console.log(`Received: ${msg.name}`, msg.payload);
  
  if (msg.name === 'Play') {
    console.log('Matchmaking complete!');
    console.log('Match ID:', msg.payload.matchId);
    console.log('Session ID:', msg.payload.sessionId);
    ws.close();
  }
});
```

---

## Configuration Files

### package.json

```json
{
  "name": "ogfn-matchmaker",
  "version": "27.11.0",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/ws": "^8.5.12",
    "typescript": "^5.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## Comparison with FortMatchmaker

| Feature | FortMatchmaker | OGFN Matchmaker v27.11 |
|---------|----------------|------------------------|
| **Language** | JavaScript | TypeScript |
| **Type Safety** | ❌ No | ✅ Yes |
| **Port** | 80 | 5353 |
| **Host Binding** | All interfaces (0.0.0.0) | Specific IP (26.101.130.210) |
| **Game Modes** | Not specified | SOLO, ONLINE |
| **Regions** | Not specified | 6 regions defined |
| **Documentation** | Basic README | Comprehensive docs |
| **Logging** | Minimal | Detailed with emojis |
| **Error Handling** | Basic | Comprehensive |

---

## Future Roadmap

### Phase 1: Core Functionality ✅
- [x] WebSocket server implementation
- [x] Matchmaking state machine
- [x] Unique ID generation
- [x] XMPP filtering
- [x] Comprehensive logging

### Phase 2: Enhanced Features (Planned)
- [ ] Parse game mode from client request
- [ ] Parse region from client request
- [ ] Real player queue management
- [ ] Skill-based matchmaking (MMR)
- [ ] Session persistence (Redis)

### Phase 3: Scalability (Future)
- [ ] Horizontal scaling support
- [ ] Load balancing
- [ ] Region-specific server routing
- [ ] Database integration
- [ ] Monitoring dashboard

---

## Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Build and test locally
5. Submit a pull request

---

## License

MIT License - See LICENSE file for details.

---

**Last Updated**: 2026-06-30  
**Version**: 27.11.0  
**Author**: OGFN Community
