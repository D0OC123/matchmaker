/**
 * Events - Event definitions and event emitter interface
 * Defines the event system used for state management
 */

import { SystemEvent } from './models';
import { EventType } from './enums';

/**
 * Event listener callback type
 */
export type EventListener = (event: SystemEvent) => void;

/**
 * Event emitter interface for state change notifications
 */
export interface IEventEmitter {
  on(eventType: EventType, listener: EventListener): void;
  off(eventType: EventType, listener: EventListener): void;
  emit(event: SystemEvent): void;
  removeAllListeners(): void;
}
