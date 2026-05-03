// src/scoring/HighScoreManager.ts
// High score management with security fixes

import { HighScore } from '../types/index.js';

const HIGH_SCORES_KEY = 'tetris_high_scores';
const MAX_HIGH_SCORES = 10;

/** Player name validation regex (whitelist) */
const PLAYER_NAME_REGEX = /^[a-zA-Z0-9_\-\s]{1,20}$/;

/**
 * Validate player name (whitelist validation)
 * @throws Error if invalid
 */
function validatePlayerName(name: string): string {
  if (typeof name !== 'string') {
    throw new Error('Player name must be a string');
  }
  if (name.length === 0 || name.length > 20) {
    throw new Error('Player name must be 1-20 characters');
  }
  if (!PLAYER_NAME_REGEX.test(name)) {
    throw new Error('Player name contains invalid characters');
  }
  return name;
}

/**
 * Validate number range
 */
function validateNumber(value: any, min: number, max: number, fieldName: string): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  if (value < min || value > max) {
    throw new Error(`${fieldName} must be between ${min} and ${max}`);
  }
  return value;
}

/**
 * Load high scores from localStorage
 * @returns HighScore array, empty if none
 */
export function loadHighScores(): HighScore[] {
  try {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      console.warn('Invalid high scores data, resetting');
      localStorage.removeItem(HIGH_SCORES_KEY);
      return [];
    }
    
    // Validate each entry
    return parsed.filter((item: any): item is HighScore => {
      try {
        validatePlayerName(item.playerName);
        validateNumber(item.score, 0, 9999999, 'score');
        validateNumber(item.level, 1, 20, 'level');
        validateNumber(item.lines, 0, 999999, 'lines');
        return typeof item.date === 'string';
      } catch {
        return false;
      }
    }).sort((a, b) => b.score - a.score).slice(0, MAX_HIGH_SCORES);
  } catch (e) {
    console.error('Failed to load high scores:', e);
    return [];
  }
}

/**
 * Save new high score
 * @returns true if in top scores
 */
export function saveHighScore(score: HighScore): boolean {
  // Validate input
  validatePlayerName(score.playerName);
  validateNumber(score.score, 0, 9999999, 'score');
  validateNumber(score.level, 1, 20, 'level');
  validateNumber(score.lines, 0, 999999, 'lines');
  
  // Sanitize name (defensive copy)
  const sanitizedName = score.playerName.replace(/[<>\"'&]/g, '');
  
  const highScores = loadHighScores();
  
  const newScore: HighScore = {
    ...score,
    playerName: sanitizedName,
    date: new Date().toISOString().split('T')[0]
  };
  
  highScores.push(newScore);
  highScores.sort((a, b) => b.score - a.score);
  
  const isInTop = highScores.slice(0, MAX_HIGH_SCORES).some(s => s === newScore);
  
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(highScores.slice(0, MAX_HIGH_SCORES)));
  
  return isInTop;
}

/**
 * Escape HTML special characters
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;',
    '"': '&quot;', "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
