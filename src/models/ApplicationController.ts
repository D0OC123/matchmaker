/**
 * ApplicationController - Main application orchestrator
 * Controls the flow between screens and manages application state
 * Coordinates user interactions with business logic
 */

import { EventEmitter, MatchmakerService } from '../services/index';
import { ScreenManager } from './ScreenManager';
import {
  MatchmakerScreen,
  QueueScreen,
  MatchFoundScreen,
  CountdownScreen
} from '../screens/index';
import { QueueState, EventType } from '../types/index';
import { COUNTDOWN_CONFIG } from '../config/defaults';

/**
 * ApplicationController class - Main application flow orchestrator
 * Manages state transitions and coordinates all components
 */
export class ApplicationController {
  private eventEmitter: EventEmitter;
  private matchmakerService: MatchmakerService;
  private screenManager: ScreenManager;
  private matchmakerScreen: MatchmakerScreen;
  private queueScreen: QueueScreen;
  private matchFoundScreen: MatchFoundScreen;
  private countdownScreen: CountdownScreen;

  /**
   * Constructor initializes the application controller
   * @param container - HTML container for the application
   */
  constructor(container: HTMLDivElement) {
    // Initialize services
    this.eventEmitter = new EventEmitter();
    this.matchmakerService = new MatchmakerService(this.eventEmitter);

    // Initialize screens
    this.matchmakerScreen = new MatchmakerScreen(this.matchmakerService);
    this.queueScreen = new QueueScreen(this.matchmakerService);
    this.matchFoundScreen = new MatchFoundScreen(this.matchmakerService);
    this.countdownScreen = new CountdownScreen(this.matchmakerService);

    // Initialize screen manager
    this.screenManager = new ScreenManager(container, {
      matchmakerScreen: this.matchmakerScreen,
      queueScreen: this.queueScreen,
      matchFoundScreen: this.matchFoundScreen,
      countdownScreen: this.countdownScreen
    });

    // Set up event handlers
    this.setupEventHandlers();
  }

  /**
   * Sets up event handlers for screens and services
   */
  private setupEventHandlers(): void {
    // Matchmaker screen - Play button
    this.matchmakerScreen.onPlay(() => {
      this.handlePlayClick();
    });

    // Queue screen - Cancel button
    this.queueScreen.onCancel(() => {
      this.handleCancelClick();
    });

    // Match found screen - Continue button
    this.matchFoundScreen.onContinue(() => {
      this.handleContinueClick();
    });

    // Countdown screen - Finish handler
    this.countdownScreen.onCountdownFinish(() => {
      this.handleCountdownFinish();
    });

    // Service events
    this.matchmakerService.on(EventType.MATCH_FOUND, (event) => {
      this.handleMatchFound(event);
    });

    this.matchmakerService.on(EventType.QUEUE_CANCELLED, () => {
      this.handleQueueCancelled();
    });

    this.matchmakerService.on(EventType.COUNTDOWN_FINISHED, () => {
      this.handleCountdownFinished();
    });
  }

  /**
   * Handles play button click
   * Starts the matchmaking queue
   */
  private async handlePlayClick(): Promise<void> {
    this.matchmakerScreen.disable();
    this.screenManager.showQueueScreen();

    try {
      await this.matchmakerService.startQueue();
    } catch (error) {
      console.error('Error starting queue:', error);
      this.screenManager.showMatchmakerScreen();
    }
  }

  /**
   * Handles cancel button click
   * Cancels the current queue search
   */
  private handleCancelClick(): void {
    this.matchmakerService.cancelQueue();
  }

  /**
   * Handles match found event
   * Displays match information and transitions to match found screen
   * @param event - Match found event
   */
  private handleMatchFound(event: { type: string; timestamp: Date; payload: Record<string, unknown> }): void {
    const match = event.payload.match;
    if (match) {
      this.screenManager.showMatchFoundScreen();
      this.matchFoundScreen.displayMatch(match as never);
    }
  }

  /**
   * Handles continue button click from match found screen
   * Starts the countdown before match entry
   */
  private async handleContinueClick(): Promise<void> {
    this.matchFoundScreen.disable();
    this.screenManager.showCountdownScreen();
    this.countdownScreen.displayMatchInfo();

    try {
      await this.matchmakerService.startCountdown(COUNTDOWN_CONFIG.TOTAL_SECONDS);
      this.countdownScreen.start();
    } catch (error) {
      console.error('Error starting countdown:', error);
      this.screenManager.showMatchmakerScreen();
    }
  }

  /**
   * Handles countdown finish
   * Match is about to start
   */
  private handleCountdownFinish(): void {
    // In a real application, this would launch the game
    console.log('Match starting - would launch game here');
    
    // Reset to matchmaker screen after brief delay
    setTimeout(() => {
      this.screenManager.showMatchmakerScreen();
    }, 2000);
  }

  /**
   * Handles queue cancelled event
   * Returns to matchmaker screen
   */
  private handleQueueCancelled(): void {
    this.screenManager.showMatchmakerScreen();
  }

  /**
   * Handles countdown finished event
   */
  private handleCountdownFinished(): void {
    // Handled by handleCountdownFinish
  }

  /**
   * Starts the application
   */
  start(): void {
    console.log('OGFN Matchmaker application started');
    this.screenManager.showMatchmakerScreen();
  }

  /**
   * Stops the application and cleans up resources
   */
  stop(): void {
    this.matchmakerService.cleanup();
    this.screenManager.cleanup();
    console.log('OGFN Matchmaker application stopped');
  }

  /**
   * Gets the matchmaker service
   * @returns MatchmakerService instance
   */
  getMatchmakerService(): MatchmakerService {
    return this.matchmakerService;
  }

  /**
   * Gets the screen manager
   * @returns ScreenManager instance
   */
  getScreenManager(): ScreenManager {
    return this.screenManager;
  }
}
