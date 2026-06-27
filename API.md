# 🎮 OGFN Matchmaker - Backend API

## Overview

The Matchmaker runs as a **Backend Service** on port 5353. Clients connect via HTTP requests to:

```
http://26.101.130.210:5353
```

---

## 📡 API Endpoints

### 1. Health Check

Check if the service is running.

```
GET /
```

**Response:** `200 OK`
```
Server is running
```

---

### 2. Game Entry

Called when a player clicks **PLAY** on the frontend. Accepts the player into the game.

```
POST /api/game/enter
```

**Request Body:**
```json
{
  "mode": "SOLO",
  "region": "EU",
  "player": "PlayerName"
}
```

**Query Parameters:**
```
?mode=SOLO&region=EU&player=PlayerName
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Player entered game",
  "matchId": "MATCH_abc123",
  "gameId": "GAME_xyz789"
}
```

---

## 🔗 Frontend Integration

### How Frontend Calls Backend

When a player clicks **PLAY** on the Matchmaker UI:

1. Frontend reads:
   - Selected Game Mode (SOLO or ONLINE)
   - Selected Region (EU, NA_EAST, etc.)
   - Player Nickname

2. Frontend redirects to:
   ```
   http://26.101.130.210:5353/game?mode=SOLO&region=EU&player=Player
   ```

3. Backend processes the request and:
   - Creates or joins a match
   - Assigns the player
   - Launches the game

---

## 🛠️ Usage Examples

### cURL Examples

#### Check Health
```bash
curl http://26.101.130.210:5353/
```

#### Enter Game
```bash
curl -X POST "http://26.101.130.210:5353/api/game/enter" \
  -H "Content-Type: application/json" \
  -d '{"mode": "SOLO", "region": "EU", "player": "Player1"}'
```

#### Redirect (Frontend Method)
```
http://26.101.130.210:5353/game?mode=SOLO&region=EU&player=Player1
```

### JavaScript Examples

```javascript
// Enter game via fetch
fetch('http://26.101.130.210:5353/api/game/enter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mode: 'SOLO',
    region: 'EU',
    player: 'Player1'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📊 Game Modes

| Mode | Players | Description |
|------|---------|-------------|
| **SOLO** | 1 | Single player |
| **ONLINE** | 2 | Two players |

---

## 🌍 Regions

| Region | Code |
|--------|------|
| North America (East) | NA_EAST |
| North America (West) | NA_WEST |
| Europe | EU |
| Asia Pacific | ASIA_PACIFIC |
| South America | SOUTH_AMERICA |
| Middle East | MIDDLE_EAST |

---

## 🔄 Request/Response Flow

```
┌─────────────────────────────────────────┐
│ Frontend: Matchmaker UI                 │
│ User selects Mode + Region + clicks PLAY│
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Browser redirects to:                   │
│ /game?mode=SOLO&region=EU&player=Player │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Backend Service (Port 5353)             │
│ - Receives request                      │
│ - Validates parameters                  │
│ - Creates match                         │
│ - Enters player into game               │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Game Server                             │
│ Player is now in-game                   │
└─────────────────────────────────────────┘
```

---

## 🚀 Starting the Backend

```bash
# Run the BAT file (Windows)
start.bat

# Or use PowerShell
.\start.ps1
```

This will:
1. Install dependencies
2. Build the TypeScript code
3. Start the HTTP server on port 5353
4. Keep running as a backend service

---

## 📝 Notes

- The service runs as a **static file server** serving compiled JavaScript
- No database required (all in-memory)
- Stateless service (each request is independent)
- CORS is disabled by default
- Cache is set to 3600 seconds

---

## 🔐 Security Considerations

⚠️ **This is a development service!** For production:
- Add authentication/authorization
- Enable CORS properly
- Use HTTPS
- Implement rate limiting
- Add request validation
- Use environment variables for configuration

---

**Version:** 27.11.0  
**Last Updated:** June 27, 2026
