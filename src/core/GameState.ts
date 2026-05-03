// src/core/GameState.ts
// Game state machine

import { BoardConfig, GameState, GameStatus, Piece, Board } from '../types/index.js';
import { createBoard, lockPiece, clearLines } from './Board.js';
import { createRandomPiece, movePiece } from './Piece.js';
import { checkCollision, getGhostPosition } from './CollisionDetector.js';
import { calculateScore } from '../scoring/ScoreManager.js';

/**
 * Create initial game state
 * @ensures result.status === GameStatus.IDLE
 */
export function createInitialState(boardConfig: BoardConfig): GameState {
  return {
    board: createBoard(boardConfig),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    status: GameStatus.IDLE,
    startTime: null,
    pausedTime: null
  };
}

/**
 * Start new game
 * @requires state.status === IDLE || GAME_OVER
 * @ensures result.status === PLAYING
 */
export function startGame(state: GameState, boardConfig: BoardConfig): GameState {
  return {
    ...createInitialState(boardConfig),
    status: GameStatus.PLAYING,
    currentPiece: createRandomPiece(boardConfig),
    nextPiece: createRandomPiece(boardConfig),
    startTime: Date.now()
  };
}

/**
 * Update game state (called each frame)
 */
export function updateGameState(state: GameState, boardConfig: BoardConfig): GameState {
  if (state.status !== GameStatus.PLAYING || !state.currentPiece) {
    return state;
  }
  
  const newY = state.currentPiece.y + 1;
  
  // Check if piece landed
  if (checkCollision(state.board, state.currentPiece, state.currentPiece.x, newY)) {
    // Lock piece to board
    const newBoard = lockPiece(state.board, state.currentPiece);
    
    // Clear filled lines
    const { board: clearedBoard, clearedLines } = clearLines(newBoard);
    
    // Check game over
    if (state.currentPiece.y <= 0) {
      return {
        ...state,
        board: newBoard,
        status: GameStatus.GAME_OVER,
        currentPiece: null
      };
    }
    
    // Check if new piece collides (game over)
    if (state.nextPiece && checkCollision(clearedBoard, state.nextPiece, state.nextPiece.x, state.nextPiece.y)) {
      return {
        ...state,
        board: clearedBoard,
        status: GameStatus.GAME_OVER,
        currentPiece: null
      };
    }
    
    // Generate new piece
    return {
      ...state,
      board: clearedBoard,
      currentPiece: state.nextPiece,
      nextPiece: createRandomPiece(boardConfig),
      lines: state.lines + clearedLines,
      score: state.score + calculateScore(clearedLines, 0, state.level)
    };
  }
  
  // Piece continues falling
  return {
    ...state,
    currentPiece: movePiece(state.currentPiece, 0, 1)
  };
}
