import { createBoard, lockPiece, clearLines } from './Board.js';
import { BoardConfig, PieceType } from '../types/index.js';

const config: BoardConfig = { width: 10, height: 20, cellSize: 30 };

// Test createBoard
console.log('Test: createBoard creates 20x10 board');
const board = createBoard(config);
console.log(board.length === 20 && board[0].length === 10 ? 'PASS' : 'FAIL');

// Test lockPiece
console.log('Test: lockPiece adds piece to board');
const testBoard = createBoard(config);
const piece = { type: PieceType.I, shape: [[null,null,null,null],[PieceType.I,PieceType.I,PieceType.I,PieceType.I],[null,null,null,null],[null,null,null,null]], rotation: 0, x: 3, y: 18 };
const newBoard = lockPiece(testBoard, piece);
console.log(newBoard[18][3] !== null ? 'PASS' : 'FAIL');

// Test clearLines
console.log('Test: clearLines clears full row');
const board2 = createBoard(config);
for (let x = 0; x < 10; x++) board2[19][x] = PieceType.I;
const { board: b, clearedLines } = clearLines(board2);
console.log(clearedLines === 1 ? 'PASS' : 'FAIL');