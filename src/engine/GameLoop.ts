// src/engine/GameLoop.ts
// Game main loop

/**
 * Game loop configuration
 */
export interface GameLoopConfig {
  fps: number;
  initialSpeed: number; // ms per frame
}

/** Default config */
const DEFAULT_CONFIG: GameLoopConfig = {
  fps: 60,
  initialSpeed: 1000
};

/**
 * Game loop class
 */
export class GameLoop {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private running: boolean = false;
  private rafId: number | null = null;
  private speed: number;
  
  /**
   * Create game loop
   * @requires updateCallback and renderCallback are valid functions
   */
  constructor(
    private updateCallback: () => void,
    private renderCallback: () => void,
    private config: GameLoopConfig = DEFAULT_CONFIG
  ) {
    this.speed = config.initialSpeed;
  }
  
  /**
   * Start game loop
   * @side-effects starts requestAnimationFrame loop
   */
  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }
  
  /**
   * Stop game loop
   * @side-effects cancels requestAnimationFrame
   */
  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
  
  /**
   * Pause game loop
   */
  pause(): void {
    this.running = false;
  }
  
  /**
   * Resume game loop
   */
  resume(): void {
    if (!this.running) {
      this.running = true;
      this.lastTime = performance.now();
      this.loop();
    }
  }
  
  /**
   * Set game speed
   * @requires speed > 0
   */
  setSpeed(speed: number): void {
    if (speed > 0) {
      this.speed = speed;
    }
  }
  
  /**
   * Main loop logic
   */
  private loop(): void {
    if (!this.running) return;
    
    const now = performance.now();
    const deltaTime = now - this.lastTime;
    this.lastTime = now;
    
    this.accumulator += deltaTime;
    
    // Fixed timestep updates
    while (this.accumulator >= this.speed) {
      this.updateCallback();
      this.accumulator -= this.speed;
    }
    
    // Render
    this.renderCallback();
    
    this.rafId = requestAnimationFrame(() => this.loop());
  }
}
