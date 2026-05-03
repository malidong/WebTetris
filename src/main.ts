// src/main.ts
// Main game entry point

import { BoardConfig, GameState, GameStatus, InputAction, Piece, RendererConfig } from './types/index.js';
import { createBoard, lockPiece, clearLines } from './core/Board.js';
import { createRandomPiece, rotatePiece, rotatePieceWithKick, movePiece } from './core/Piece.js';
import { checkCollision, getGhostPosition } from './core/CollisionDetector.js';
import { createInitialState, startGame, updateGameState } from './core/GameState.js';
import { initRenderer } from './renderer/CanvasRenderer.js';
import { renderBoard } from './renderer/BoardRenderer.js';
import { renderPiece } from './renderer/PieceRenderer.js';
import { renderUI, renderGameOver, renderPaused } from './renderer/UIRenderer.js';
import { renderPauseOverlay } from './ui/PauseOverlay.js';
import { initKeyboardHandler, DEFAULT_KEYBOARD_MAPPING } from './input/KeyboardHandler.js';
import { initTouchHandler } from './input/TouchHandler.js';
import { GameLoop } from './engine/GameLoop.js';
import { calculateScore } from './scoring/ScoreManager.js';
import { calculateLevel, calculateSpeed, DEFAULT_LEVEL_CONFIG } from './scoring/LevelManager.js';
import { loadHighScores, saveHighScore } from './scoring/HighScoreManager.js';
import { saveGame, loadGame } from './storage/GameSave.js';
import { renderMenu } from './ui/MenuScreen.js';

// Game configuration
const boardConfig: BoardConfig = {
  width: 10,
  height: 20,
  cellSize: 30
};

const rendererConfig: RendererConfig = {
  canvas: 'tetris-canvas',
  boardConfig,
  colors: {
    background: '#000000',
    grid: '#333333',
    ghost: '#FFFFFF40'
  }
};

// Initialize
const renderContext = initRenderer(rendererConfig);
let gameState = createInitialState(boardConfig);

const levelConfig = DEFAULT_LEVEL_CONFIG;

// Game loop
const gameLoop = new GameLoop(
  () => {
    if (gameState.status === GameStatus.PLAYING) {
      gameState = updateGameState(gameState, boardConfig);
      
      const currentLevel = calculateLevel(gameState.lines, levelConfig);
      if (currentLevel !== gameState.level) {
        gameState.level = currentLevel;
        const newSpeed = calculateSpeed(currentLevel, levelConfig);
        gameLoop.setSpeed(newSpeed);
      }
    }
  },
  () => {
    // Clear Canvas first (fixes residue color issue)
    renderContext.ctx.fillStyle = rendererConfig.colors.background;
    renderContext.ctx.fillRect(0, 0, renderContext.width, renderContext.height);
    
    // Render board
    renderBoard(renderContext, gameState.board, rendererConfig.boardConfig);
    
    // Render current piece
    if (gameState.currentPiece) {
      renderPiece(renderContext, gameState.currentPiece, rendererConfig);
    }
    
    // Render UI
    renderUI(renderContext, gameState, rendererConfig);
    
    // Render overlays
    if (gameState.status === GameStatus.GAME_OVER) {
      renderGameOver(renderContext);
    } else if (gameState.status === GameStatus.PAUSED) {
      renderPaused(renderContext);
    }
  },
  { fps: 60, initialSpeed: levelConfig.initialSpeed }
);

// Input handling
const handleInput = (event: any) => {
  if (gameState.status === GameStatus.PLAYING) {
    switch (event.action) {
      case InputAction.MOVE_LEFT:
        if (gameState.currentPiece && !checkCollision(gameState.board, gameState.currentPiece, gameState.currentPiece.x - 1, gameState.currentPiece.y)) {
          gameState.currentPiece = movePiece(gameState.currentPiece, -1, 0);
        }
        break;
      case InputAction.MOVE_RIGHT:
        if (gameState.currentPiece && !checkCollision(gameState.board, gameState.currentPiece, gameState.currentPiece.x + 1, gameState.currentPiece.y)) {
          gameState.currentPiece = movePiece(gameState.currentPiece, 1, 0);
        }
        break;
      case InputAction.MOVE_DOWN:
        if (gameState.currentPiece && !checkCollision(gameState.board, gameState.currentPiece, gameState.currentPiece.x, gameState.currentPiece.y + 1)) {
          gameState.currentPiece = movePiece(gameState.currentPiece, 0, 1);
          gameState.score += calculateScore(0, 1, gameState.level);
        }
        break;
      case InputAction.HARD_DROP:
        if (gameState.currentPiece) {
          const ghostY = getGhostPosition(gameState.board, gameState.currentPiece);
          const dropDistance = ghostY - gameState.currentPiece.y;
          gameState.currentPiece = movePiece(gameState.currentPiece, 0, dropDistance);
          gameState.score += calculateScore(0, dropDistance, gameState.level);
        }
        break;
      case InputAction.ROTATE_CW:
        if (gameState.currentPiece) {
          const rotated = rotatePieceWithKick(gameState.board, gameState.currentPiece);
          if (rotated) {
            gameState.currentPiece = rotated;
          }
        }
        break;
      case InputAction.PAUSE:
        if (gameState.status === GameStatus.PLAYING) {
          gameState.status = GameStatus.PAUSED;
          gameLoop.pause();
        } else if (gameState.status === GameStatus.PAUSED) {
          gameState.status = GameStatus.PLAYING;
          gameLoop.resume();
        }
        break;
    }
  } else if (gameState.status === GameStatus.PAUSED && event.action === InputAction.PAUSE) {
    gameState.status = GameStatus.PLAYING;
    gameLoop.resume();
  } else if (gameState.status === GameStatus.IDLE && event.action === InputAction.RESTART) {
    gameState = startGame(gameState, boardConfig);
    gameLoop.start();
  } else if (gameState.status === GameStatus.GAME_OVER && event.action === InputAction.RESTART) {
    gameState = startGame(gameState, boardConfig);
  }
};

// Initialize input handlers
const cleanupKeyboard = initKeyboardHandler(DEFAULT_KEYBOARD_MAPPING, handleInput);
const canvas = document.getElementById('tetris-canvas') as HTMLCanvasElement;
const cleanupTouch = initTouchHandler(canvas, undefined, handleInput);

// Show menu
const highScores = loadHighScores();
renderMenu(renderContext, highScores);

// Cleanup function
export function cleanup() {
  cleanupKeyboard();
  cleanupTouch();
  gameLoop.stop();
}
