/**
 * CountdownScreen - Countdown timer screen before match entry
 * Shows large countdown display before player enters the match
 * Displays match details in background
 */

import {
  CountdownDisplay,
  MatchInfoDisplay
} from '../components/index';
import { MatchmakerService } from '../services/index';
import { EventType } from '../types/index';
import type { SystemEvent } from '../types/index';

/**
 * CountdownScreen class - UI screen for countdown state
 * Displays countdown timer and match info
 */
export class CountdownScreen {
  private element: HTMLDivElement;
  private matchmakerService: MatchmakerService;
  private countdownDisplay: CountdownDisplay;
  private matchInfoDisplay: MatchInfoDisplay;
  private onCountdownFinishHandler: (() => void) | null = null;

  /**
   * Constructor creates the countdown screen
   * @param matchmakerService - MatchmakerService instance
   */
  constructor(matchmakerService: MatchmakerService) {
    this.matchmakerService = matchmakerService;

    this.element = document.createElement('div');
    this.element.className = 'screen countdown-screen';
    this.element.id = 'countdown-screen';

    // Create countdown display
    this.countdownDisplay = new CountdownDisplay();
    this.element.appendChild(this.countdownDisplay.getElement());

    // Create match info display (in background)
    this.matchInfoDisplay = new MatchInfoDisplay();
    this.matchInfoDisplay.getElement().className = 'match-info-background';
    this.element.appendChild(this.matchInfoDisplay.getElement());

    // Subscribe to countdown events
    this.subscribeToEvents();
  }

  /**
   * Subscribes to relevant events
   */
  private subscribeToEvents(): void {
    this.matchmakerService.on(EventType.COUNTDOWN_FINISHED, (event: SystemEvent) => {
      if (this.onCountdownFinishHandler) {
        this.onCountdownFinishHandler();
      }
    });
  }

  /**
   * Starts the countdown display
   * Updates time based on matchmaker service state
   */
  start(): void {
    const updateCountdown = (): void => {
      const state = this.matchmakerService.getState();
      this.countdownDisplay.updateTime(state.countdownTime);

      if (state.countdownTime > 0) {
        this.countdownDisplay.pulse();
        setTimeout(updateCountdown, 100);
      }
    };

    updateCountdown();
  }

  /**
   * Displays match information
   */
  displayMatchInfo(): void {
    const state = this.matchmakerService.getState();
    if (state.matchInfo) {
      this.matchInfoDisplay.displayMatch(state.matchInfo);
    }
  }

  /**
   * Sets the handler for countdown finish
   * @param handler - Function to call when countdown finishes
   * @returns This screen for chaining
   */
  onCountdownFinish(handler: () => void): CountdownScreen {
    this.onCountdownFinishHandler = handler;
    return this;
  }

  /**
   * Gets the underlying HTML element
   * @returns HTMLDivElement
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Shows the screen
   */
  show(): void {
    this.element.style.display = 'flex';
  }

  /**
   * Hides the screen
   */
  hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Cleans up resources
   */
  cleanup(): void {
    // Event listeners are managed by matchmakerService
  }
}
