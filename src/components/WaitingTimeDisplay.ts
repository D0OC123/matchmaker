/**
 * WaitingTimeDisplay Component - Shows elapsed wait time
 * Displays how long the player has been waiting in queue
 * Updates in real-time as search progresses
 */

import { formatTime } from '../utils/index';

/**
 * WaitingTimeDisplay class - Creates waiting time display UI
 * Shows formatted elapsed time in MM:SS format
 */
export class WaitingTimeDisplay {
  private element: HTMLDivElement;
  private timeElement: HTMLSpanElement;
  private updateInterval: NodeJS.Timeout | null = null;
  private startTime: number = 0;

  /**
   * Constructor creates the waiting time display
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'waiting-time-container';

    const labelElement = document.createElement('span');
    labelElement.className = 'waiting-label';
    labelElement.textContent = 'Waiting Time: ';

    this.timeElement = document.createElement('span');
    this.timeElement.className = 'waiting-time';
    this.timeElement.textContent = '00:00';

    this.element.appendChild(labelElement);
    this.element.appendChild(this.timeElement);
  }

  /**
   * Gets the underlying HTML element
   * @returns HTMLDivElement
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Starts tracking wait time
   */
  start(): void {
    this.startTime = Date.now();
    this.updateInterval = setInterval(() => {
      this.updateDisplay();
    }, 100);
  }

  /**
   * Updates the time display
   */
  private updateDisplay(): void {
    const elapsed = Date.now() - this.startTime;
    this.timeElement.textContent = formatTime(elapsed);
  }

  /**
   * Stops tracking wait time
   */
  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Gets the total elapsed time in milliseconds
   * @returns Elapsed time in milliseconds
   */
  getElapsedTime(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Resets the wait time tracking
   */
  reset(): void {
    this.stop();
    this.startTime = 0;
    this.timeElement.textContent = '00:00';
  }

  /**
   * Shows the waiting time display
   */
  show(): void {
    this.element.style.display = 'flex';
  }

  /**
   * Hides the waiting time display
   */
  hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Cleans up resources
   */
  cleanup(): void {
    this.stop();
  }
}
