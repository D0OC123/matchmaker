/**
 * CountdownDisplay Component - Shows countdown timer before match
 * Displays remaining seconds in large, clear format
 * Used during the pre-match countdown phase
 */

/**
 * CountdownDisplay class - Creates countdown timer UI
 * Shows remaining time in seconds with visual emphasis
 */
export class CountdownDisplay {
  private element: HTMLDivElement;
  private timerElement: HTMLDivElement;
  private messageElement: HTMLParagraphElement;

  /**
   * Constructor creates the countdown display UI
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'countdown-container';

    const titleElement = document.createElement('h2');
    titleElement.textContent = 'Match Starting In';
    this.element.appendChild(titleElement);

    this.timerElement = document.createElement('div');
    this.timerElement.className = 'countdown-timer';
    this.timerElement.textContent = '0';
    this.element.appendChild(this.timerElement);

    this.messageElement = document.createElement('p');
    this.messageElement.className = 'countdown-message';
    this.messageElement.textContent = 'Get ready!';
    this.element.appendChild(this.messageElement);
  }

  /**
   * Gets the underlying HTML element
   * @returns HTMLDivElement
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Updates the displayed countdown time
   * @param seconds - Seconds remaining
   */
  updateTime(seconds: number): void {
    this.timerElement.textContent = seconds.toString();

    // Update styling based on remaining time
    if (seconds <= 3) {
      this.timerElement.className = 'countdown-timer timer-critical';
    } else if (seconds <= 5) {
      this.timerElement.className = 'countdown-timer timer-warning';
    } else {
      this.timerElement.className = 'countdown-timer';
    }
  }

  /**
   * Updates the message text
   * @param message - New message to display
   */
  setMessage(message: string): void {
    this.messageElement.textContent = message;
  }

  /**
   * Shows the countdown display
   */
  show(): void {
    this.element.style.display = 'flex';
  }

  /**
   * Hides the countdown display
   */
  hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Adds pulse animation effect
   */
  pulse(): void {
    this.timerElement.classList.add('pulse-animation');
    setTimeout(() => {
      this.timerElement.classList.remove('pulse-animation');
    }, 300);
  }
}
