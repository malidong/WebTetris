// src/scoring/ScoreManager.ts
// Score calculation

import { ScoreEventType } from '../types/index.js';

/** Score configuration */
export const DEFAULT_SCORE_CONFIG = {
  single: 100,
  double: 300,
  triple: 500,
  tetris: 800,
  softDrop: 1,
  hardDrop: 2
};

/**
 * Calculate score
 * @requires linesCleared >= 0 && linesCleared <= 4
 * @requires dropDistance >= 0
 * @requires level >= 1
 * @ensures result >= 0
 */
export function calculateScore(
  linesCleared: number,
  dropDistance: number,
  level: number
): number {
  let baseScore = 0;
  
  switch (linesCleared) {
    case 1: baseScore = DEFAULT_SCORE_CONFIG.single; break;
    case 2: baseScore = DEFAULT_SCORE_CONFIG.double; break;
    case 3: baseScore = DEFAULT_SCORE_CONFIG.triple; break;
    case 4: baseScore = DEFAULT_SCORE_CONFIG.tetris; break;
  }
  
  const levelMultiplier = level;
  const dropBonus = dropDistance * DEFAULT_SCORE_CONFIG.softDrop;
  
  return baseScore * levelMultiplier + dropBonus;
}
