# Tetris Game

A web-based Tetris game built with TypeScript and HTML5 Canvas.

## Tech Stack
- TypeScript
- HTML5 Canvas
- Node.js (build tool)

## Getting Started

```bash
npm install
npm run build
npm start
```

## How to Play
- **Arrow Left/Right**: Move piece
- **Arrow Down**: Soft drop
- **Arrow Up**: Rotate clockwise
- **Space**: Hard drop
- **Z**: Rotate counter-clockwise
- **P**: Pause
- **R**: Restart

## Architecture

The game follows a modular architecture:
- `src/core/`: Game logic (Board, Piece, Collision Detection)
- `src/renderer/`: Canvas rendering
- `src/input/`: Keyboard and touch input handling
- `src/engine/`: Game loop
- `src/scoring/`: Score and level management
- `src/storage/`: Local storage for high scores
- `src/ui/`: Menu and overlay screens

## Build

```bash
npm run build  # Outputs to dist/
```
