/**
 * Storage Utilities - Utilities for managing browser local storage
 * Handles persistence of user settings across sessions
 */

/**
 * Saves a value to local storage
 * @param key - Storage key identifier
 * @param value - Value to store (will be JSON stringified)
 */
export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save to storage with key ${key}:`, error);
  }
}

/**
 * Retrieves a value from local storage
 * @param key - Storage key identifier
 * @returns Parsed value or null if not found
 */
export function getFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Failed to retrieve from storage with key ${key}:`, error);
    return null;
  }
}

/**
 * Removes a value from local storage
 * @param key - Storage key identifier
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove from storage with key ${key}:`, error);
  }
}

/**
 * Clears all items from local storage
 */
export function clearStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}
