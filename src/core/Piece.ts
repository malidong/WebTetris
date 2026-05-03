// src/core/Piece.ts
// Piece shape, rotation, position management

import { PieceType, PieceShape, Piece, BoardConfig, Board } from '../types/index.js';
import { checkCollision } from './CollisionDetector.js';

/** Piece shapes for each type (4 rotation states) */
export const PIECE_SHAPES: Record<PieceType, PieceShape[]> = {
  [PieceType.I]: [
    [[null, null, null, null], [PieceType.I, PieceType.I, PieceType.I, PieceType.I], [null, null, null, null], [null, null, null, null]],
    [[null, PieceType.I, null, null], [null, PieceType.I, null, null], [null, PieceType.I, null, null], [null, PieceType.I, null, null]],
    [[null, null, null, null], [null, null, null, null], [PieceType.I, PieceType.I, PieceType.I, PieceType.I], [null, null, null, null]],
    [[null, null, PieceType.I, null], [null, null, PieceType.I, null], [null, null, PieceType.I, null], [null, null, PieceType.I, null]]
  ],
  [PieceType.O]: [
    [[PieceType.O, PieceType.O], [PieceType.O, PieceType.O]]
  ],
  [PieceType.T]: [
    [[null, PieceType.T, null], [PieceType.T, PieceType.T, PieceType.T], [null, null, null]],
    [[null, PieceType.T, null], [null, PieceType.T, PieceType.T], [null, PieceType.T, null]],
    [[null, null, null], [PieceType.T, PieceType.T, PieceType.T], [null, PieceType.T, null]],
    [[null, PieceType.T, null], [PieceType.T, PieceType.T, null], [null, PieceType.T, null]]
  ],
  [PieceType.S]: [
    [[null, PieceType.S, PieceType.S], [PieceType.S, PieceType.S, null], [null, null, null]],
    [[null, PieceType.S, null], [null, PieceType.S, PieceType.S], [null, null, PieceType.S]],
    [[null, null, null], [null, PieceType.S, PieceType.S], [PieceType.S, PieceType.S, null]],
    [[PieceType.S, null, null], [PieceType.S, PieceType.S, null], [null, PieceType.S, null]]
  ],
  [PieceType.Z]: [
    [[PieceType.Z, PieceType.Z, null], [null, PieceType.Z, PieceType.Z], [null, null, null]],
    [[null, null, PieceType.Z], [null, PieceType.Z, PieceType.Z], [null, PieceType.Z, null]],
    [[null, null, null], [PieceType.Z, PieceType.Z, null], [null, PieceType.Z, PieceType.Z]],
    [[null, PieceType.Z, null], [PieceType.Z, PieceType.Z, null], [PieceType.Z, null, null]]
  ],
  [PieceType.J]: [
    [[PieceType.J, null, null], [PieceType.J, PieceType.J, PieceType.J], [null, null, null]],
    [[null, PieceType.J, PieceType.J], [null, PieceType.J, null], [null, PieceType.J, null]],
    [[null, null, null], [PieceType.J, PieceType.J, PieceType.J], [null, null, PieceType.J]],
    [[null, PieceType.J, null], [null, PieceType.J, null], [PieceType.J, PieceType.J, null]]
  ],
  [PieceType.L]: [
    [[null, null, PieceType.L], [PieceType.L, PieceType.L, PieceType.L], [null, null, null]],
    [[null, PieceType.L, null], [null, PieceType.L, null], [null, PieceType.L, PieceType.L]],
    [[null, null, null], [PieceType.L, PieceType.L, PieceType.L], [PieceType.L, null, null]],
    [[PieceType.L, PieceType.L, null], [null, PieceType.L, null], [null, PieceType.L, null]]
  ]
};

/** Create random piece */
export function createRandomPiece(boardConfig: BoardConfig): Piece {
  const types = Object.values(PieceType);
  const randomType = types[Math.floor(Math.random() * types.length)];
  const shapes = PIECE_SHAPES[randomType];
  
  return {
    type: randomType,
    shape: shapes[0],
    rotation: 0,
    x: Math.floor((boardConfig.width - shapes[0][0].length) / 2),
    y: 0
  };
}

/** Rotate piece clockwise */
export function rotatePiece(piece: Piece): Piece {
  const shapes = PIECE_SHAPES[piece.type];
  const newRotation = (piece.rotation + 1) % shapes.length;
  
  return {
    ...piece,
    shape: shapes[newRotation],
    rotation: newRotation
  };
}

/** Move piece to new position */
export function movePiece(piece: Piece, deltaX: number, deltaY: number): Piece {
  return {
    ...piece,
    x: piece.x + deltaX,
    y: piece.y + deltaY
  };
}

/**
 * Rotate piece clockwise with Wall Kick mechanism.
 * Attempts rotation and applies kick offsets if collision detected.
 *
 * @requires board !== null && board.length > 0
 * @requires piece !== null && piece.type && piece.shape
 * @requires piece.rotation is valid index for piece type's shapes array
 * @validates board is 2D array with consistent row lengths
 * @validates piece.x and piece.y are integers within reasonable bounds
 * @validates piece.type is valid PieceType enum value
 * @throws TypeError if board or piece is null/undefined
 * @side-effects None - pure function returning new Piece object
 * @returns New piece with rotation applied and adjusted position, or null if no valid position
 */
export function rotatePieceWithKick(
  board: Board,
  piece: Piece
): Piece | null {
  const shapes = PIECE_SHAPES[piece.type];
  const newRotation = (piece.rotation + 1) % shapes.length;
  const rotatedShape = shapes[newRotation];

  const kickOffsets = [
    { dx: 0, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: -2, dy: 0 },
    { dx: 2, dy: 0 }
  ];

  for (const kick of kickOffsets) {
    const testX = piece.x + kick.dx;
    const testY = piece.y + kick.dy;

    if (!checkCollision(board, { ...piece, shape: rotatedShape, rotation: newRotation }, testX, testY)) {
      return {
        ...piece,
        shape: rotatedShape,
        rotation: newRotation,
        x: testX,
        y: testY
      };
    }
  }

  return null;
}
