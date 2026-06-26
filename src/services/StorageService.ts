/**
 * StorageService - Manages persistence of user settings
 * Provides a clean interface for saving and loading application state
 * Uses browser's localStorage for client-side persistence
 */

import type { UserSettings } from '../types/index';
import { Region, GameMode } from '../types/index';
import { saveToStorage, getFromStorage, removeFromStorage } from '../utils/index';
import { STORAGE_KEYS, DEFAULT_USER_SETTINGS } from '../config/defaults';

/**
 * StorageService class - Handles all storage operations
 * Wraps localStorage utilities with application-specific logic
 */
export class StorageService {
  /**
   * Saves user settings to local storage
   * @param settings - UserSettings object to persist
   */
  static saveUserSettings(settings: UserSettings): void {
    saveToStorage(STORAGE_KEYS.USER_SETTINGS, settings);
    saveToStorage(STORAGE_KEYS.LAST_REGION, settings.selectedRegion);
    saveToStorage(STORAGE_KEYS.LAST_GAME_MODE, settings.selectedGameMode);
  }

  /**
   * Loads user settings from local storage
   * Returns default settings if nothing is stored
   * @returns UserSettings loaded from storage or defaults
   */
  static loadUserSettings(): UserSettings {
    const stored = getFromStorage<UserSettings>(STORAGE_KEYS.USER_SETTINGS);
    if (stored) {
      return stored;
    }
    return { ...DEFAULT_USER_SETTINGS };
  }

  /**
   * Gets the last selected region from storage
   * @returns Saved region or default
   */
  static getLastRegion(): Region {
    const stored = getFromStorage<Region>(STORAGE_KEYS.LAST_REGION);
    return stored || DEFAULT_USER_SETTINGS.selectedRegion;
  }

  /**
   * Gets the last selected game mode from storage
   * @returns Saved game mode or default
   */
  static getLastGameMode(): GameMode {
    const stored = getFromStorage<GameMode>(STORAGE_KEYS.LAST_GAME_MODE);
    return stored || DEFAULT_USER_SETTINGS.selectedGameMode;
  }

  /**
   * Clears all saved user settings
   */
  static clearAllSettings(): void {
    removeFromStorage(STORAGE_KEYS.USER_SETTINGS);
    removeFromStorage(STORAGE_KEYS.LAST_REGION);
    removeFromStorage(STORAGE_KEYS.LAST_GAME_MODE);
  }
}
