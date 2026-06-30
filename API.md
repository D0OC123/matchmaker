# OGFN Matchmaker v27.11 - API Documentation

## Overview

OGFN Matchmaker is a **WebSocket-based real-time matchmaking server** that handles player matchmaking for OGFN (Original Fortnite) v27.11 clients.

**Protocol**: WebSocket (ws://)  
**Server URL**: `ws://26.101.130.210:5353`  
**Based on**: [FortMatchmaker](https://github.com/Lawin0129/FortMatchmaker) architecture

---

## Connection

### WebSocket Endpoint

```
ws://26.101.130.210:5353
```

### Connection Example (JavaScript)

```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://26.101.130.210:5353');

ws.on('open', () => {
  console.log('Connected to OGFN Matchmaker');
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('Received:', message);
});

ws.on('close', () => {
  console.log('Disconnected from matchmaker');
});

ws.on('error', (error) => {
  console.error('Connection error:', error);
});
```

### Connection Example (Browser)

```javascript
const ws = new WebSocket('ws://26.101.130.210:5353');

ws.onopen = () => {
  console.log('Connected to OGFN Matchmaker');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
  
  if (message.name === 'Play') {
    // Ready to join game
    joinGame(message.payload.matchId, message.payload.sessionId);
  }
};
```

---

## Message Protocol

All messages are JSON formatted with this structure:

```typescript
{
  "name": string,     // Message type: "StatusUpdate" or "Play"
  "payload": object   // Message-specific data
}
```

---

## Server Messages (Server → Client)

The server sends 5 messages during the matchmaking flow:

### 1. Connecting (200ms after connection)

**Indicates**: Initial connection established

```json
{
  "name": "StatusUpdate",
  "payload": {
    "state": "Connecting"
  }
}
```

---

### 2. Waiting (1000ms after connection)

**Indicates**: Waiting for other players to join

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

**Fields**:
- `totalPlayers` (number): Expected number of players
- `connectedPlayers` (number): Currently connected players
- `state` (string): Always "Waiting"

---

### 3. Queued (2000ms after connection)

**Indicates**: Player added to matchmaking queue

```json
{
  "name": "StatusUpdate",
  "payload": {
    "ticketId": "abc123def456...",
    "queuedPlayers": 0,
    "estimatedWaitSec": 0,
    "status": {},
    "state": "Queued"
  }
}
```

**Fields**:
- `ticketId` (string): Unique matchmaking ticket ID (MD5 hash)
- `queuedPlayers` (number): Number of players ahead in queue
- `estimatedWaitSec` (number): Estimated wait time in seconds
- `status` (object): Additional status information
- `state` (string): Always "Queued"

---

### 4. SessionAssignment (6000ms after connection)

**Indicates**: Match found, assigning game session

```json
{
  "name": "StatusUpdate",
  "payload": {
    "matchId": "def456ghi789...",
    "state": "SessionAssignment"
  }
}
```

**Fields**:
- `matchId` (string): Unique match ID (MD5 hash)
- `state` (string): Always "SessionAssignment"

---

### 5. Play (8000ms after connection)

**Indicates**: Ready to join game - **FINAL MESSAGE**

```json
{
  "name": "Play",
  "payload": {
    "matchId": "def456ghi789...",
    "sessionId": "ghi789jkl012...",
    "joinDelaySec": 1
  }
}
```

**Fields**:
- `matchId` (string): Unique match ID (MD5 hash)
- `sessionId` (string): Unique session ID (MD5 hash)
- `joinDelaySec` (number): Recommended delay before joining (seconds)

**Action**: Client should close WebSocket and connect to game server with these IDs.

---

## Complete Flow Example

```javascript
const WebSocket = require('ws');

class MatchmakerClient {
  constructor() {
    this.ws = null;
    this.matchId = null;
    this.sessionId = null;
  }

  connect() {
    this.ws = new WebSocket('ws://26.101.130.210:5353');

    this.ws.on('open', () => {
      console.log('✅ Connected to matchmaker');
    });

    this.ws.on('message', (data) => {
      const message = JSON.parse(data);
      this.handleMessage(message);
    });

    this.ws.on('close', () => {
      console.log('🔌 Disconnected from matchmaker');
    });

    this.ws.on('error', (error) => {
      console.error('❌ Error:', error);
    });
  }

  handleMessage(message) {
    console.log(`📥 Received: ${message.name}`);

    switch (message.name) {
      case 'StatusUpdate':
        this.handleStatusUpdate(message.payload);
        break;
      
      case 'Play':
        this.handlePlay(message.payload);
        break;
    }
  }

  handleStatusUpdate(payload) {
    const state = payload.state;
    
    switch (state) {
      case 'Connecting':
        console.log('🔗 Connecting to matchmaker...');
        break;
      
      case 'Waiting':
        console.log(`⏳ Waiting for players (${payload.connectedPlayers}/${payload.totalPlayers})`);
        break;
      
      case 'Queued':
        console.log(`🎫 In queue (Ticket: ${payload.ticketId.substring(0, 8)}...)`);
        console.log(`   Players ahead: ${payload.queuedPlayers}`);
        console.log(`   Estimated wait: ${payload.estimatedWaitSec}s`);
        break;
      
      case 'SessionAssignment':
        console.log(`🎯 Match found! (ID: ${payload.matchId.substring(0, 8)}...)`);
        this.matchId = payload.matchId;
        break;
    }
  }

  handlePlay(payload) {
    this.matchId = payload.matchId;
    this.sessionId = payload.sessionId;
    
    console.log('✅ Matchmaking complete!');
    console.log(`   Match ID: ${this.matchId.substring(0, 16)}...`);
    console.log(`   Session ID: ${this.sessionId.substring(0, 16)}...`);
    console.log(`   Join delay: ${payload.joinDelaySec}s`);
    
    // Close matchmaker connection
    this.ws.close();
    
    // Join game after delay
    setTimeout(() => {
      this.joinGame();
    }, payload.joinDelaySec * 1000);
  }

  joinGame() {
    console.log('🎮 Joining game...');
    // Connect to game server with matchId and sessionId
    // Implementation depends on game client
  }
}

// Usage
const client = new MatchmakerClient();
client.connect();
```

---

## Timing

| Event | Time (ms) | Description |
|-------|-----------|-------------|
| **Connecting** | 200 | Connection acknowledgment |
| **Waiting** | 1000 | Waiting for players |
| **Queued** | 2000 | Added to queue |
| **SessionAssignment** | 6000 | Match found |
| **Play** | 8000 | Ready to join |

**Total Time**: ~8 seconds from connection to game join

---

## Game Modes

The server supports two game modes:

| Mode | Description | Players |
|------|-------------|---------|
| **SOLO** | Single player | 1 |
| **ONLINE** | Multiplayer | 2+ |

**Note**: Game mode selection is not yet implemented in the connection protocol.

---

## Regions

The server supports six regions:

- **NA_EAST** - North America East
- **NA_WEST** - North America West  
- **EU** - Europe
- **ASIA_PACIFIC** - Asia Pacific
- **SOUTH_AMERICA** - South America
- **MIDDLE_EAST** - Middle East

**Note**: Region selection is not yet implemented in the connection protocol.

---

## Error Handling

### XMPP Protocol Rejection

Connections using the XMPP protocol are automatically rejected:

```javascript
// Server will close connection if XMPP protocol is detected
ws.close();
```

### Connection Timeout

If no messages are received within 10 seconds after "Play", the client should:
1. Close the WebSocket connection
2. Retry matchmaking from the beginning

### Message Parsing Errors

Always wrap JSON parsing in try-catch:

```javascript
ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    handleMessage(message);
  } catch (error) {
    console.error('Failed to parse message:', error);
  }
});
```

---

## Testing

### Using wscat (CLI Tool)

Install wscat:
```bash
npm install -g wscat
```

Connect to matchmaker:
```bash
wscat -c ws://26.101.130.210:5353
```

Expected output:
```
Connected (press CTRL+C to quit)
< {"name":"StatusUpdate","payload":{"state":"Connecting"}}
< {"name":"StatusUpdate","payload":{"totalPlayers":1,"connectedPlayers":1,"state":"Waiting"}}
< {"name":"StatusUpdate","payload":{"ticketId":"abc...","queuedPlayers":0,"estimatedWaitSec":0,"status":{},"state":"Queued"}}
< {"name":"StatusUpdate","payload":{"matchId":"def...","state":"SessionAssignment"}}
< {"name":"Play","payload":{"matchId":"def...","sessionId":"ghi...","joinDelaySec":1}}
```

---

## Status Codes

The server uses standard WebSocket status codes:

| Code | Description |
|------|-------------|
| **1000** | Normal closure |
| **1001** | Going away (server shutdown) |
| **1002** | Protocol error |
| **1011** | Server error |

---

## Best Practices

### 1. Handle All Message Types

Always handle both `StatusUpdate` and `Play` messages:

```javascript
ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  if (message.name === 'StatusUpdate') {
    // Handle status updates
  } else if (message.name === 'Play') {
    // Ready to join game
  }
});
```

### 2. Close Connection After "Play"

After receiving the "Play" message, close the WebSocket connection:

```javascript
if (message.name === 'Play') {
  ws.close();
  // Proceed to join game
}
```

### 3. Implement Reconnection Logic

If connection fails, retry after a delay:

```javascript
function connectWithRetry(maxRetries = 3, delay = 2000) {
  let retries = 0;
  
  function connect() {
    const ws = new WebSocket('ws://26.101.130.210:5353');
    
    ws.on('error', (error) => {
      if (retries < maxRetries) {
        retries++;
        console.log(`Retrying connection (${retries}/${maxRetries})...`);
        setTimeout(connect, delay);
      } else {
        console.error('Max retries reached');
      }
    });
  }
  
  connect();
}
```

---

## Security

### VPN Required

The server binds to VPN IP `26.101.130.210`. Ensure your client:
1. Is connected to the VPN
2. Can reach IP `26.101.130.210` on port `5353`

### No Authentication

**⚠️ Warning**: The current implementation has no authentication. Anyone with access to the VPN can connect.

Future versions should implement:
- Token-based authentication
- Rate limiting
- Session validation

---

## Troubleshooting

### Cannot Connect

**Check**:
1. VPN is connected
2. Server is running (`npm start`)
3. Firewall allows port 5353
4. IP `26.101.130.210` is reachable

**Test connectivity**:
```bash
ping 26.101.130.210
telnet 26.101.130.210 5353
```

### Connection Immediately Closes

**Possible causes**:
1. Using XMPP protocol (not supported)
2. Server error
3. Port blocked by firewall

**Check server logs** for error messages.

### No Messages Received

**Check**:
1. WebSocket connection is open
2. Message handler is registered
3. JSON parsing is not failing

**Enable debug logging**:
```javascript
ws.on('message', (data) => {
  console.log('Raw message:', data.toString());
  const message = JSON.parse(data);
  console.log('Parsed message:', message);
});
```

---

## Changelog

### v27.11.0 (Current)
- ✅ WebSocket server implementation
- ✅ 5-stage matchmaking flow
- ✅ Unique ID generation (ticket, match, session)
- ✅ XMPP protocol filtering
- ✅ Comprehensive logging
- ✅ TypeScript implementation

### Future Versions
- Game mode selection from client
- Region selection from client
- Authentication system
- Real player queue management
- Skill-based matchmaking

---

## Support

For issues or questions, refer to:
- [README.md](README.md) - Getting started guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [GitHub Issues](https://github.com/D0OC123/matchmaker/issues)

---

## License

MIT License - See LICENSE file

---

**Server Version**: v27.11.0  
**Protocol**: WebSocket (ws://)  
**Port**: 5353  
**Host**: 26.101.130.210
