/**
 * Models - Data models and interfaces for the Matchmaker system
 * Defines the structure of key data entities
 */

import { Region, GameMode, QueueState, EventType } from './enums';

/**
 * User settings stored in memory
 */
export interface UserSettings {
  selectedRegion: Region;
  selectedGameMode: GameMode;
  playerNickname: string;
}

/**
 * Matchmaker configuration state
 */
export interface MatchmakerState {
  settings: UserSettings;
  queueState: QueueState;
  waitingTime: number;
  matchInfo: MatchInfo | null;
  countdownTime: number;
}

/**
 * Match information when a match is found
 */
export interface MatchInfo {
  matchId: string;
  region: Region;
  gameMode: GameMode;
  playerCount: number;
  estimatedStartTime: Date;
  matchDetails: MatchDetails;
}

/**
 * Detailed information about the match
 */
export interface MatchDetails {
  mapName: string;
  gameModeInfo: string;
  playerTeams: PlayerTeam[];
}

/**
 * Information about player teams in the match
 */
export interface PlayerTeam {
  teamId: string;
  teamName: string;
  memberCount: number;
}

/**
 * System event for state changes
 */
export interface SystemEvent {
  type: EventType;
  timestamp: Date;
  payload: Record<string, unknown>;
}

/**
 * Queue entry with timing information
 */
export interface QueueEntry {
  entryTime: Date;
  region: Region;
  gameMode: GameMode;
  searchStartTime: Date;
}
