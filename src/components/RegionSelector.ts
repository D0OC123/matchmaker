/**
 * RegionSelector Component - UI for selecting game region
 * Displays all available regions and handles selection
 * Persists selection through service integration
 */

import { Region, GameMode } from '../types/index';

/**
 * RegionSelector class - Creates region selection UI
 * Uses radio buttons or dropdown-like selection pattern
 */
export class RegionSelector {
  private element: HTMLDivElement;
  private selectedRegion: Region;
  private onChangeHandler: ((region: Region) => void) | null = null;
  private radioButtons: Map<Region, HTMLInputElement> = new Map();

  /**
   * Constructor creates the region selector UI
   * @param initialRegion - Initially selected region
   */
  constructor(initialRegion: Region) {
    this.element = document.createElement('div');
    this.element.className = 'region-selector';
    this.selectedRegion = initialRegion;
    this.createUI();
  }

  /**
   * Creates the UI elements for region selection
   */
  private createUI(): void {
    const container = document.createElement('div');
    container.className = 'region-container';

    const title = document.createElement('h3');
    title.textContent = 'Select Region';
    container.appendChild(title);

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'region-options';

    Object.values(Region).forEach(region => {
      const label = document.createElement('label');
      label.className = 'region-label';

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'region';
      radio.value = region;
      radio.checked = region === this.selectedRegion;

      this.radioButtons.set(region, radio);

      radio.addEventListener('change', () => {
        this.selectRegion(region);
      });

      const labelText = document.createElement('span');
      labelText.textContent = this.getRegionDisplayName(region);

      label.appendChild(radio);
      label.appendChild(labelText);
      optionsContainer.appendChild(label);
    });

    container.appendChild(optionsContainer);
    this.element.appendChild(container);
  }

  /**
   * Gets human-readable display name for region
   * @param region - Region to get name for
   * @returns Display name string
   */
  private getRegionDisplayName(region: Region): string {
    const displayNames: Record<Region, string> = {
      [Region.NA_EAST]: 'North America (East)',
      [Region.NA_WEST]: 'North America (West)',
      [Region.EU]: 'Europe',
      [Region.ASIA_PACIFIC]: 'Asia Pacific',
      [Region.SOUTH_AMERICA]: 'South America',
      [Region.MIDDLE_EAST]: 'Middle East'
    };
    return displayNames[region];
  }

  /**
   * Selects a region and notifies listeners
   * @param region - Region to select
   */
  private selectRegion(region: Region): void {
    this.selectedRegion = region;
    if (this.onChangeHandler) {
      this.onChangeHandler(region);
    }
  }

  /**
   * Sets the change handler callback
   * @param handler - Function to call when region changes
   * @returns This selector for chaining
   */
  onChange(handler: (region: Region) => void): RegionSelector {
    this.onChangeHandler = handler;
    return this;
  }

  /**
   * Gets the currently selected region
   * @returns Selected region
   */
  getSelectedRegion(): Region {
    return this.selectedRegion;
  }

  /**
   * Gets the underlying HTML element
   * @returns HTMLDivElement
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Updates the selected region
   * @param region - Region to select
   */
  updateSelection(region: Region): void {
    this.selectedRegion = region;
    const radio = this.radioButtons.get(region);
    if (radio) {
      radio.checked = true;
    }
  }

  /**
   * Disables all region options
   */
  disable(): void {
    this.radioButtons.forEach(radio => {
      radio.disabled = true;
    });
  }

  /**
   * Enables all region options
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
