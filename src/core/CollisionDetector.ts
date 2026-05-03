// src/core/CollisionDetector.ts
// Collision detection logic

import { Board, Piece } from '../types/index.js';

/**
 * Check if piece collides at target position
 * @requires board !== null && piece !== null
 * @returns true if collision detected
 */
export function checkCollision(
  board: Board,
  piece: Piece,
  newX: number,
  newY: number
): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== null) {
        const boardX = newX + x;
        const boardY = newY + y;
        
        // Check boundaries
        if (boardX < 0 || boardX >= board[0].length || boardY >= board.length) {
          return true;
        }
        
        // Check collision with locked pieces (allow above top)
        if (boardY >= 0 && board[boardY][boardX] !== null) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Get ghost position (hard drop preview)
 * @returns lowest valid Y position
 * @ensures result.y >= piece.y
 */
export function getGhostPosition(board: Board, piece: Piece): number {
  let ghostY = piece.y;
  
  while (!checkCollision(board, piece, piece.x, ghostY + 1)) {
    ghostY++;
  }
  
  return ghostY;
}
