/**
 * Time Utilities - Utility functions for time-related operations
 * Used for formatting and calculating time values
 */

/**
 * Formats milliseconds into a readable string format (MM:SS or S)
 * @param milliseconds - Time in milliseconds
 * @returns Formatted time string
 */
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${seconds}s`;
}

/**
 * Converts seconds to milliseconds
 * @param seconds - Time in seconds
 * @returns Time in milliseconds
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}

/**
 * Converts milliseconds to seconds
 * @param milliseconds - Time in milliseconds
 * @returns Time in seconds
 */
export function msToSeconds(milliseconds: number): number {
  return Math.floor(milliseconds / 1000);
}

/**
 * Creates a promise that resolves after specified milliseconds
 * @param milliseconds - Delay in milliseconds
 * @returns Promise that resolves after the delay
 */
export function delay(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

/**
 * Gets current timestamp as Date object
 * @returns Current Date object
 */
export function getCurrentTimestamp(): Date {
  return new Date();
}
