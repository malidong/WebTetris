// src/core/Board.ts
// Game board state management

import { BoardConfig, Board, Piece, PieceType } from '../types/index.js';

/**
 * Create new game board
 * @requires config.width > 0 && config.height > 0
 * @ensures result.length === config.height
 * @ensures result.every(row => row.length === config.width)
 */
export function createBoard(config: BoardConfig): Board {
  return Array.from({ length: config.height }, () =>
    Array.from({ length: config.width }, () => null)
  );
}

/**
 * Lock piece onto board
 * @requires piece !== null
 * @requires piece position is within bounds
 * @side-effects returns new board with piece placed
 */
export function lockPiece(board: Board, piece: Piece): Board {
  const newBoard = board.map(row => [...row]);
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== null) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
          newBoard[boardY][boardX] = piece.shape[y][x];
        }
      }
    }
  }
  
  return newBoard;
}

/**
 * Check and clear filled lines
 * @returns updated board and number of cleared lines
 * @side-effects clears full rows, shifts above rows down
 */
export function clearLines(board: Board): { board: Board; clearedLines: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const clearedLines = board.length - newBoard.length;
  
  while (newBoard.length < board.length) {
    newBoard.unshift(Array.from({ length: board[0].length }, () => null));
  }
  
  return { board: newBoard, clearedLines };
}

/**
 * Get cell value at position
 */
export function getCell(board: Board, row: number, col: number): PieceType | null {
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) {
    return null;
  }
  return board[row][col];
}
