import { checkCollision, getGhostPosition } from './CollisionDetector.js';
import { createBoard } from './Board.js';
import { createRandomPiece } from './Piece.js';
import { BoardConfig, PieceType } from '../types/index.js';

const config: BoardConfig = { width: 10, height: 20, cellSize: 30 };

// Test checkCollision left boundary
console.log('Test: checkCollision detects left boundary');
const board = createBoard(config);
const piece = { type: PieceType.I, shape: [[null,null,null,null],[PieceType.I,PieceType.I,PieceType.I,PieceType.I],[null,null,null,null],[null,null,null,null]], rotation: 0, x: -1, y: 10 };
console.log(checkCollision(board, piece, piece.x, piece.y) === true ? 'PASS' : 'FAIL');

// Test getGhostPosition
console.log('Test: getGhostPosition returns valid position');
const piece2 = createRandomPiece(config);
piece2.x = 5; piece2.y = 0;
const ghostY = getGhostPosition(board, piece2);
console.log(ghostY >= piece2.y ? 'PASS' : 'FAIL');