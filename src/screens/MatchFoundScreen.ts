/**
 * MatchFoundScreen - Screen displayed when match is found
 * Shows detailed match information before countdown begins
 * Transitions to countdown after brief display
 */

import {
  Button,
  MatchInfoDisplay
} from '../components/index';
import { MatchmakerService } from '../services/index';
import type { MatchInfo } from '../types/index';

/**
 * MatchFoundScreen class - UI screen for match found state
 * Displays match details and continues to countdown
 */
export class MatchFoundScreen {
  private element: HTMLDivElement;
  private matchInfoDisplay: MatchInfoDisplay;
  private continueButton: Button;
  private onContinueHandler: (() => void) | null = null;

  /**
   * Constructor creates the match found screen
   * @param matchmakerService - MatchmakerService instance
   */
  constructor(matchmakerService: MatchmakerService) {

    this.element = document.createElement('div');
    this.element.className = 'screen match-found-screen';
    this.element.id = 'match-found-screen';

    // Create title
    const title = document.createElement('h1');
    title.textContent = 'Match Found!';
    title.className = 'screen-title match-found-title';
    this.element.appendChild(title);

    // Match info display
    this.matchInfoDisplay = new MatchInfoDisplay();
    this.element.appendChild(this.matchInfoDisplay.getElement());

    // Create buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Continue button
    this.continueButton = new Button('ACCEPT & CONTINUE', 'btn-primary', 'continue-btn')
      .onClick(() => {
        if (this.onContinueHandler) {
          this.onContinueHandler();
        }
      });
    buttonContainer.appendChild(this.continueButton.getElement());

    this.element.appendChild(buttonContainer);
  }

  /**
   * Displays match information on the screen
   * @param match - MatchInfo to display
   */
  displayMatch(match: MatchInfo): void {
    this.matchInfoDisplay.displayMatch(match);
  }

  /**
   * Sets the handler for continue button click
   * @param handler - Function to call when continue is clicked
   * @returns This screen for chaining
   */
  onContinue(handler: () => void): MatchFoundScreen {
    this.onContinueHandler = handler;
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
   * Enables the continue button
   */
  enable(): void {
    this.continueButton.enable();
  }

  /**
   * Disables the continue button
   */
  disable(): void {
    this.continueButton.disable();
  }

  /**
   * Cleans up resources
   */
  cleanup(): void {
    this.continueButton.cleanup();
  }
}
