/**
 * OGFN Matchmaker Test Client
 * Simple WebSocket client to test the matchmaker server
 * 
 * Usage: node test-client.js
 */

const WebSocket = require('ws');

// Configuration
const MATCHMAKER_URL = 'ws://26.101.130.210:5353';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

class MatchmakerTestClient {
  constructor() {
    this.ws = null;
    this.matchId = null;
    this.sessionId = null;
    this.ticketId = null;
    this.startTime = null;
  }

  connect() {
    console.log(`${colors.cyan}============================================${colors.reset}`);
    console.log(`${colors.cyan}   OGFN Matchmaker Test Client${colors.reset}`);
    console.log(`${colors.cyan}============================================${colors.reset}`);
    console.log('');
    console.log(`Connecting to: ${MATCHMAKER_URL}`);
    console.log('');

    this.startTime = Date.now();
    this.ws = new WebSocket(MATCHMAKER_URL);

    this.ws.on('open', () => {
      console.log(`${colors.green}✅ Connected to matchmaker${colors.reset}`);
      console.log('');
    });

    this.ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(message);
      } catch (error) {
        console.error(`${colors.red}❌ Error parsing message:${colors.reset}`, error);
      }
    });

    this.ws.on('close', (code, reason) => {
      console.log('');
      console.log(`${colors.yellow}🔌 Connection closed${colors.reset}`);
      console.log(`   Code: ${code}`);
      if (reason) {
        console.log(`   Reason: ${reason}`);
      }
      
      const elapsed = Date.now() - this.startTime;
      console.log(`   Total time: ${elapsed}ms`);
      console.log('');
    });

    this.ws.on('error', (error) => {
      console.error(`${colors.red}❌ Connection error:${colors.reset}`, error.message);
      console.log('');
      console.log(`${colors.yellow}Troubleshooting:${colors.reset}`);
      console.log('  1. Ensure VPN is connected');
      console.log('  2. Verify server is running (npm start)');
      console.log('  3. Check firewall settings for port 5353');
      console.log('  4. Confirm IP 26.101.130.210 is reachable');
    });
  }

  handleMessage(message) {
    const elapsed = Date.now() - this.startTime;
    
    console.log(`${colors.blue}📥 [${elapsed}ms] Received: ${message.name}${colors.reset}`);

    if (message.name === 'StatusUpdate') {
      this.handleStatusUpdate(message.payload);
    } else if (message.name === 'Play') {
      this.handlePlay(message.payload);
    } else {
      console.log(`   Unknown message type: ${message.name}`);
    }
    
    console.log('');
  }

  handleStatusUpdate(payload) {
    const state = payload.state;
    
    switch (state) {
      case 'Connecting':
        console.log('   🔗 State: Connecting to matchmaker...');
        break;
      
      case 'Waiting':
        console.log('   ⏳ State: Waiting for players');
        console.log(`      Total players: ${payload.totalPlayers}`);
        console.log(`      Connected: ${payload.connectedPlayers}`);
        break;
      
      case 'Queued':
        this.ticketId = payload.ticketId;
        console.log('   🎫 State: In matchmaking queue');
        console.log(`      Ticket ID: ${payload.ticketId.substring(0, 16)}...`);
        console.log(`      Queued players: ${payload.queuedPlayers}`);
        console.log(`      Estimated wait: ${payload.estimatedWaitSec}s`);
        break;
      
      case 'SessionAssignment':
        this.matchId = payload.matchId;
        console.log('   🎯 State: Match found!');
        console.log(`      Match ID: ${payload.matchId.substring(0, 16)}...`);
        break;
      
      default:
        console.log(`   ℹ️  State: ${state}`);
        console.log('      Payload:', JSON.stringify(payload, null, 2));
    }
  }

  handlePlay(payload) {
    this.matchId = payload.matchId;
    this.sessionId = payload.sessionId;
    
    console.log(`${colors.green}   ✅ MATCHMAKING COMPLETE!${colors.reset}`);
    console.log('');
    console.log('   Game Information:');
    console.log(`      Match ID:   ${this.matchId.substring(0, 24)}...`);
    console.log(`      Session ID: ${this.sessionId.substring(0, 24)}...`);
    console.log(`      Join delay: ${payload.joinDelaySec} second(s)`);
    console.log('');
    console.log(`${colors.cyan}   🎮 Ready to join game!${colors.reset}`);
    
    // Close connection after receiving Play message
    setTimeout(() => {
      console.log('   Closing matchmaker connection...');
      this.ws.close(1000, 'Matchmaking complete');
    }, 1000);
  }

  disconnect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  }
}

// Run test client
const client = new MatchmakerTestClient();
client.connect();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Test client shutting down...');
  client.disconnect();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Test client shutting down...');
  client.disconnect();
  process.exit(0);
});
