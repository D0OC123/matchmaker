/**
 * ScreenManager - Manages screen transitions and visibility
 * Orchestrates navigation between different application screens
 * Ensures only one screen is visible at a time
 */

import {
  MatchmakerScreen,
  QueueScreen,
  MatchFoundScreen,
  CountdownScreen,
  LoadingScreen
} from '../screens/index';

/**
 * ScreenManager class - Handles screen lifecycle and transitions
 * Manages visibility of all screens and coordinates transitions
 */
export class ScreenManager {
  private matchmakerScreen: MatchmakerScreen;
  private queueScreen: QueueScreen;
  private matchFoundScreen: MatchFoundScreen;
  private countdownScreen: CountdownScreen;
  private container: HTMLDivElement;
  private currentScreen: MatchmakerScreen | QueueScreen | MatchFoundScreen | CountdownScreen | null = null;

  /**
   * Constructor initializes the screen manager
   * @param container - HTML container to hold screens
   * @param screens - Object containing all screen instances
   */
  constructor(
    container: HTMLDivElement,
    screens: {
      matchmakerScreen: MatchmakerScreen;
      queueScreen: QueueScreen;
      matchFoundScreen: MatchFoundScreen;
      countdownScreen: CountdownScreen;
    }
  ) {
    this.container = container;
    this.matchmakerScreen = screens.matchmakerScreen;
    this.queueScreen = screens.queueScreen;
    this.matchFoundScreen = screens.matchFoundScreen;
    this.countdownScreen = screens.countdownScreen;

    // Add all screens to container
    this.container.appendChild(this.matchmakerScreen.getElement());
    this.container.appendChild(this.queueScreen.getElement());
    this.container.appendChild(this.matchFoundScreen.getElement());
    this.container.appendChild(this.countdownScreen.getElement());

    // Start with matchmaker screen
    this.showMatchmakerScreen();
  }

  /**
   * Shows the matchmaker screen
   */
  showMatchmakerScreen(): void {
    this.hideAllScreens();
    this.matchmakerScreen.show();
    this.matchmakerScreen.enable();
    this.currentScreen = this.matchmakerScreen;
  }

  /**
   * Shows the queue screen
   */
  showQueueScreen(): void {
    this.hideAllScreens();
    this.queueScreen.show();
    this.currentScreen = this.queueScreen;
  }

  /**
   * Shows the match found screen
   */
  showMatchFoundScreen(): void {
    this.hideAllScreens();
    this.matchFoundScreen.show();
    this.matchFoundScreen.enable();
    this.currentScreen = this.matchFoundScreen;
  }

  /**
   * Shows the countdown screen
   */
  showCountdownScreen(): void {
    this.hideAllScreens();
    this.countdownScreen.show();
    this.currentScreen = this.countdownScreen;
  }

  /**
   * Hides all screens
   */
  private hideAllScreens(): void {
    this.matchmakerScreen.hide();
    this.queueScreen.hide();
    this.matchFoundScreen.hide();
    this.countdownScreen.hide();
  }

  /**
   * Gets the current active screen
   * @returns Current screen or null
   */
  getCurrentScreen(): MatchmakerScreen | QueueScreen | MatchFoundScreen | CountdownScreen | null {
    return this.currentScreen;
  }

  /**
   * Cleans up all screens
   */
  cleanup(): void {
    this.matchmakerScreen.cleanup();
    this.queueScreen.cleanup();
    this.matchFoundScreen.cleanup();
    this.countdownScreen.cleanup();
  }
}
