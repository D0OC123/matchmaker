/**
 * OGFN Matchmaker API - Backend Only
 * No UI - Pure API Service
 * 
 * Endpoints:
 * GET  /health              - Health check
 * POST /api/game/enter      - Player enters game
 * GET  /api/match/find      - Find a match
 */

import { MatchmakerService } from './services/index';
import { EventEmitter } from './services/index';
import { Region, GameMode } from './types/index';

// Initialize service
const eventEmitter = new EventEmitter();
const matchmakerService = new MatchmakerService(eventEmitter);

// Expose globally for backend access
(globalThis as unknown as Record<string, unknown>).matchmakerService = matchmakerService;
(globalThis as unknown as Record<string, unknown>).eventEmitter = eventEmitter;

console.log('✅ OGFN Matchmaker API initialized');
console.log('📡 Service ready for backend integration');
console.log('🎮 Regions:', Object.values(Region));
console.log('🎯 Modes:', Object.values(GameMode));

// Export for use in other modules
export { matchmakerService, eventEmitter };
