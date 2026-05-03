// src/renderer/PieceRenderer.ts
// Piece rendering

import { RenderContext, Piece, BoardConfig, PIECE_COLORS, RendererConfig } from '../types/index.js';

/**
 * Render active piece
 * @side-effects draws piece on Canvas
 */
export function renderPiece(
  context: RenderContext,
  piece: Piece,
  config: RendererConfig
): void {
  const { ctx } = context;
  const { cellSize } = config.boardConfig;
  const color = PIECE_COLORS[piece.type];
  
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== null) {
        renderCell(context, piece.x + x, piece.y + y, color, config.boardConfig);
      }
    }
  }
}

/**
 * Render ghost piece (hard drop preview)
 * @side-effects draws semi-transparent preview
 */
export function renderGhostPiece(
  context: RenderContext,
  piece: Piece,
  ghostY: number,
  config: RendererConfig
): void {
  const { ctx } = context;
  const { cellSize } = config.boardConfig;
  const color = PIECE_COLORS[piece.type];
  
  // Set transparency
  ctx.globalAlpha = 0.3;
    
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] !== null) {
        renderCell(context, piece.x + x, ghostY + y, color, config.boardConfig);
      }
    }
  }
    
  ctx.globalAlpha = 1.0;
}

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
    
  ctx.fillStyle = color;
  ctx.fillRect(
    x * cellSize + padding,
    y * cellSize + padding,
    cellSize - padding * 2,
    cellSize - padding * 2
  );
}
