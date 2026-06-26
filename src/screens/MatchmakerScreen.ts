/**
 * MatchmakerScreen - Main matchmaker interface screen
 * Displays region and game mode selection with Play button
 * User configures their matchmaking preferences here
 */

import {
  Button,
  RegionSelector,
  GameModeSelector
} from '../components/index';
import { MatchmakerService } from '../services/index';
import { Region, GameMode, EventType } from '../types/index';
import type { SystemEvent } from '../types/index';

/**
 * MatchmakerScreen class - Main UI screen for matchmaking configuration
 * Manages region selection, game mode selection, and play button
 */
export class MatchmakerScreen {
  private element: HTMLDivElement;
  private matchmakerService: MatchmakerService;
  private regionSelector: RegionSelector;
  private gameModeSelector: GameModeSelector;
  private playButton: Button;
  private onPlayHandler: (() => void) | null = null;

  /**
   * Constructor creates the matchmaker screen
   * @param matchmakerService - MatchmakerService instance
   */
  constructor(matchmakerService: MatchmakerService) {
    this.matchmakerService = matchmakerService;

    const state = matchmakerService.getState();

    this.element = document.createElement('div');
    this.element.className = 'screen matchmaker-screen';
    this.element.id = 'matchmaker-screen';

    // Create title
    const title = document.createElement('h1');
    title.textContent = 'OGFN Matchmaker';
    title.className = 'screen-title';
    this.element.appendChild(title);

    // Create subtitle
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Configure your preferences and find a match';
    subtitle.className = 'screen-subtitle';
    this.element.appendChild(subtitle);

    // Create form container
    const formContainer = document.createElement('div');
    formContainer.className = 'form-container';

    // Region selector
    this.regionSelector = new RegionSelector(state.settings.selectedRegion);
    this.regionSelector.onChange((region: Region) => {
      this.matchmakerService.selectRegion(region);
    });
    formContainer.appendChild(this.regionSelector.getElement());

    // Game mode selector
    this.gameModeSelector = new GameModeSelector(state.settings.selectedGameMode);
    this.gameModeSelector.onChange((mode: GameMode) => {
      this.matchmakerService.selectGameMode(mode);
    });
    formContainer.appendChild(this.gameModeSelector.getElement());

    this.element.appendChild(formContainer);

    // Create buttons container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    // Play button
    this.playButton = new Button('PLAY', 'btn-primary', 'play-btn')
      .onClick(() => {
        if (this.onPlayHandler) {
          this.onPlayHandler();
        }
      });
    buttonContainer.appendChild(this.playButton.getElement());

    this.element.appendChild(buttonContainer);

    // Subscribe to settings changes
    this.subscribeToEvents();
  }

  /**
   * Subscribes to relevant events
   */
  private subscribeToEvents(): void {
    this.matchmakerService.on(EventType.SETTINGS_CHANGED, (event: SystemEvent) => {
      const settings = event.payload.settings as { selectedRegion: Region; selectedGameMode: GameMode };
      this.regionSelector.updateSelection(settings.selectedRegion);
      this.gameModeSelector.updateSelection(settings.selectedGameMode);
    });
  }

  /**
   * Sets the handler for play button click
   * @param handler - Function to call when play is clicked
   * @returns This screen for chaining
   */
  onPlay(handler: () => void): MatchmakerScreen {
    this.onPlayHandler = handler;
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
   * Enables the screen controls
   */
  enable(): void {
    this.playButton.enable();
    this.regionSelector.enable();
    this.gameModeSelector.enable();
  }

  /**
   * Disables the screen controls
   */
  disable(): void {
    this.playButton.disable();
    this.regionSelector.disable();
    this.gameModeSelector.disable();
  }

  /**
   * Cleans up resources
   */
  cleanup(): void {
    this.regionSelector.cleanup();
    this.gameModeSelector.cleanup();
    this.playButton.cleanup();
  }
}
