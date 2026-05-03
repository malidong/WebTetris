// src/ui/MenuScreen.ts
// Menu screen rendering

import { RenderContext, HighScore } from '../types/index.js';

/**
 * Render main menu
 * @side-effects draws menu on Canvas
 */
export function renderMenu(
  context: RenderContext,
  highScores: HighScore[]
): void {
  const { ctx } = context;
  
  // Background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, context.width, context.height);
  
  // Title
  ctx.fillStyle = '#00F0F0';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('TETRIS', context.width / 2, 100);
  
  // Prompt
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '24px Arial';
  ctx.fillText('Press ENTER to Start', context.width / 2, 200);
  ctx.fillText('Press S to Load Saved Game', context.width / 2, 250);
  
  // High scores
  ctx.font = '20px Arial';
  ctx.fillText('HIGH SCORES', context.width / 2, 350);
  
  highScores.slice(0, 5).forEach((score, index) => {
    ctx.fillText(
      `${index + 1}. ${score.playerName}: ${score.score}`,
      context.width / 2,
      400 + index * 30
    );
  });
  
  ctx.textAlign = 'left';
}
