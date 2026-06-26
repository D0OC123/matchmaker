/**
 * QueueScreen - Queue display screen during matchmaking search
 * Shows loading animation, wait time, and cancel button
 * Displays feedback while searching for a match
 */

import {
  Button,
  LoadingAnimation,
  WaitingTimeDisplay
} from '../components/index';
import { MatchmakerService } from '../services/index';

/**
 * QueueScreen class - UI screen for queue state
 * Manages loading animation, wait time display, and cancel functionality
 */
export class QueueScreen {
  private element: HTMLDivElement;
  private matchmakerService: MatchmakerService;
  private loadingAnimation: LoadingAnimation;
  private waitingTimeDisplay: WaitingTimeDisplay;
  private cancelButton: Button;
  private onCancelHandler: (() => void) | null = null;

  /**
   * Constructor creates the queue screen
   * @param matchmakerService - MatchmakerService instance
   */
  constructor(matchmakerService: MatchmakerService) {
    this.matchmakerService = matchmakerService;

    this.element = document.createElement('div');
    this.element.className = 'screen queue-screen';
    this.element.id = 'queue-screen';

    // Create title
    const title = document.createElement('h1');
    title.textContent = 'Searching for Match';
    title.className = 'screen-title';
    this.element.appendChild(title);

    // Create subtitle with selected mode and region
    const state = this.matchmakerService.getState();
    const subtitle = document.createElement('p');
    subtitle.textContent = `Mode: ${state.settings.selectedGameMode} | Region: ${state.settings.selectedRegion}`;
    subtitle.className = 'screen-subtitle';
    this.element.appendChild(subtitle);

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'queue-content';

    // Loading animation
    this.loadingAnimation = new LoadingAnimation();
    contentContainer.appendChild(this.loadingAnimation.getElement());

    // Waiting time display
    this.waitingTimeDisplay = new WaitingTimeDisplay();
    contentContainer.appendChild(this.waitingTimeDisplay.getElement());

    this.element.appendChild(contentContainer);

    // Create buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Cancel button
    this.cancelButton = new Button('CANCEL', 'btn-secondary', 'cancel-btn')
      .onClick(() => {
        if (this.onCancelHandler) {
          this.onCancelHandler();
        }
      });
    buttonContainer.appendChild(this.cancelButton.getElement());

    this.element.appendChild(buttonContainer);
  }

  /**
   * Sets the handler for cancel button click
   * @param handler - Function to call when cancel is clicked
   * @returns This screen for chaining
   */
  onCancel(handler: () => void): QueueScreen {
    this.onCancelHandler = handler;
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
    this.startAnimations();
  }

  /**
   * Hides the screen
   */
  hide(): void {
    this.element.style.display = 'none';
    this.stopAnimations();
  }

  /**
   * Starts animations and timers
   */
  private startAnimations(): void {
    this.loadingAnimation.start();
    this.waitingTimeDisplay.start();
  }

  /**
   * Stops animations and timers
   */
  private stopAnimations(): void {
    this.loadingAnimation.stop();
    this.waitingTimeDisplay.stop();
  }

  /**
   * Cleans up resources
   */
  cleanup(): void {
    this.stopAnimations();
    this.loadingAnimation.cleanup();
    this.waitingTimeDisplay.cleanup();
    this.cancelButton.cleanup();
  }
}
