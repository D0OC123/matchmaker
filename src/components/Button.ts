/**
 * Button Component - Reusable button UI element
 * Provides a styled button with click event handling
 * Base component for Play and Cancel buttons
 */

/**
 * Button class - Creates and manages button UI elements
 * Supports different styles and states
 */
export class Button {
  private element: HTMLButtonElement;
  private clickHandler: (() => void) | null = null;

  /**
   * Constructor creates a button element
   * @param text - Button display text
   * @param className - CSS class name for styling
   * @param id - HTML id attribute
   */
  constructor(text: string, className: string = '', id: string = '') {
    this.element = document.createElement('button');
    this.element.textContent = text;
    this.element.className = `btn ${className}`;
    if (id) {
      this.element.id = id;
    }
  }

  /**
   * Sets the click handler for the button
   * @param handler - Function to call when button is clicked
   * @returns This button for chaining
   */
  onClick(handler: () => void): Button {
    this.clickHandler = handler;
    this.element.addEventListener('click', handler);
    return this;
  }

  /**
   * Gets the underlying HTML element
   * @returns HTMLButtonElement
   */
  getElement(): HTMLButtonElement {
    return this.element;
  }

  /**
   * Updates button text
   * @param text - New button text
   */
  setText(text: string): void {
    this.element.textContent = text;
  }

  /**
   * Enables the button
   */
  enable(): void {
    this.element.disabled = false;
  }

  /**
   * Disables the button
   */
  disable(): void {
    this.element.disabled = true;
  }

  /**
   * Checks if button is disabled
   * @returns True if button is disabled
   */
  isDisabled(): boolean {
    return this.element.disabled;
  }

  /**
   * Shows the button
   */
  show(): void {
    this.element.style.display = 'inline-block';
  }

  /**
   * Hides the button
   */
  hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Removes click handler and cleans up
   */
  cleanup(): void {
    if (this.clickHandler) {
      this.element.removeEventListener('click', this.clickHandler);
      this.clickHandler = null;
    }
  }
}
