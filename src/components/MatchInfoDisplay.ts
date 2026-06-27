/**
 * MatchInfoDisplay Component - Shows detailed match information
 * Displays match details after a match is found
 * Shows region, mode, map, teams, and player count
 */

import type { MatchInfo } from '../types/index';
import { MODE_IMAGES } from '../config/defaults';

/**
 * MatchInfoDisplay class - Creates match information display UI
 * Shows all relevant match details in an organized layout
 */
export class MatchInfoDisplay {
  private element: HTMLDivElement;

  /**
   * Constructor creates the match info display
   */
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'match-info-container';
  }

  /**
   * Gets the underlying HTML element
   * @returns HTMLDivElement
   */
  getElement(): HTMLDivElement {
    return this.element;
  }

  /**
   * Displays match information
   * @param match - MatchInfo object to display
   */
  displayMatch(match: MatchInfo): void {
    this.element.innerHTML = ''; // Clear previous content

    const title = document.createElement('h2');
    title.textContent = 'Match Found!';
    this.element.appendChild(title);

    // Mode Image
    const imageSection = document.createElement('div');
    imageSection.className = 'match-image-section';
    const image = document.createElement('img');
    image.src = MODE_IMAGES[match.gameMode as keyof typeof MODE_IMAGES] || '';
    image.alt = `${match.gameMode} Mode`;
    image.className = 'match-mode-image';
    imageSection.appendChild(image);
    this.element.appendChild(imageSection);

    // Match ID
    const idSection = this.createInfoSection('Match ID', match.matchId);
    this.element.appendChild(idSection);

    // Region
    const regionSection = this.createInfoSection('Region', match.region);
    this.element.appendChild(regionSection);

    // Game Mode
    const modeSection = this.createInfoSection('Game Mode', match.gameMode);
    this.element.appendChild(modeSection);

    // Map
    const mapSection = this.createInfoSection('Map', match.matchDetails.mapName);
    this.element.appendChild(mapSection);

    // Player Count
    const playerSection = this.createInfoSection(
      'Total Players',
      match.playerCount.toString()
    );
    this.element.appendChild(playerSection);

    // Game Mode Info
    const gameModeInfoSection = this.createInfoSection(
      'Game Mode Details',
      match.matchDetails.gameModeInfo
    );
    this.element.appendChild(gameModeInfoSection);

    // Teams Info
    const teamsTitle = document.createElement('h3');
    teamsTitle.textContent = 'Teams';
    teamsTitle.className = 'teams-title';
    this.element.appendChild(teamsTitle);

    const teamsList = document.createElement('ul');
    teamsList.className = 'teams-list';

    match.matchDetails.playerTeams.forEach(team => {
      const teamItem = document.createElement('li');
      teamItem.textContent = `${team.teamName}: ${team.memberCount} member(s)`;
      teamsList.appendChild(teamItem);
    });

    this.element.appendChild(teamsList);
  }

  /**
   * Creates an info section with label and value
   * @param label - Section label
   * @param value - Section value
   * @returns Created info section element
   */
  private createInfoSection(label: string, value: string): HTMLDivElement {
    const section = document.createElement('div');
    section.className = 'info-section';

    const labelElement = document.createElement('span');
    labelElement.className = 'info-label';
    labelElement.textContent = `${label}:`;

    const valueElement = document.createElement('span');
    valueElement.className = 'info-value';
    valueElement.textContent = value;

    section.appendChild(labelElement);
    section.appendChild(valueElement);

    return section;
  }

  /**
   * Shows the match info display
   */
  show(): void {
    this.element.style.display = 'block';
  }

  /**
   * Hides the match info display
   */
  hide(): void {
    this.element.style.display = 'none';
  }

  /**
   * Clears the match information
   */
  clear(): void {
    this.element.innerHTML = '';
  }
}
