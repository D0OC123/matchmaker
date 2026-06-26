/**
 * EventEmitter Service - Central event management system
 * Implements a publish-subscribe pattern for state changes and notifications
 * Allows different parts of the application to communicate without tight coupling
 */

import type { SystemEvent, IEventEmitter } from '../types/index';
import { EventType } from '../types/index';

/**
 * EventEmitter class - Manages all system events
 * Uses a Map structure to store listeners for each event type
 * Implements singleton pattern with internal state management
 */
export class EventEmitter implements IEventEmitter {
  private listeners: Map<EventType, Set<(event: SystemEvent) => void>>;

  /**
   * Constructor initializes empty listeners map
   */
  constructor() {
    this.listeners = new Map();
    // Initialize all event types
    Object.values(EventType).forEach(type => {
      this.listeners.set(type, new Set());
    });
  }

  /**
   * Registers a listener for a specific event type
   * @param eventType - Type of event to listen for
   * @param listener - Callback function to execute when event is emitted
   */
  on(eventType: EventType, listener: (event: SystemEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)?.add(listener);
  }

  /**
   * Unregisters a listener for a specific event type
   * @param eventType - Type of event to stop listening for
   * @param listener - Callback function to remove
   */
  off(eventType: EventType, listener: (event: SystemEvent) => void): void {
    this.listeners.get(eventType)?.delete(listener);
  }

  /**
   * Emits an event to all registered listeners
   * Executes all listener callbacks synchronously
   * @param event - SystemEvent to emit
   */
  emit(event: SystemEvent): void {
    const eventListeners = this.listeners.get(event.type);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error);
        }
      });
    }
  }

  /**
   * Removes all listeners from all event types
   * Useful for cleanup during application shutdown
   */
  removeAllListeners(): void {
    this.listeners.forEach(listeners => {
      listeners.clear();
    });
  }

  /**
   * Gets the count of listeners for a specific event type
   * Useful for debugging and testing
   * @param eventType - Event type to check
   * @returns Number of listeners registered
   */
  getListenerCount(eventType: EventType): number {
    return this.listeners.get(eventType)?.size ?? 0;
  }
}
