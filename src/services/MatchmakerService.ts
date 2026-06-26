/**
 * MatchmakerService - Core matchmaking logic and state management
 * Orchestrates the entire matchmaking process from queue to countdown to match start
 * Manages state transitions and coordinates with other services
 */

import { EventEmitter } from './EventEmitter';
import { MatchSimulationService } from './MatchSimulationService';
import { StorageService } from './StorageService';
import { Region, GameMode, QueueState, EventType } from '../types/index';
import type { MatchmakerState, UserSettings, SystemEvent } from '../types/index';
import { DEFAULT_USER_SETTINGS } from '../config/defaults';
import { getCurrentTimestamp } from '../utils/index';

/**
 * MatchmakerService class - Main orchestrator for matchmaking system
 * Maintains application state and manages all state transitions
 * Implements state machine pattern with queue, match found, and countdown states
 */
export class MatchmakerService {
  private state: MatchmakerState;
  private eventEmitter: EventEmitter;
  private countdownInterval: ReturnType<typeof setTimeout> | null = null;

  /**
   * Constructor initializes the matchmaker service
   * Loads persisted settings and sets up initial state
   * @param eventEmitter - EventEmitter instance for event distribution
   */
  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;

    const loadedSettings = StorageService.loadUserSettings();
    this.state = {
      settings: loadedSettings,
      queueState: QueueState.IDLE,
      waitingTime: 0,
      matchInfo: null,
      countdownTime: 0
    };
  }

  /**
   * Gets current application state
   * @returns Current MatchmakerState
   */
  getState(): MatchmakerState {
    return this.state;
  }

  /**
   * Updates user settings and persists them
   * @param settings - New user settings
   */
  updateSettings(settings: UserSettings): void {
    this.state.settings = settings;
    StorageService.saveUserSettings(settings);
    this.emitEvent(EventType.SETTINGS_CHANGED, { settings });
  }

  /**
   * Starts the matchmaking queue
   * Begins searching for a match with simulated wait time
   * @returns Promise that resolves when match is found
   */
  async startQueue(): Promise<void> {
    this.state.queueState = QueueState.SEARCHING;
    this.emitEvent(EventType.QUEUE_STARTED, {
      region: this.state.settings.selectedRegion,
      gameMode: this.state.settings.selectedGameMode
    });

    try {
      // Simulate searching for match
      const waitTime = await MatchSimulationService.simulateMatchSearch();
      this.state.waitingTime = waitTime;

      // Generate match when search completes
      const match = MatchSimulationService.generateMatch(
        this.state.settings.selectedRegion,
        this.state.settings.selectedGameMode
      );

      // Transition to match found state
      this.state.matchInfo = match;
      this.state.queueState = QueueState.MATCH_FOUND;
      this.emitEvent(EventType.MATCH_FOUND, { match });
    } catch (error) {
      console.error('Error during match search:', error);
      this.state.queueState = QueueState.IDLE;
    }
  }

  /**
   * Cancels the current queue search
   */
  cancelQueue(): void {
    this.state.queueState = QueueState.CANCELLED;
    this.state.waitingTime = 0;
    this.state.matchInfo = null;
    this.emitEvent(EventType.QUEUE_CANCELLED, {});
    // Reset to idle after a brief moment
    setTimeout(() => {
      this.state.queueState = QueueState.IDLE;
    }, 100);
  }

  /**
   * Starts the countdown before match entry
   * Counts down from configured duration
   * @param durationSeconds - Total countdown duration in seconds
   */
  async startCountdown(durationSeconds: number): Promise<void> {
    this.state.queueState = QueueState.COUNTDOWN;
    this.state.countdownTime = durationSeconds;
    this.emitEvent(EventType.COUNTDOWN_STARTED, { duration: durationSeconds });

    await this.performCountdown(durationSeconds);
  }

  /**
   * Performs the countdown logic
   * Emits countdown state updates every second
   * @param durationSeconds - Total countdown duration in seconds
   * @returns Promise that resolves when countdown finishes
   */
  private performCountdown(durationSeconds: number): Promise<void> {
    return new Promise(resolve => {
      let remaining = durationSeconds;

      const updateCountdown = async (): Promise<void> => {
        if (remaining > 0) {
          this.state.countdownTime = remaining;
          remaining--;

          // Schedule next update
          this.countdownInterval = setTimeout(() => {
            updateCountdown().catch(error => {
              console.error('Error in countdown:', error);
            });
          }, 1000);
        } else {
          // Countdown finished
          this.state.countdownTime = 0;
          this.emitEvent(EventType.COUNTDOWN_FINISHED, {});
          resolve();
        }
      };

      updateCountdown().catch(error => {
        console.error('Error starting countdown:', error);
        resolve();
      });
    });
  }

  /**
   * Changes the selected region
   * @param region - New region selection
   */
  selectRegion(region: Region): void {
    this.state.settings.selectedRegion = region;
    StorageService.saveUserSettings(this.state.settings);
  }

  /**
   * Changes the selected game mode
   * @param gameMode - New game mode selection
   */
  selectGameMode(gameMode: GameMode): void {
    this.state.settings.selectedGameMode = gameMode;
    StorageService.saveUserSettings(this.state.settings);
  }

  /**
   * Updates player nickname
   * @param nickname - New player nickname
   */
  setPlayerNickname(nickname: string): void {
    this.state.settings.playerNickname = nickname;
    StorageService.saveUserSettings(this.state.settings);
  }

  /**
   * Cleans up resources
   * Clears any running intervals and listeners
   */
  cleanup(): void {
    if (this.countdownInterval) {
      clearTimeout(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.eventEmitter.removeAllListeners();
  }

  /**
   * Emits a system event
   * Helper method to create and emit events
   * @param type - Event type
   * @param payload - Event payload data
   */
  private emitEvent(type: EventType, payload: Record<string, unknown>): void {
    const event: SystemEvent = {
      type,
      timestamp: getCurrentTimestamp(),
      payload
    };
    this.eventEmitter.emit(event);
  }

  /**
   * Registers an event listener
   * Delegates to event emitter
   * @param eventType - Event type to listen for
   * @param listener - Callback function
   */
  on(eventType: EventType, listener: (event: SystemEvent) => void): void {
    this.eventEmitter.on(eventType, listener);
  }

  /**
   * Unregisters an event listener
   * Delegates to event emitter
   * @param eventType - Event type
   * @param listener - Callback function to remove
   */
  off(eventType: EventType, listener: (event: SystemEvent) => void): void {
    this.eventEmitter.off(eventType, listener);
  }
}
