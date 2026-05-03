import { createRandomPiece, rotatePiece, movePiece } from './Piece.js';
import { BoardConfig } from '../types/index.js';

const config: BoardConfig = { width: 10, height: 20, cellSize: 30 };

// Test createRandomPiece
console.log('Test: createRandomPiece creates valid piece');
const piece = createRandomPiece(config);
console.log(piece.type && piece.x >= 0 && piece.y === 0 ? 'PASS' : 'FAIL');

// Test rotatePiece
console.log('Test: rotatePiece changes rotation');
const rotated = rotatePiece(piece);
console.log(rotated.rotation === (piece.rotation + 1) % 4 ? 'PASS' : 'FAIL');

// Test movePiece
console.log('Test: movePiece moves correctly');
const moved = movePiece(piece, 2, 3);
console.log(moved.x === piece.x + 2 && moved.y === piece.y + 3 ? 'PASS' : 'FAIL');