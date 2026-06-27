/**
 * LoadingScreen - Loading/Transition screen before entering game
 * Shows loading animation while connecting to game server
 */

import { LoadingAnimation } from '../components/index';

/**
 * LoadingScreen class - Shows loading state during game entry
 * Displays animated spinner and status messages
 */
export class LoadingScreen {
  private element: HTMLDivElement;
  private loadingAnimation: LoadingAnimation;
  private statusElement: HTMLParagraphElement;

  /**
   * Constructor creates the loading screen
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'screen loading-screen';
    this.element.id = 'loading-screen';

    // Create title
    const title = document.createElement('h1');
    title.textContent = 'Entering Game';
    title.className = 'screen-title';
    this.element.appendChild(title);

    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'loading-content';

    // Loading animation
    this.loadingAnimation = new LoadingAnimation();
    this.loadingAnimation.setText('Connecting to game server...');
    contentContainer.appendChild(this.loadingAnimation.getElement());

    // Status message
    this.statusElement = document.createElement('p');
    this.statusElement.className = 'loading-status';
    this.statusElement.textContent = 'Please wait...';
    contentContainer.appendChild(this.statusElement);

    this.element.appendChild(contentContainer);
  }

  /**
   * Gets the underlying HTML element
   * @returns HTMLDivElement
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Shows the loading screen
   */
  show(): void {
    this.element.style.display = 'flex';
    this.loadingAnimation.start();
  }

  /**
   * Hides the loading screen
   */
  hide(): void {
    this.element.style.display = 'none';
    this.loadingAnimation.stop();
  }

  /**
   * Updates the status message
   * @param message - New status message
   */
  setStatus(message: string): void {
    this.statusElement.textContent = message;
  }

  /**
   * Cleans up resources
   */
  cleanup(): void {
    this.loadingAnimation.cleanup();
  }
}
