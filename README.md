# WebTetris

A web-based Tetris game built with TypeScript and HTML5 Canvas.

## Play Online

Launch the game locally:

```bash
npm install
npm run build
npm start
```

Then open `http://localhost:8080`

## Docker Deployment

Run the game in an isolated Docker container:

```bash
docker compose up -d --build
```

Then open `http://localhost:8080`

Stop the container:

```bash
docker compose down
```

## Controls

- **Arrow Left/Right**: Move piece
- **Arrow Down**: Soft drop
- **Arrow Up**: Rotate clockwise
- **Space**: Hard drop
- **Z**: Rotate counter-clockwise
- **P**: Pause
- **Enter**: Restart (when game over)

## Tech Stack

- TypeScript
- HTML5 Canvas
- Node.js (build tool)
- Nginx (Docker runtime)

## Build

```bash
npm run build  # Outputs to dist/
```
