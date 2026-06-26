/**
 * GameModeSelector Component - UI for selecting game mode
 * Displays available game modes (Solo, Duo, Squad, Custom)
 * Handles mode selection and persistence
 */

import { GameMode } from '../types/index';

/**
 * GameModeSelector class - Creates game mode selection UI
 * Uses radio buttons for mode selection
 */
export class GameModeSelector {
  private element: HTMLDivElement;
  private selectedMode: GameMode;
  private onChangeHandler: ((mode: GameMode) => void) | null = null;
  private radioButtons: Map<GameMode, HTMLInputElement> = new Map();

  /**
   * Constructor creates the game mode selector UI
   * @param initialMode - Initially selected game mode
   */
  constructor(initialMode: GameMode) {
    this.element = document.createElement('div');
    this.element.className = 'game-mode-selector';
    this.selectedMode = initialMode;
    this.createUI();
  }

  /**
   * Creates the UI elements for game mode selection
   */
  private createUI(): void {
    const container = document.createElement('div');
    container.className = 'mode-container';

    const title = document.createElement('h3');
    title.textContent = 'Game Mode';
    container.appendChild(title);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'mode-options';

    Object.values(GameMode).forEach(mode => {
      const label = document.createElement('label');
      label.className = 'mode-label';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'gameMode';
      radio.value = mode;
      radio.checked = mode === this.selectedMode;

      this.radioButtons.set(mode, radio);

      radio.addEventListener('change', () => {
        this.selectMode(mode);
      });

      const labelText = document.createElement('span');
      labelText.textContent = this.getModeDisplayName(mode);

      label.appendChild(radio);
      label.appendChild(labelText);
      optionsContainer.appendChild(label);
    });

    container.appendChild(optionsContainer);
    this.element.appendChild(container);
  }

  /**
   * Gets human-readable display name for game mode
   * @param mode - Game mode to get name for
   * @returns Display name string
   */
  private getModeDisplayName(mode: GameMode): string {
    const displayNames: Record<GameMode, string> = {
      [GameMode.SOLO]: 'Solo',
      [GameMode.DUO]: 'Duo',
      [GameMode.SQUAD]: 'Squad',
      [GameMode.CUSTOM]: 'Custom'
    };
    return displayNames[mode];
  }

  /**
   * Selects a game mode and notifies listeners
   * @param mode - Game mode to select
   */
  private selectMode(mode: GameMode): void {
    this.selectedMode = mode;
    if (this.onChangeHandler) {
      this.onChangeHandler(mode);
    }
  }

  /**
   * Sets the change handler callback
   * @param handler - Function to call when mode changes
   * @returns This selector for chaining
   */
  onChange(handler: (mode: GameMode) => void): GameModeSelector {
    this.onChangeHandler = handler;
    return this;
  }

  /**
   * Gets the currently selected game mode
   * @returns Selected game mode
   */
  getSelectedMode(): GameMode {
    return this.selectedMode;
  }

  /**
   * Gets the underlying HTML element
   * @returns HTMLDivElement
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Updates the selected game mode
   * @param mode - Game mode to select
   */
  updateSelection(mode: GameMode): void {
    this.selectedMode = mode;
    const radio = this.radioButtons.get(mode);
    if (radio) {
      radio.checked = true;
    }
  }

  /**
   * Disables all mode options
   */
  disable(): void {
    this.radioButtons.forEach(radio => {
      radio.disabled = true;
    });
  }

  /**
   * Enables all mode options
   */
  enable(): void {
    this.radioButtons.forEach(radio => {
      radio.disabled = false;
    });
  }

  /**
   * Cleans up event listeners
   */
  cleanup(): void {
    this.radioButtons.forEach(radio => {
      radio.removeEventListener('change', () => {});
    });
    this.radioButtons.clear();
  }
}
