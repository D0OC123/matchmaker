/**
 * OGFN Matchmaker v27.11 - WebSocket Server
 * Real-time matchmaking service for OGFN (Original Fortnite) clients
 * Based on FortMatchmaker architecture adapted for OGFN v27.11
 * 
 * Protocol: WebSocket (ws://)
 * Port: 5353 (configurable)
 * IP: 26.101.130.210 (VPN IP)
 */

import { WebSocketServer, WebSocket } from 'ws';
import * as crypto from 'crypto';

// Configuration
const PORT = 5353;
const HOST = '26.101.130.210';

// Status messages timing (in milliseconds)
const TIMING = {
  CONNECTING: 200,        // Initial connection status
  WAITING: 1000,          // Waiting for players (800ms after Connecting)
  QUEUED: 2000,           // Added to queue (1s after Waiting)
  SESSION_ASSIGNMENT: 6000, // Match found, assigning session (4s after Queued)
  JOIN: 8000              // Ready to join (2s after SessionAssignment)
};

// Game modes supported
enum GameMode {
  SOLO = 'SOLO',
  ONLINE = 'ONLINE'
}

// Regions supported
enum Region {
  NA_EAST = 'NA_EAST',
  NA_WEST = 'NA_WEST',
  EU = 'EU',
  ASIA_PACIFIC = 'ASIA_PACIFIC',
  SOUTH_AMERICA = 'SOUTH_AMERICA',
  MIDDLE_EAST = 'MIDDLE_EAST'
}

/**
 * WebSocket Message Interface
 */
interface MatchmakerMessage {
  name: string;
  payload: Record<string, unknown>;
}

/**
 * Create unique hash IDs for tickets, matches, and sessions
 */
function createUniqueId(prefix: string): string {
  return crypto.createHash('md5').update(`${prefix}${Date.now()}${Math.random()}`).digest('hex');
}

/**
 * Initialize WebSocket Server
 */
const wss = new WebSocketServer({ 
  port: PORT,
  host: HOST
});

wss.on('listening', () => {
  console.log('============================================');
  console.log('   OGFN Matchmaker v27.11 - WebSocket Server');
  console.log('============================================');
  console.log(`✅ Server started successfully`);
  console.log(`📡 Listening on: ws://${HOST}:${PORT}`);
  console.log(`🎮 Game Modes: ${Object.values(GameMode).join(', ')}`);
  console.log(`🌍 Regions: ${Object.values(Region).join(', ')}`);
  console.log('============================================');
  console.log('Waiting for client connections...\n');
});

wss.on('error', (error) => {
  console.error('❌ WebSocket Server Error:', error.message);
});

/**
 * Handle new WebSocket connection
 */
wss.on('connection', async (ws: WebSocket, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`🔌 New connection from: ${clientIp}`);

  // Check if connection is using XMPP protocol (not supported)
  const protocol = req.headers['sec-websocket-protocol'] || '';
  if (protocol.toLowerCase().includes('xmpp')) {
    console.log(`⚠️  XMPP protocol detected - closing connection`);
    ws.close();
    return;
  }

  // Generate unique IDs for this matchmaking session
  const ticketId = createUniqueId('ticket_');
  const matchId = createUniqueId('match_');
  const sessionId = createUniqueId('session_');

  console.log(`🎫 Ticket ID: ${ticketId}`);
  console.log(`🎯 Match ID: ${matchId}`);
  console.log(`📋 Session ID: ${sessionId}`);

  // Schedule status updates according to timing configuration
  setTimeout(() => sendConnecting(ws), TIMING.CONNECTING);
  setTimeout(() => sendWaiting(ws), TIMING.WAITING);
  setTimeout(() => sendQueued(ws, ticketId), TIMING.QUEUED);
  setTimeout(() => sendSessionAssignment(ws, matchId), TIMING.SESSION_ASSIGNMENT);
  setTimeout(() => sendJoin(ws, matchId, sessionId), TIMING.JOIN);

  /**
   * Send "Connecting" status update
   */
  function sendConnecting(socket: WebSocket) {
    const message: MatchmakerMessage = {
      name: 'StatusUpdate',
      payload: {
        state: 'Connecting'
      }
    };
    socket.send(JSON.stringify(message));
    console.log(`📤 [${ticketId.substring(0, 8)}] → Connecting`);
  }

  /**
   * Send "Waiting" status update
   */
  function sendWaiting(socket: WebSocket) {
    const message: MatchmakerMessage = {
      name: 'StatusUpdate',
      payload: {
        totalPlayers: 1,
        connectedPlayers: 1,
        state: 'Waiting'
      }
    };
    socket.send(JSON.stringify(message));
    console.log(`📤 [${ticketId.substring(0, 8)}] → Waiting (1/1 players)`);
  }

  /**
   * Send "Queued" status update
   */
  function sendQueued(socket: WebSocket, ticket: string) {
    const message: MatchmakerMessage = {
      name: 'StatusUpdate',
      payload: {
        ticketId: ticket,
        queuedPlayers: 0,
        estimatedWaitSec: 0,
        status: {},
        state: 'Queued'
      }
    };
    socket.send(JSON.stringify(message));
    console.log(`📤 [${ticketId.substring(0, 8)}] → Queued (0 waiting)`);
  }

  /**
   * Send "SessionAssignment" status update
   */
  function sendSessionAssignment(socket: WebSocket, match: string) {
    const message: MatchmakerMessage = {
      name: 'StatusUpdate',
      payload: {
        matchId: match,
        state: 'SessionAssignment'
      }
    };
    socket.send(JSON.stringify(message));
    console.log(`📤 [${ticketId.substring(0, 8)}] → SessionAssignment (Match: ${matchId.substring(0, 8)})`);
  }

  /**
   * Send "Play" command - tells client to join the game
   */
  function sendJoin(socket: WebSocket, match: string, session: string) {
    const message: MatchmakerMessage = {
      name: 'Play',
      payload: {
        matchId: match,
        sessionId: session,
        joinDelaySec: 1
      }
    };
    socket.send(JSON.stringify(message));
    console.log(`📤 [${ticketId.substring(0, 8)}] → Play (Session: ${sessionId.substring(0, 8)})`);
    console.log(`✅ Matchmaking complete for ticket ${ticketId.substring(0, 8)}\n`);
  }

  // Handle incoming messages from client
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log(`📥 Received from client:`, message);
    } catch (error) {
      console.error('❌ Error parsing client message:', error);
    }
  });

  // Handle connection close
  ws.on('close', () => {
    console.log(`🔌 Connection closed for ticket ${ticketId.substring(0, 8)}\n`);
  });

  // Handle connection errors
  ws.on('error', (error) => {
    console.error(`❌ WebSocket error for ticket ${ticketId.substring(0, 8)}:`, error.message);
  });
});

/**
 * Graceful shutdown
 */
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down OGFN Matchmaker...');
  wss.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Shutting down OGFN Matchmaker...');
  wss.close(() => {
    console.log('✅ Server closed gracefully');
    process.exit(0);
  });
});
