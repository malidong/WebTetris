// src/renderer/BoardRenderer.ts
// Game board rendering

import { RenderContext, Board, BoardConfig, PieceType, PIECE_COLORS } from '../types/index.js';
import { getCell } from '../core/Board.js';

/**
 * Render game board
 * @side-effects draws board grid and locked pieces on Canvas
 */
export function renderBoard(
  context: RenderContext,
  board: Board,
  config: BoardConfig
): void {
  const { ctx } = context;
  const { cellSize } = config;
  
  // Draw grid lines
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;
  
  for (let x = 0; x <= config.width; x++) {
    ctx.beginPath();
    ctx.moveTo(x * cellSize, 0);
    ctx.lineTo(x * cellSize, context.height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= config.height; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellSize);
    ctx.lineTo(config.width * cellSize, y * cellSize);
    ctx.stroke();
  }
  
  // Draw locked pieces
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      if (board[y][x] !== null) {
        renderCell(context, x, y, PIECE_COLORS[board[y][x]!], config);
      }
    }
  }
}

/**
 * Render single cell
 * @side-effects draws filled rectangle with border
 */
function renderCell(
  context: RenderContext,
  x: number,
  y: number,
  color: string,
  config: BoardConfig
): void {
  const { ctx } = context;
  const cellSize = config.cellSize;
  const padding = 1;
  
  // Fill
  ctx.fillStyle = color;
  ctx.fillRect(
    x * cellSize + padding,
    y * cellSize + padding,
    cellSize - padding * 2,
    cellSize - padding * 2
  );
  
  // Border (3D effect)
  ctx.strokeStyle = '#FFFFFF40';
  ctx.strokeRect(
    x * cellSize + padding,
    y * cellSize + padding,
    cellSize - padding * 2,
    cellSize - padding * 2
  );
}
