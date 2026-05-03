// src/scoring/LevelManager.ts
// Level management

import { LevelConfig } from '../types/index.js';

/** Default level config */
export const DEFAULT_LEVEL_CONFIG: LevelConfig = {
  initialLevel: 1,
  linesPerLevel: 10,
  initialSpeed: 1000,
  speedFactor: 0.85
};

/**
 * Calculate current level
 * @requires linesCleared >= 0
 * @ensures result >= config.initialLevel
 */
export function calculateLevel(
  linesCleared: number,
  config: LevelConfig = DEFAULT_LEVEL_CONFIG
): number {
  return config.initialLevel + Math.floor(linesCleared / config.linesPerLevel);
}

/**
 * Calculate speed based on level
 * @requires level >= 1
 * @ensures result > 0
 */
export function calculateSpeed(
  level: number,
  config: LevelConfig = DEFAULT_LEVEL_CONFIG
): number {
  return config.initialSpeed * Math.pow(config.speedFactor, level - 1);
}
