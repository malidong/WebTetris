// src/input/KeyboardHandler.ts
// Keyboard input handling

import { InputAction, InputEvent, KeyboardMapping } from '../types/index.js';

/** Default keyboard mapping */
export const DEFAULT_KEYBOARD_MAPPING: KeyboardMapping = {
  'ArrowLeft': InputAction.MOVE_LEFT,
  'ArrowRight': InputAction.MOVE_RIGHT,
  'ArrowDown': InputAction.MOVE_DOWN,
  'ArrowUp': InputAction.ROTATE_CW,
  'KeyZ': InputAction.ROTATE_CCW,
  'Space': InputAction.HARD_DROP,
  'KeyP': InputAction.PAUSE,
  'KeyR': InputAction.RESTART,
  'Enter': InputAction.RESTART
};

/**
 * Validate KeyboardEvent object
 * @returns validated event data or null if invalid
 */
function validateKeyboardEvent(e: any): { code: string; repeat: boolean } | null {
  if (!e || typeof e !== 'object') {
    console.warn('Invalid keyboard event: event object is null or not an object');
    return null;
  }
  
  if (typeof e.code !== 'string') {
    console.warn('Invalid keyboard event: e.code is not a string');
    return null;
  }
  
  if (e.code.length === 0) {
    console.warn('Invalid keyboard event: e.code is empty');
    return null;
  }
  
  const repeat = typeof e.repeat === 'boolean' ? e.repeat : false;
  return { code: e.code, repeat };
}

/**
 * Initialize keyboard handler
 * @returns cleanup function to remove event listener
 * @side-effects adds keydown event listener to document
 */
export function initKeyboardHandler(
  mapping: KeyboardMapping = DEFAULT_KEYBOARD_MAPPING,
  callback: (event: InputEvent) => void
): () => void {
  const handler = (e: KeyboardEvent) => {
    const validated = validateKeyboardEvent(e);
    if (!validated) return;
    
    const action = mapping[validated.code];
    if (action) {
      e.preventDefault();
      
      callback({
        action,
        timestamp: Date.now(),
        repeat: validated.repeat
      });
    }
  };
  
  document.addEventListener('keydown', handler);
  
  return () => {
    document.removeEventListener('keydown', handler);
  };
}
