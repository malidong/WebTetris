// src/renderer/UIRenderer.ts
// UI rendering (score, level, next piece preview)

import { RenderContext, GameState, RendererConfig, Piece, PIECE_COLORS } from '../types/index.js';

/**
 * Render game UI (score, level, next piece)
 * @side-effects draws UI elements on Canvas right side
 */
export function renderUI(
  context: RenderContext,
  state: GameState,
  config: RendererConfig
): void {
  const { ctx } = context;
  const uiX = config.boardConfig.width * config.boardConfig.cellSize + 20;
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '20px Arial';
  
  // Score
  ctx.fillText(`Score: ${state.score}`, uiX, 40);
  
  // Level
  ctx.fillText(`Level: ${state.level}`, uiX, 80);
  
  // Lines
  ctx.fillText(`Lines: ${state.lines}`, uiX, 120);
  
  // Next piece preview
  if (state.nextPiece) {
    ctx.fillText('Next:', uiX, 180);
    renderPreviewPiece(context, state.nextPiece, uiX, 200, config.boardConfig);
  }
}

/**
 * Render preview piece (next piece)
 */
function renderPreviewPiece(
  context: RenderContext,
  piece: Piece,
  x: number,
  y: number,
  config: any
): void {
  const { ctx } = context;
  const color = PIECE_COLORS[piece.type];
  
  for (let row = 0; row < piece.shape.length; row++) {
    for (let col = 0; col < piece.shape[row].length; col++) {
      if (piece.shape[row][col] !== null) {
        ctx.fillStyle = color;
        ctx.fillRect(
          x + col * 20,
          y + row * 20,
          18,
          18
        );
      }
    }
  }
}

/**
 * Render game over screen
 */
export function renderGameOver(context: RenderContext): void {
  const { ctx } = context;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, context.width, context.height);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', context.width / 2, context.height / 2);
  ctx.font = '20px Arial';
  ctx.fillText('Press R to restart', context.width / 2, context.height / 2 + 50);
  ctx.textAlign = 'left';
}

/**
 * Render pause screen
 */
export function renderPaused(context: RenderContext): void {
  const { ctx } = context;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, context.width, context.height);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '40px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', context.width / 2, context.height / 2);
  ctx.font = '20px Arial';
  ctx.fillText('Press P to resume', context.width / 2, context.height / 2 + 50);
  ctx.textAlign = 'left';
}
