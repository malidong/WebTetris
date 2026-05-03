// src/ui/PauseOverlay.ts
// Pause overlay rendering

import { RenderContext } from '../types/index.js';

/**
 * Render pause overlay
 * @side-effects draws pause screen on Canvas
 */
export function renderPauseOverlay(context: RenderContext): void {
  const { ctx } = context;
  
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, context.width, context.height);
  
  // Pause text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSED', context.width / 2, context.height / 2);
  ctx.font = '24px Arial';
  ctx.fillText('Press P to Resume', context.width / 2, context.height / 2 + 60);
  ctx.textAlign = 'left';
}
