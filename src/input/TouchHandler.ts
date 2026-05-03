// src/input/TouchHandler.ts
// Touch input handling

import { InputAction, InputEvent } from '../types/index.js';

/** Touch zone configuration */
export interface TouchZoneConfig {
  leftZone: number;    // Left zone percentage (0-100)
  rightZone: number;   // Right zone percentage (0-100)
  rotateZone: number;   // Top zone percentage for rotation (0-100)
}

/** Default touch zones */
export const DEFAULT_TOUCH_ZONES: TouchZoneConfig = {
  leftZone: 25,
  rightZone: 25,
  rotateZone: 30
};

/**
 * Initialize touch handler
 * @returns cleanup function to remove event listeners
 * @side-effects adds touchstart, touchmove, touchend listeners
 */
export function initTouchHandler(
  canvas: HTMLCanvasElement,
  config: TouchZoneConfig = DEFAULT_TOUCH_ZONES,
  callback: (event: InputEvent) => void
): () => void {
  let touchStartY: number = 0;
  
  const handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    touchStartY = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    
    let action: InputAction | null = null;
    
    if (percentX < config.leftZone) {
      action = InputAction.MOVE_LEFT;
    } else if (percentX > (100 - config.rightZone)) {
      action = InputAction.MOVE_RIGHT;
    } else if (percentY < config.rotateZone) {
      action = InputAction.ROTATE_CW;
    } else {
      action = InputAction.MOVE_DOWN;
    }
    
    if (action) {
      callback({
        action,
        timestamp: Date.now(),
        repeat: false
      });
    }
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const deltaY = touch.clientY - touchStartY;
    
    // Swipe down > 50px = hard drop
    if (deltaY > 50) {
      callback({
        action: InputAction.HARD_DROP,
        timestamp: Date.now(),
        repeat: false
      });
    }
  };
  
  canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
  canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  return () => {
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
  };
}
