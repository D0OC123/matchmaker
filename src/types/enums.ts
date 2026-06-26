/**
 * Enums - Enumeration definitions for the Matchmaker system
 * Defines all constant values like regions, game modes, and queue states
 */

/**
 * Game regions available in OGFN 27.11
 */
export enum Region {
  NA_EAST = 'NA_EAST',
  NA_WEST = 'NA_WEST',
  EU = 'EU',
  ASIA_PACIFIC = 'ASIA_PACIFIC',
  SOUTH_AMERICA = 'SOUTH_AMERICA',
  MIDDLE_EAST = 'MIDDLE_EAST'
}

/**
 * Game modes available for matchmaking
 */
export enum GameMode {
  SOLO = 'SOLO',
  DUO = 'DUO',
  SQUAD = 'SQUAD',
  CUSTOM = 'CUSTOM'
}

/**
 * Queue states during matchmaking process
 */
export enum QueueState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  MATCH_FOUND = 'MATCH_FOUND',
  COUNTDOWN = 'COUNTDOWN',
  CANCELLED = 'CANCELLED'
}

/**
 * System event types
 */
export enum EventType {
  QUEUE_STARTED = 'QUEUE_STARTED',
  QUEUE_CANCELLED = 'QUEUE_CANCELLED',
  MATCH_FOUND = 'MATCH_FOUND',
  COUNTDOWN_STARTED = 'COUNTDOWN_STARTED',
  COUNTDOWN_FINISHED = 'COUNTDOWN_FINISHED',
  SETTINGS_CHANGED = 'SETTINGS_CHANGED'
}

/**
 * Screen types for navigation
 */
export enum ScreenType {
  MATCHMAKER = 'MATCHMAKER',
  QUEUE = 'QUEUE',
  COUNTDOWN = 'COUNTDOWN'
}
