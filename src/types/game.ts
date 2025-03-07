export interface Position {
  x: number;
  y: number;
}

export interface Entity extends Position {
  width: number;
  height: number;
}

export interface Player extends Entity {
  speed: number;
  lives: number;
  targetX: number; // Target position for smooth movement
}

export interface Enemy extends Entity {
  speed: number;
  points: number;
  type: 'easy' | 'medium' | 'hard';
  animationFrame: number;
}

export interface Bullet extends Entity {
  speed: number;
  direction: 'up' | 'down';
}

export interface Explosion extends Position {
  size: number;
  frame: number;
  maxFrames: number;
}

export interface Star extends Position {
  size: number;
  brightness: number;
  speed: number;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  explosions: Explosion[];
  stars: Star[];
  score: number;
  level: number;
  gameOver: boolean;
  paused: boolean;
  mousePosition: Position;
  lastShootTime: number;
}
