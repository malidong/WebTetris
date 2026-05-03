// src/storage/LocalStorage.ts
// Local storage wrapper with security fixes

/** Storage key prefix */
const STORAGE_PREFIX = 'tetris_';

/**
 * Safely parse JSON (prevent prototype pollution)
 */
function safeJsonParse(jsonString: string): any {
  if (typeof jsonString !== 'string') {
    throw new Error('JSON string must be a string');
  }
  
  const parsed = JSON.parse(jsonString);
  
  // Create object with no prototype
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    const sanitized = Object.create(null);
    for (const key of Object.keys(parsed)) {
      if (key !== '__proto__' && key !== 'constructor' && !key.startsWith('__')) {
        sanitized[key] = sanitizeObject(parsed[key]);
      }
    }
    return sanitized;
  }
  
  return sanitizeObject(parsed);
}

/**
 * Recursively sanitize object (prevent prototype pollution)
 */
function sanitizeObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  if (obj && typeof obj === 'object') {
    const sanitized = Object.create(null);
    for (const key of Object.keys(obj)) {
      if (key !== '__proto__' && key !== 'constructor' && !key.startsWith('__')) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
}

/**
 * Validate storage key
 */
function validateKey(key: string): string {
  if (typeof key !== 'string' || key.length === 0 || key.length > 50) {
    throw new Error('Invalid storage key');
  }
  return STORAGE_PREFIX + key.replace(/[^a-zA-Z0-9_]/g, '');
}

/**
 * Save data to localStorage
 */
export function saveToStorage<T>(key: string, value: T): void {
  const safeKey = validateKey(key);
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(safeKey, serialized);
  } catch (e) {
    console.error('Failed to save to storage:', e);
  }
}

/**
 * Load data from localStorage (safe)
 */
export function loadFromStorage<T>(key: string): T | null {
  const safeKey = validateKey(key);
  try {
    const data = localStorage.getItem(safeKey);
    if (!data) return null;
    
    const parsed = safeJsonParse(data);
    return parsed as T;
  } catch (e) {
    console.error('Failed to load from storage:', e);
    return null;
  }
}
