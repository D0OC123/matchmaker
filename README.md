# OGFN Matchmaker System v27.11

## Overview

A complete, fully client-side matchmaking system for OGFN (Open Game For None) built entirely in TypeScript. The system operates without any backend, database, or external APIs.

## Features

- ✅ **Pure TypeScript** - No JavaScript, 100% type-safe
- ✅ **Client-Side Only** - No backend or database required
- ✅ **Region Selection** - Multiple regions (NA East/West, EU, Asia Pacific, South America, Middle East)
- ✅ **Game Modes** - Solo, Duo, Squad, and Custom modes
- ✅ **Queue System** - Real-time queue with animated search
- ✅ **Match Finding** - Simulated match discovery with realistic wait times
- ✅ **Countdown Timer** - Pre-match countdown before entry
- ✅ **Settings Persistence** - Stores preferences in local storage
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Clean Architecture** - Modular, well-documented code

## Project Structure

```
src/
├── assets/          # CSS styles and visual assets
├── components/      # Reusable UI components
├── config/          # Configuration and constants
├── models/          # Business logic orchestrators
├── screens/         # Full-screen UI layouts
├── services/        # Core business logic services
├── types/           # TypeScript interfaces and enums
├── utils/           # Utility functions
└── index.ts         # Application entry point

Root Files:
├── index.html       # Main HTML file
├── package.json     # Dependencies and scripts
└── tsconfig.json    # TypeScript configuration
```

## Architecture

### Layers

1. **Components** - Reusable UI elements (Button, RegionSelector, etc.)
2. **Screens** - Full-screen views (MatchmakerScreen, QueueScreen, etc.)
3. **Services** - Business logic (MatchmakerService, StorageService, etc.)
4. **Models** - Application orchestrators (ApplicationController, ScreenManager)
5. **Types** - Shared interfaces and enums

### Data Flow

```
User Interaction
    ↓
UI Components / Screens
    ↓
ApplicationController
    ↓
MatchmakerService / Other Services
    ↓
EventEmitter (State Changes)
    ↓
UI Update
```

## Getting Started

### Prerequisites

- Node.js 16+ or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Serve the application (requires http-server)
npm run serve

# Watch mode during development
npm run dev
```

### Running the Application

**⚡ Easiest Way:**
1. **Double-click** `start.bat` in the Matchmaker folder
2. Server starts automatically on `http://26.101.130.210:5353`

**Or use command line:**
```bash
npm run build
http-server dist -p 5353
```

Then open `http://26.101.130.210:5353` in your browser (VPN required)

## Usage

### Main Flow

1. **Matchmaker Screen** - Select region and game mode
2. **Queue Screen** - Watch for match with animated search
3. **Match Found Screen** - Review match details
4. **Countdown Screen** - Wait for match to start
5. **Reset** - Returns to Matchmaker screen after countdown

### Settings Persistence

All user settings (region and game mode) are automatically saved to browser local storage and restored on page reload.

## Key Components

### MatchmakerService
Core service managing the entire matchmaking workflow:
- Region and game mode selection
- Queue management
- Match simulation and generation
- Countdown orchestration
- Event publishing

### EventEmitter
Implements pub-sub pattern for state changes:
- Decoupled communication between components
- Type-safe event handling
- Event history and debugging support

### StorageService
Handles local storage operations:
- Settings persistence
- Automatic serialization/deserialization
- Error handling and fallbacks

### MatchSimulationService
Simulates backend matchmaking behavior:
- Random wait times (3-15 seconds)
- Match generation with realistic data
- Map and team assignment
- Player distribution

### ScreenManager
Controls screen transitions:
- Mutual exclusivity (only one screen visible)
- Clean lifecycle management
- Coordination between screens

### ApplicationController
Main orchestrator:
- Connects UI events to business logic
- Manages state transitions
- Coordinates all components

## File Descriptions

### Components
- **Button.ts** - Reusable button with click handlers
- **RegionSelector.ts** - Region selection UI with radio buttons
- **GameModeSelector.ts** - Game mode selection UI
- **LoadingAnimation.ts** - Animated spinner for search feedback
- **CountdownDisplay.ts** - Large countdown timer display
- **MatchInfoDisplay.ts** - Formatted match information display
- **WaitingTimeDisplay.ts** - Real-time wait time counter

### Screens
- **MatchmakerScreen.ts** - Settings and Play button
- **QueueScreen.ts** - Search animation and wait time
- **MatchFoundScreen.ts** - Match details confirmation
- **CountdownScreen.ts** - Pre-match countdown

### Services
- **EventEmitter.ts** - Pub-sub event system
- **MatchmakerService.ts** - Core matchmaking orchestrator
- **MatchSimulationService.ts** - Backend behavior simulation
- **StorageService.ts** - Local storage wrapper

### Models
- **ApplicationController.ts** - Main app orchestrator
- **ScreenManager.ts** - Screen lifecycle management

### Types
- **enums.ts** - Game enums (Region, GameMode, QueueState)
- **models.ts** - Data interfaces
- **events.ts** - Event system types

### Utils
- **random.ts** - Random number and ID generation
- **storage.ts** - Local storage wrapper
- **time.ts** - Time formatting and delays

### Config
- **defaults.ts** - Default values and constants

## Styling

The application includes a complete, modern UI with:
- Gradient backgrounds and text
- Smooth animations and transitions
- Responsive grid layouts
- Mobile-optimized design
- Dark theme with cyan accents
- Disabled and hover states

All styles are in `src/assets/styles.css` with comprehensive media queries for all screen sizes.

## Simulation Details

### Wait Time
- Minimum: 3 seconds
- Maximum: 15 seconds
- Varies randomly each search

### Countdown
- Duration: 10 seconds
- Updates every 1 second
- Color changes from green → yellow → red as time counts down

### Match Data
- 6 randomized map names
- Players assigned to teams based on game mode
- Match ID and team IDs generated uniquely

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Minimal DOM manipulation
- Efficient event handling
- No memory leaks (proper cleanup)
- Optimized CSS with no heavy animations
- Fast TypeScript compilation

## Code Quality

- 100% TypeScript (strict mode enabled)
- Comprehensive type definitions
- JSDoc comments on all public methods
- Clean separation of concerns
- Modular architecture
- No external dependencies required

## Extensibility

The architecture allows easy extension:
- Add new screens by extending the Screen pattern
- Add new services for additional features
- Extend EventEmitter for additional events
- Add new components to UI library

## Known Limitations

- Simulated wait times are random (not based on actual metrics)
- Match data is randomly generated (no real balance checking)
- Countdown does not actually launch a game

## License

MIT

## Version

27.11.0

---

**Built with TypeScript | Client-Side Only | Zero Dependencies**
