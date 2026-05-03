// src/renderer/CanvasRenderer.ts
// Main renderer initialization

import { RendererConfig, RenderContext, BoardConfig } from '../types/index.js';
import { renderBoard } from './BoardRenderer.js';
import { renderPiece } from './PieceRenderer.js';
import { renderUI, renderGameOver, renderPaused } from './UIRenderer.js';

/**
 * Initialize Canvas renderer
 * @requires config.canvas exists and is valid Canvas element or ID
 * @ensures result.ctx is valid 2D rendering context
 * @side-effects sets Canvas dimensions, gets 2D context
 */
export function initRenderer(config: RendererConfig): RenderContext {
  const canvas = typeof config.canvas === 'string'
    ? document.getElementById(config.canvas) as HTMLCanvasElement
    : config.canvas;
  
  if (!canvas) {
    throw new Error('Canvas element not found');
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get 2D context');
  }
  
  // Set Canvas dimensions
  canvas.width = config.boardConfig.width * config.boardConfig.cellSize + 200;
  canvas.height = config.boardConfig.height * config.boardConfig.cellSize;
  
  return {
    ctx,
    width: canvas.width,
    height: canvas.height
  };
}

/**
 * Render complete game frame
 * @side-effects clears Canvas and draws new game scene
 */
export function renderFrame(
  context: RenderContext,
  state: any, // GameState
  config: RendererConfig
): void {
  // Clear Canvas
  context.ctx.fillStyle = config.colors.background;
  context.ctx.fillRect(0, 0, context.width, context.height);
  
  // Render game board
  renderBoard(context, state.board, config.boardConfig);
  
  // Render current piece (ghost)
  if (state.currentPiece) {
    renderPiece(context, state.currentPiece, config);
  }
  
  // Render UI (score, level, next piece)
  renderUI(context, state, config);
  
  // Render overlays based on game state
  if (state.status === 'GAME_OVER') {
    renderGameOver(context);
  } else if (state.status === 'PAUSED') {
    renderPaused(context);
  }
}
