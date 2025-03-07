import { useState, useCallback } from 'react';
import { GameState, Enemy, Bullet, Explosion, Star } from '../types/game';

export const useGameState = (width: number, height: number) => {
  const [state, setState] = useState<GameState>(() => createInitialState(width, height));

  const resetGame = useCallback(() => {
    setState(createInitialState(width, height));
  }, [width, height]);

  const movePlayer = useCallback((direction: 'left' | 'right') => {
    setState(prevState => {
      if (prevState.gameOver || prevState.paused) return prevState;
      
      const player = { ...prevState.player };
      const moveAmount = direction === 'left' ? -player.speed : player.speed;
      
      player.x = Math.max(0, Math.min(width - player.width, player.x + moveAmount));
      
      return { ...prevState, player };
    });
  }, [width]);

  const setPlayerTarget = useCallback((targetX: number) => {
    setState(prevState => {
      if (prevState.gameOver || prevState.paused) return prevState;
      
      const player = { ...prevState.player };
      // Ensure target is within bounds
      player.targetX = Math.max(player.width / 2, Math.min(width - player.width / 2, targetX));
      
      return { ...prevState, player };
    });
  }, [width]);

  const updateMousePosition = useCallback((x: number, y: number) => {
    setState(prevState => ({
      ...prevState,
      mousePosition: { x, y }
    }));
  }, []);

  const shootBullet = useCallback(() => {
    setState(prevState => {
      if (prevState.gameOver || prevState.paused) return prevState;
      
      // Limit shooting rate (300ms cooldown)
      const now = Date.now();
      if (now - prevState.lastShootTime < 300) return prevState;
      
      // Calculate bullet direction based on mouse position
      const startX = prevState.player.x + prevState.player.width / 2;
      const startY = prevState.player.y;
      
      // Create bullet at player position
      const newBullet: Bullet = {
        x: startX - 2, // Center the bullet
        y: startY - 10,
        width: 4,
        height: 12,
        speed: 5, // Slower bullets for better gameplay
        direction: 'up'
      };
      
      return {
        ...prevState,
        playerBullets: [...prevState.playerBullets, newBullet],
        lastShootTime: now
      };
    });
  }, []);

  const togglePause = useCallback(() => {
    setState(prevState => {
      if (prevState.gameOver) return prevState;
      return { ...prevState, paused: !prevState.paused };
    });
  }, []);

  const updateGameState = useCallback(() => {
    setState(prevState => {
      if (prevState.gameOver || prevState.paused) return prevState;
      
      // Create a new state to modify
      const newState = { ...prevState };
      
      // Move player smoothly towards target
      if (newState.player.targetX !== undefined) {
        const dx = newState.player.targetX - (newState.player.x + newState.player.width / 2);
        if (Math.abs(dx) > 1) {
          newState.player = {
            ...newState.player,
            x: newState.player.x + (dx * 0.1) // Smooth movement
          };
        }
      }
      
      // Move bullets
      newState.playerBullets = moveBullets(prevState.playerBullets, 'up');
      newState.enemyBullets = moveBullets(prevState.enemyBullets, 'down');
      
      // Move enemies
      newState.enemies = moveEnemies(prevState.enemies, width);
      
      // Update enemy animation frames
      newState.enemies = newState.enemies.map(enemy => ({
        ...enemy,
        animationFrame: (enemy.animationFrame + 1) % 30 // 30 frames per animation cycle
      }));
      
      // Enemy shooting logic
      if (Math.random() < 0.02 * (1 + prevState.level * 0.1) && prevState.enemies.length > 0) {
        const randomEnemy = prevState.enemies[Math.floor(Math.random() * prevState.enemies.length)];
        const newBullet: Bullet = {
          x: randomEnemy.x + randomEnemy.width / 2 - 2,
          y: randomEnemy.y + randomEnemy.height,
          width: 4,
          height: 12,
          speed: 3, // Slower enemy bullets
          direction: 'down'
        };
        newState.enemyBullets = [...newState.enemyBullets, newBullet];
      }
      
      // Update explosions
      newState.explosions = newState.explosions
        .map(explosion => ({
          ...explosion,
          frame: explosion.frame + 1
        }))
        .filter(explosion => explosion.frame < explosion.maxFrames);
      
      // Update stars
      newState.stars = updateStars(newState.stars, height);
      
      // Check collisions
      const collisionResult = checkCollisions(newState, height, width);
      
      // If all enemies are destroyed, level up
      if (collisionResult.enemies.length === 0) {
        return levelUp(collisionResult, width);
      }
      
      return collisionResult;
    });
  }, [width, height]);

  return {
    ...state,
    movePlayer,
    setPlayerTarget,
    updateMousePosition,
    shootBullet,
    togglePause,
    updateGameState,
    resetGame
  };
};

// Helper functions
function createInitialState(width: number, height: number): GameState {
  return {
    player: {
      x: width / 2 - 25,
      y: height - 60,
      width: 50,
      height: 40,
      speed: 5,
      lives: 5, // 5 lives as requested
      targetX: width / 2
    },
    enemies: createEnemies(width),
    playerBullets: [],
    enemyBullets: [],
    explosions: [],
    stars: createStars(width, height, 100),
    score: 0,
    level: 1,
    gameOver: false,
    paused: false,
    mousePosition: { x: width / 2, y: height / 2 },
    lastShootTime: 0
  };
}

function createEnemies(width: number): Enemy[] {
  const enemies: Enemy[] = [];
  const rows = 4;
  const enemiesPerRow = 8;
  const enemyWidth = 40;
  const enemyHeight = 30;
  const padding = (width - (enemiesPerRow * enemyWidth)) / (enemiesPerRow + 1);
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < enemiesPerRow; col++) {
      const type = row === 0 ? 'hard' : row === 1 ? 'medium' : 'easy';
      const points = type === 'hard' ? 30 : type === 'medium' ? 20 : 10;
      
      enemies.push({
        x: padding + col * (enemyWidth + padding),
        y: 50 + row * (enemyHeight + 20),
        width: enemyWidth,
        height: enemyHeight,
        speed: 1 + (row * 0.1),
        points,
        type,
        animationFrame: Math.floor(Math.random() * 30) // Randomize initial animation frame
      });
    }
  }
  
  return enemies;
}

function createStars(width: number, height: number, count: number): Star[] {
  const stars: Star[] = [];
  
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.5 + Math.random() * 2,
      brightness: 0.3 + Math.random() * 0.7,
      speed: 0.2 + Math.random() * 0.8
    });
  }
  
  return stars;
}

function updateStars(stars: Star[], height: number): Star[] {
  return stars.map(star => {
    const newY = star.y + star.speed;
    return {
      ...star,
      y: newY > height ? 0 : newY,
      brightness: 0.3 + Math.random() * 0.7 // Twinkle effect
    };
  });
}

function moveBullets(bullets: Bullet[], direction: 'up' | 'down'): Bullet[] {
  return bullets
    .map(bullet => ({
      ...bullet,
      y: direction === 'up' ? bullet.y - bullet.speed : bullet.y + bullet.speed
    }))
    .filter(bullet => bullet.y > -bullet.height && bullet.y < 600);
}

function moveEnemies(enemies: Enemy[], width: number): Enemy[] {
  // Determine if any enemy is at the edge
  const leftMost = Math.min(...enemies.map(e => e.x));
  const rightMost = Math.max(...enemies.map(e => e.x + e.width));
  
  let shouldMoveDown = false;
  let directionMultiplier = 1;
  
  if (leftMost <= 0) {
    shouldMoveDown = true;
    directionMultiplier = 1;
  } else if (rightMost >= width) {
    shouldMoveDown = true;
    directionMultiplier = -1;
  } else {
    // Continue in the same direction
    directionMultiplier = enemies.length > 0 ? 
      (enemies[0].speed > 0 ? 1 : -1) : 1;
  }
  
  return enemies.map(enemy => ({
    ...enemy,
    x: enemy.x + (Math.abs(enemy.speed) * directionMultiplier),
    y: shouldMoveDown ? enemy.y + 15 : enemy.y,
    speed: Math.abs(enemy.speed) * (shouldMoveDown ? directionMultiplier : (enemy.speed > 0 ? 1 : -1))
  }));
}

function createExplosion(x: number, y: number, size: number): Explosion {
  return {
    x,
    y,
    size,
    frame: 0,
    maxFrames: 12
  };
}

function checkCollisions(state: GameState, height: number, width: number): GameState {
  const newState = { ...state };
  
  // Check player bullets hitting enemies
  const hitResults = checkBulletEnemyCollisions(newState.playerBullets, newState.enemies);
  newState.playerBullets = hitResults.remainingBullets;
  newState.enemies = hitResults.remainingEnemies;
  newState.score += hitResults.scoreIncrease;
  
  // Add explosions for destroyed enemies
  newState.explosions = [
    ...newState.explosions,
    ...hitResults.newExplosions
  ];
  
  // Check enemy bullets hitting player
  const playerHitBullets = newState.enemyBullets.filter(bullet => 
    checkCollision(bullet, newState.player)
  );
  
  if (playerHitBullets.length > 0) {
    newState.player.lives--;
    
    // Add explosion at player position
    if (newState.player.lives > 0) {
      newState.explosions.push(createExplosion(
        newState.player.x + newState.player.width / 2,
        newState.player.y + newState.player.height / 2,
        30
      ));
    } else {
      // Bigger explosion for game over
      newState.explosions.push(createExplosion(
        newState.player.x + newState.player.width / 2,
        newState.player.y + newState.player.height / 2,
        50
      ));
      newState.gameOver = true;
    }
    
    // Remove bullets that hit the player
    newState.enemyBullets = newState.enemyBullets.filter(bullet => 
      !playerHitBullets.includes(bullet)
    );
  }
  
  // Check if enemies reached the bottom
  const enemyReachedBottom = newState.enemies.some(enemy => 
    enemy.y + enemy.height >= newState.player.y
  );
  
  if (enemyReachedBottom) {
    newState.gameOver = true;
    
    // Add explosions for game over
    for (let i = 0; i < 10; i++) {
      newState.explosions.push(createExplosion(
        Math.random() * width,
        Math.random() * height,
        30 + Math.random() * 30
      ));
    }
  }
  
  return newState;
}

function checkBulletEnemyCollisions(bullets: Bullet[], enemies: Enemy[]) {
  let remainingBullets = [...bullets];
  let remainingEnemies = [...enemies];
  let scoreIncrease = 0;
  const newExplosions: Explosion[] = [];
  
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    let bulletHit = false;
    
    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];
      
      if (checkCollision(bullet, enemy)) {
        // Create explosion at enemy position
        newExplosions.push(createExplosion(
          enemy.x + enemy.width / 2,
          enemy.y + enemy.height / 2,
          enemy.type === 'hard' ? 40 : enemy.type === 'medium' ? 30 : 20
        ));
        
        // Remove this enemy and bullet
        remainingEnemies = remainingEnemies.filter(e => e !== enemy);
        bulletHit = true;
        scoreIncrease += enemy.points;
        break;
      }
    }
    
    if (bulletHit) {
      remainingBullets = remainingBullets.filter(b => b !== bullet);
    }
  }
  
  return { 
    remainingBullets, 
    remainingEnemies, 
    scoreIncrease,
    newExplosions
  };
}

function checkCollision(a: { x: number, y: number, width: number, height: number }, 
                        b: { x: number, y: number, width: number, height: number }) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function levelUp(state: GameState, width: number): GameState {
  // Add level-up explosions
  const levelUpExplosions: Explosion[] = [];
  for (let i = 0; i < 15; i++) {
    levelUpExplosions.push(createExplosion(
      Math.random() * width,
      100 + Math.random() * 200,
      20 + Math.random() * 30
    ));
  }
  
  return {
    ...state,
    level: state.level + 1,
    enemies: createEnemies(width).map(enemy => ({
      ...enemy,
      speed: enemy.speed * (1 + state.level * 0.1)
    })),
    player: {
      ...state.player,
      // Give an extra life every 2 levels, up to max 5
      lives: Math.min(5, state.player.lives + (state.level % 2 === 0 ? 1 : 0))
    },
    explosions: [
      ...state.explosions,
      ...levelUpExplosions
    ]
  };
}
