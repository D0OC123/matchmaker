/**
 * Defaults Configuration - Default values and constants for the Matchmaker system
 * Centralizes all configurable values and magic numbers
 */

import { Region, GameMode } from '../types/enums';
import { UserSettings } from '../types/models';

/**
 * Default user settings when the application starts
 */
export const DEFAULT_USER_SETTINGS: UserSettings = {
  selectedRegion: Region.EU,
  selectedGameMode: GameMode.SQUAD,
  playerNickname: 'Player'
};

/**
 * Waiting time simulation settings (in milliseconds)
 */
export const WAIT_TIME_CONFIG = {
  MIN_WAIT_MS: 3000,
  MAX_WAIT_MS: 15000,
  POLL_INTERVAL_MS: 100
};

/**
 * Countdown settings before match start (in seconds)
 */
export const COUNTDOWN_CONFIG = {
  TOTAL_SECONDS: 10,
  UPDATE_INTERVAL_MS: 1000
};

/**
 * Simulated match start delay (in milliseconds)
 */
export const MATCH_SIMULATION_DELAY_MS = 2000;

/**
 * Local storage keys for persistence
 */
export const STORAGE_KEYS = {
  USER_SETTINGS: 'ogfn_matchmaker_settings',
  LAST_REGION: 'ogfn_last_region',
  LAST_GAME_MODE: 'ogfn_last_game_mode'
};

/**
 * Simulated player count ranges by game mode
 */
export const PLAYER_COUNT_BY_MODE = {
  SOLO: 1,
  DUO: 2,
  SQUAD: 4,
  CUSTOM: 8
};

/**
 * Simulated map names for variety
 */
export const MAP_NAMES = [
  'Verdant Valley',
  'Steel City',
  'Crystal Canyon',
  'Frozen Peaks',
  'Desert Oasis',
  'Neon District'
];
