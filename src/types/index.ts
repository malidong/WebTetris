// Type definitions for Tetris game

/** Cell value - null for empty or PieceType for filled */
export type CellValue = PieceType | null;

/** Game board configuration */
export interface BoardConfig {
  readonly width: number;
  readonly height: number;
  readonly cellSize: number;
}

/** Game board state - 2D grid */
export type Board = CellValue[][];

/** Piece type enum */
export enum PieceType {
  I = 'I',
  O = 'O',
  T = 'T',
  S = 'S',
  Z = 'Z',
  J = 'J',
  L = 'L'
}

/** Piece shape definition (4x4 matrix) */
export type PieceShape = readonly (readonly (PieceType | null)[])[];

/** Piece colors */
export const PIECE_COLORS: Record<PieceType, string> = {
  [PieceType.I]: '#00F0F0',
  [PieceType.O]: '#F0F000',
  [PieceType.T]: '#A000F0',
  [PieceType.S]: '#00F000',
  [PieceType.Z]: '#F00000',
  [PieceType.J]: '#0000F0',
  [PieceType.L]: '#F0A000'
};

/** Piece definition */
export interface Piece {
  readonly type: PieceType;
  shape: PieceShape;
  rotation: number;
  x: number;
  y: number;
}

/** Game status enum */
export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  GAME_OVER = 'GAME_OVER'
}

/** Game state */
export interface GameState {
  board: Board;
  currentPiece: Piece | null;
  nextPiece: Piece | null;
  score: number;
  level: number;
  lines: number;
  status: GameStatus;
  startTime: number | null;
  pausedTime: number | null;
}

/** Input action enum */
export enum InputAction {
  MOVE_LEFT = 'MOVE_LEFT',
  MOVE_RIGHT = 'MOVE_RIGHT',
  MOVE_DOWN = 'MOVE_DOWN',
  HARD_DROP = 'HARD_DROP',
  ROTATE_CW = 'ROTATE_CW',
  ROTATE_CCW = 'ROTATE_CCW',
  PAUSE = 'PAUSE',
  RESTART = 'RESTART'
}

/** Input event */
export interface InputEvent {
  action: InputAction;
  timestamp: number;
  repeat: boolean;
}

/** Keyboard mapping */
export interface KeyboardMapping {
  [key: string]: InputAction;
}

/** Renderer config */
export interface RendererConfig {
  canvas: HTMLCanvasElement | string;
  boardConfig: BoardConfig;
  colors: {
    background: string;
    grid: string;
    ghost: string;
  };
}

/** Render context */
export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

/** Score event type */
export enum ScoreEventType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
  TETRIS = 'TETRIS',
  SOFT_DROP = 'SOFT_DROP',
  HARD_DROP = 'HARD_DROP'
}

/** Level config */
export interface LevelConfig {
  initialLevel: number;
  linesPerLevel: number;
  initialSpeed: number;
  speedFactor: number;
}

/** High score record */
export interface HighScore {
  playerName: string;
  score: number;
  level: number;
  lines: number;
  date: string;
}
