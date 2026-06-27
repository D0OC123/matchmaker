/**
 * GameServerService - Handles communication with the game server backend
 * Manages player entry into the game when they accept a match
 */

import type { MatchInfo } from '../types/index';
import { BACKEND_CONFIG } from '../config/defaults';

/**
 * Response from game server when player enters
 */
export interface GameServerResponse {
  success: boolean;
  message: string;
  gameId?: string;
  serverAddress?: string;
  sessionToken?: string;
}

/**
 * GameServerService class - Communicates with backend game server
 * Handles player entry into actual game after matchmaking
 */
export class GameServerService {
  /**
   * Sends player to game server
   * Called when player clicks "Accept & Continue" after match found
   * @param matchInfo - Information about the found match
   * @param playerId - Player ID
   * @param sessionToken - Session/auth token
   * @returns Promise with game server response
   */
  static async enterGameServer(
    matchInfo: MatchInfo,
    playerId: string,
    sessionToken?: string
  ): Promise<GameServerResponse> {
    try {
      const payload = {
        matchId: matchInfo.matchId,
        playerId,
        region: matchInfo.region,
        gameMode: matchInfo.gameMode,
        sessionToken: sessionToken || 'guest',
        timestamp: new Date().toISOString()
      };

      const response = await fetch(
        `${BACKEND_CONFIG.BASE_URL}${BACKEND_CONFIG.GAME_SERVER_ENDPOINT}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = (await response.json()) as GameServerResponse;
      return data;
    } catch (error) {
      console.error('Failed to enter game server:', error);
      // Return fallback response
      return {
        success: false,
        message: `Failed to connect to game server: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Checks if game server is reachable
   * @returns Promise<boolean> - True if server is reachable
   */
  static async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Game server health check failed:', error);
      return false;
    }
  }

  /**
   * Gets game server info/status
   * @returns Promise with server status information
   */
  static async getServerStatus(): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.BASE_URL}/status`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to get server status');
      }

      return (await response.json()) as Record<string, unknown>;
    } catch (error) {
      console.error('Failed to get server status:', error);
      return {
        online: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
