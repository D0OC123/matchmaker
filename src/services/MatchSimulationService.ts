/**
 * MatchSimulationService - Simulates matchmaking backend behavior
 * Generates realistic match data and handles the entire matching flow
 * Includes random wait times and detailed match information
 */

import type { MatchInfo, MatchDetails, PlayerTeam } from '../types/index';
import { Region, GameMode } from '../types/index';
import { generateMatchId, generateTeamId, getRandomInt, getRandomElement, getRandomWaitTime } from '../utils/index';
import { delay } from '../utils/index';
import { WAIT_TIME_CONFIG, PLAYER_COUNT_BY_MODE, MAP_NAMES, MATCH_SIMULATION_DELAY_MS } from '../config/defaults';

/**
 * MatchSimulationService class - Provides match simulation capabilities
 * Generates realistic match data based on game mode and region
 */
export class MatchSimulationService {
  /**
   * Simulates searching for a match with random delay
   * Returns a promise that resolves after simulated search time
   * @returns Promise resolving to random wait time in milliseconds
   */
  static async simulateMatchSearch(): Promise<number> {
    const waitTime = getRandomWaitTime(
      WAIT_TIME_CONFIG.MIN_WAIT_MS,
      WAIT_TIME_CONFIG.MAX_WAIT_MS
    );
    await delay(waitTime);
    return waitTime;
  }

  /**
   * Generates a match when search is complete
   * Creates realistic match data based on game mode
   * @param region - Region where match occurs
   * @param gameMode - Game mode for the match
   * @returns Generated MatchInfo object
   */
  static generateMatch(region: Region, gameMode: GameMode): MatchInfo {
    const playerCount = PLAYER_COUNT_BY_MODE[gameMode];
    const teamCount = gameMode === GameMode.SOLO ? playerCount : Math.ceil(playerCount / 2);
    const matchDetails = this.generateMatchDetails(gameMode, teamCount);

    return {
      matchId: generateMatchId(),
      region,
      gameMode,
      playerCount,
      estimatedStartTime: new Date(Date.now() + 10000), // 10 seconds from now
      matchDetails
    };
  }

  /**
   * Generates match details including map and teams
   * @param gameMode - Game mode to generate details for
   * @param teamCount - Number of teams in the match
   * @returns MatchDetails object
   */
  private static generateMatchDetails(gameMode: GameMode, teamCount: number): MatchDetails {
    const mapName = getRandomElement(MAP_NAMES);
    const playerTeams: PlayerTeam[] = [];

    for (let i = 0; i < teamCount; i++) {
      playerTeams.push({
        teamId: generateTeamId(),
        teamName: `Team ${i + 1}`,
        memberCount: gameMode === GameMode.SOLO ? 1 : getRandomInt(1, 4)
      });
    }

    return {
      mapName,
      gameModeInfo: this.getGameModeInfo(gameMode),
      playerTeams
    };
  }

  /**
   * Gets descriptive text for game mode
   * @param gameMode - Game mode to describe
   * @returns Description string
   */
  private static getGameModeInfo(gameMode: GameMode): string {
    const modeDescriptions: Record<GameMode, string> = {
      [GameMode.SOLO]: 'Free-for-all combat - Every player for themselves',
      [GameMode.DUO]: 'Team up with one partner for synchronized gameplay',
      [GameMode.SQUAD]: 'Lead your squad of four to victory',
      [GameMode.CUSTOM]: 'Custom match with special rules'
    };
    return modeDescriptions[gameMode];
  }

  /**
   * Simulates the delay before match starts
   * Typically called after countdown finishes
   * @returns Promise that resolves after match start delay
   */
  static async simulateMatchStart(): Promise<void> {
    await delay(MATCH_SIMULATION_DELAY_MS);
  }
}
