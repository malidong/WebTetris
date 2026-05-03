// src/storage/GameSave.ts
// Game save/load functionality

import { GameState, Board, Piece } from '../types/index.js';
import { saveToStorage, loadFromStorage } from './LocalStorage.js';

const STORAGE_PREFIX = 'tetris_';

const SAVE_KEY = 'saved_game';

export interface SerializableGameSave {
  board: (string | null)[][];
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  score: number;
  level: number;
  lines: number;
  savedAt: number;
}

/**
 * Save game state
 * @returns true if successful
 */
export function saveGame(state: GameState): boolean {
  try {
    const saveData: SerializableGameSave = {
      board: state.board as (string | null)[][],
      currentPiece: state.currentPiece,
      nextPiece: state.nextPiece,
      score: state.score,
      level: state.level,
      lines: state.lines,
      savedAt: Date.now()
    };
    
    saveToStorage<SerializableGameSave>(SAVE_KEY, saveData);
    return true;
  } catch (e) {
    console.error('Failed to save game:', e);
    return false;
  }
}

/**
 * Load saved game
 * @returns saved game data or null
 */
export function loadGame(): SerializableGameSave | null {
  const data = loadFromStorage<SerializableGameSave>(SAVE_KEY);
  
  if (!data) return null;  
  // Validate structure
  if (
    !Array.isArray(data.board) ||
    typeof data.score !== 'number' ||
    typeof data.level !== 'number' ||
    typeof data.lines !== 'number'
  ) {
    console.warn('Invalid saved game data');
    return null;
  }
    
  return data;
}

/**
 * Clear saved game
 */
export function clearSavedGame(): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + SAVE_KEY);
  } catch (e) {
    console.error('Failed to clear saved game:', e);
  }
}
