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
import { COUNTDOWN_CONFIG, BACKEND_CONFIG } from '../config/defaults';

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
  }

  /**
   * Handles play button click
   * Redirects directly to game server
   */
  private handlePlayClick(): void {
    const state = this.matchmakerService.getState();
    
    // Redirect directly to game server with parameters
    const gameServerUrl = `${BACKEND_CONFIG.BASE_URL}/game?` +
      `mode=${state.settings.selectedGameMode}&` +
      `region=${state.settings.selectedRegion}&` +
      `player=${state.settings.playerNickname}`;
    
    // Redirect to game
    window.location.href = gameServerUrl;
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
