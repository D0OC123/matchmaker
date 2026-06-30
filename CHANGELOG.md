# Changelog

All notable changes to the OGFN Matchmaker project will be documented in this file.

## [27.11.0] - 2026-06-30

### 🎉 Major Rewrite - WebSocket Implementation

Complete rewrite of the matchmaker system from HTTP redirect to real WebSocket-based matchmaking.

### ✨ Added

#### Core Features
- **WebSocket Server**: Real-time bidirectional communication using `ws` library
- **Matchmaking State Machine**: 5-stage matchmaking flow (Connecting → Waiting → Queued → SessionAssignment → Play)
- **Unique Session IDs**: MD5-hashed ticket, match, and session identifiers
- **XMPP Protocol Filter**: Automatically rejects XMPP connections
- **TypeScript Implementation**: Full type safety with comprehensive interfaces and enums

#### Game Features
- **Game Modes**: SOLO and ONLINE modes
- **Regions**: Six regional servers (NA_EAST, NA_WEST, EU, ASIA_PACIFIC, SOUTH_AMERICA, MIDDLE_EAST)
- **Configurable Timing**: Adjustable matchmaking flow timing

#### Developer Tools
- **Test Client**: `test-client.js` for testing the matchmaker
- **Comprehensive Logging**: Emoji-enhanced logs with connection tracking
- **Error Handling**: Graceful shutdown and error recovery

#### Documentation
- **README.md**: Complete project overview with quick start guide
- **API.md**: Full API documentation with code examples
- **ARCHITECTURE.md**: Detailed technical architecture documentation
- **STARTUP.md**: Comprehensive startup and troubleshooting guide
- **CHANGELOG.md**: This file

#### Scripts
- **start.bat**: Windows batch startup script with port cleanup
- **start.ps1**: PowerShell startup script with enhanced error handling
- **npm scripts**: `build`, `start`, `dev` commands

### 🔄 Changed

#### Breaking Changes
- **Protocol**: Changed from HTTP redirect to WebSocket (ws://)
- **Port Binding**: Now binds to specific IP (26.101.130.210) instead of all interfaces
- **Message Format**: JSON messages with `name` and `payload` structure
- **Client Integration**: Clients must now use WebSocket protocol

#### Project Structure
- **Simplified src/**: Removed unused components, screens, services, models, utils
- **Main Entry Point**: `src/index.ts` is now the WebSocket server
- **Build Output**: Compiles to `dist/index.js`

#### Dependencies
- **Added**: `ws@^8.18.0` - WebSocket server library
- **Added**: `@types/ws@^8.5.12` - TypeScript definitions for ws
- **Removed**: `http-server` - No longer needed

### 🗑️ Removed

#### Removed Files/Features
- HTTP server implementation
- UI components (Button, LoadingAnimation, GameModeSelector, etc.)
- Screen system (MatchmakerScreen, QueueScreen, MatchFoundScreen, etc.)
- Client-side services (MatchmakerService, StorageService, etc.)
- Utility modules (time, storage, random)
- CSS styles
- Game server redirect logic

#### Rationale
These were part of the client-side UI implementation. The new WebSocket server is backend-only and doesn't need UI components.

### 🐛 Fixed
- **Port Conflicts**: Startup scripts now properly detect and free port 5353
- **Multiple IP Binding**: Server now binds to single IP as intended
- **Build Process**: Cleaner build output with proper TypeScript compilation

### 📝 Implementation Details

#### WebSocket Protocol Flow

1. **Client Connects** → Server generates unique IDs
2. **200ms** → Send "Connecting" status
3. **1000ms** → Send "Waiting" status (waiting for players)
4. **2000ms** → Send "Queued" status (with ticket ID)
5. **6000ms** → Send "SessionAssignment" (match found)
6. **8000ms** → Send "Play" message (ready to join game)

#### Message Examples

**Status Update:**
```json
{
  "name": "StatusUpdate",
  "payload": {
    "state": "Queued",
    "ticketId": "abc123...",
    "queuedPlayers": 0,
    "estimatedWaitSec": 0
  }
}
```

**Play Message:**
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

### 🔒 Security
- **XMPP Filtering**: Rejects incompatible XMPP protocol connections
- **IP Binding**: Restricted to VPN IP (26.101.130.210)
- **Unique Session IDs**: MD5 hashing prevents predictable IDs

### ⚡ Performance
- **Lightweight**: Minimal dependencies (only `ws` library)
- **Fast Matchmaking**: 8 seconds from connection to game join
- **Efficient Protocol**: WebSocket provides low-latency communication

### 📚 Documentation Coverage
- ✅ Project README with badges and overview
- ✅ Complete API documentation with examples
- ✅ Architecture documentation with diagrams
- ✅ Startup guide with troubleshooting
- ✅ Code comments in TypeScript
- ✅ Test client with colored output

### 🎯 Based On
This implementation is based on [FortMatchmaker](https://github.com/Lawin0129/FortMatchmaker) by Lawin0129, adapted for OGFN v27.11 with TypeScript and enhanced features.

### 🔮 Future Plans

#### Phase 2: Enhanced Features
- [ ] Parse game mode from client request
- [ ] Parse region from client request
- [ ] Real player queue management
- [ ] Skill-based matchmaking (MMR/ELO)
- [ ] Session persistence (Redis integration)
- [ ] Authentication system

#### Phase 3: Scalability
- [ ] Horizontal scaling support
- [ ] Load balancing
- [ ] Region-specific server routing
- [ ] Database integration
- [ ] Monitoring dashboard
- [ ] Metrics and analytics

---

## Previous Versions

### [27.11.0-beta] - Earlier Development
- Initial HTTP-based implementation (deprecated)
- Client-side UI system (removed)
- HTTP redirect to game server (replaced with WebSocket)

---

## Migration Guide (from HTTP to WebSocket)

If you were using the previous HTTP redirect version:

### Old Implementation (HTTP):
```javascript
// Client redirected to:
window.location.href = 'http://26.101.130.210:5353/game?mode=SOLO&region=EU';
```

### New Implementation (WebSocket):
```javascript
const ws = new WebSocket('ws://26.101.130.210:5353');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.name === 'Play') {
    const { matchId, sessionId } = message.payload;
    // Use matchId and sessionId to join game
  }
};
```

### Key Changes:
1. **Protocol**: HTTP → WebSocket
2. **Integration**: Redirect → Event-driven messages
3. **Session IDs**: Now provided by matchmaker
4. **Real-time**: Instant status updates during matchmaking

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **Major.Minor.Patch** format
- Version 27.11 matches OGFN version numbering

---

**Last Updated**: June 30, 2026  
**Current Version**: 27.11.0  
**Release Type**: Major (Breaking Changes)
