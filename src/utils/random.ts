/**
 * Random Utilities - Utility functions for random value generation
 * Used for simulating unpredictable game matchmaking behavior
 */

/**
 * Generates a random integer between min (inclusive) and max (inclusive)
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random integer in range
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random wait time in milliseconds for simulating search time
 * @param minMs - Minimum wait time in milliseconds
 * @param maxMs - Maximum wait time in milliseconds
 * @returns Random wait time in milliseconds
 */
export function getRandomWaitTime(minMs: number, maxMs: number): number {
  return getRandomInt(minMs, maxMs);
}

/**
 * Generates a unique match ID
 * @returns String representing unique match ID
 */
export function generateMatchId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `MATCH_${timestamp}${randomPart}`.toUpperCase();
}

/**
 * Generates a unique team ID
 * @returns String representing unique team ID
 */
export function generateTeamId(): string {
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `TEAM_${randomPart}`.toUpperCase();
}

/**
 * Gets a random element from an array
 * @param array - Array to select from
 * @returns Random element from array
 */
export function getRandomElement<T>(array: T[]): T {
  return array[getRandomInt(0, array.length - 1)];
}
