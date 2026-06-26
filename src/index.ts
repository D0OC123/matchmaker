/**
 * Main Entry Point - OGFN Matchmaker Application
 * Initializes and starts the complete matchmaking system
 * All logic is client-side with no backend dependencies
 */

import { ApplicationController } from './models/index';

/**
 * Application initialization function
 * Called when the DOM is ready
 */
function initializeApplication(): void {
  // Get or create main container
  let container = document.getElementById('app');
  if (!container) {
    container = document.createElement('div');
    container.id = 'app';
    container.className = 'app-container';
    document.body.appendChild(container);
  }

  // Create and start the application controller
  const app = new ApplicationController(container as HTMLDivElement);
  app.start();

  // Store reference in window for debugging if needed
  (window as unknown as Record<string, unknown>).matchmakerApp = app;
}

/**
 * Wait for DOM to be fully loaded before initializing
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
  initializeApplication();
}
