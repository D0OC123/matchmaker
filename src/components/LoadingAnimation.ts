/**
 * LoadingAnimation Component - Visual feedback during matchmaking
 * Displays animated spinner or pulse effect while searching for match
 * Updates with elapsed wait time
 */

/**
 * LoadingAnimation class - Creates and manages loading animation UI
 * Provides visual feedback during async operations
 */
export class LoadingAnimation {
  private element: HTMLDivElement;
  private spinnerElement: HTMLDivElement;
  private textElement: HTMLParagraphElement;
  private animationFrame: number | null = null;

  /**
   * Constructor creates the loading animation UI
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'loading-container';

    this.spinnerElement = document.createElement('div');
    this.spinnerElement.className = 'loading-spinner';

    this.textElement = document.createElement('p');
    this.textElement.className = 'loading-text';
    this.textElement.textContent = 'Searching for match...';

    // Create spinner animation elements
    const dots: HTMLDivElement[] = [];
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'spinner-dot';
      dots.push(dot);
      this.spinnerElement.appendChild(dot);
    }

    this.element.appendChild(this.spinnerElement);
    this.element.appendChild(this.textElement);
  }

  /**
   * Gets the underlying HTML element
   * @returns HTMLDivElement
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Updates the loading text message
   * @param text - New text to display
   */
  setText(text: string): void {
    this.textElement.textContent = text;
  }

  /**
   * Shows the loading animation
   */
  show(): void {
    this.element.style.display = 'flex';
  }

  /**
   * Hides the loading animation
   */
  hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Starts the spinner animation
   * Uses CSS animation and requestAnimationFrame for smooth rotation
   */
  start(): void {
    const animate = (): void => {
      const rotation = (Date.now() / 20) % 360;
      this.spinnerElement.style.transform = `rotate(${rotation}deg)`;
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  /**
   * Stops the spinner animation
   */
  stop(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Updates progress text with elapsed time
   * @param elapsedSeconds - Seconds elapsed during search
   */
  updateProgress(elapsedSeconds: number): void {
    this.setText(`Searching for match... ${elapsedSeconds}s`);
  }

  /**
   * Cleans up animation resources
   */
  cleanup(): void {
    this.stop();
  }
}
