import { useCallback } from 'react';
import { GameState, Enemy, Bullet, Player, Explosion, Star } from '../types/game';

export const useGameRenderer = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const render = useCallback((gameState: GameState) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render stars (background)
    renderStars(ctx, gameState.stars);
    
    // Render player
    renderPlayer(ctx, gameState.player);
    
    // Render enemies
    gameState.enemies.forEach(enemy => renderEnemy(ctx, enemy));
    
    // Render bullets
    gameState.playerBullets.forEach(bullet => renderBullet(ctx, bullet, '#60a5fa'));
    gameState.enemyBullets.forEach(bullet => renderBullet(ctx, bullet, '#f87171'));
    
    // Render explosions
    gameState.explosions.forEach(explosion => renderExplosion(ctx, explosion));
    
    // Render targeting line
    renderTargetingLine(ctx, gameState);
    
    // Render UI
    renderUI(ctx, gameState, canvas.width);
  }, [canvasRef]);
  
  return { render };
};

// Helper rendering functions
function renderPlayer(ctx: CanvasRenderingContext2D, player: Player) {
  // Draw ship glow effect
  const gradient = ctx.createRadialGradient(
    player.x + player.width / 2, player.y + player.height / 2, 5,
    player.x + player.width / 2, player.y + player.height / 2, 40
  );
  gradient.addColorStop(0, 'rgba(74, 222, 128, 0.3)');
  gradient.addColorStop(1, 'rgba(74, 222, 128, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 40, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw the ship body
  ctx.fillStyle = '#4ade80'; // Green color
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.closePath();
  ctx.fill();
  
  // Draw ship details
  ctx.fillStyle = '#60a5fa'; // Blue
  ctx.beginPath();
  ctx.arc(player.x + player.width / 2, player.y + player.height / 2, 8, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw engine flames
  ctx.fillStyle = '#f59e0b'; // Amber
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 3, player.y + player.height);
  ctx.lineTo(player.x + player.width / 2, player.y + player.height + 10 + Math.random() * 5);
  ctx.lineTo(player.x + (player.width * 2) / 3, player.y + player.height);
  ctx.closePath();
  ctx.fill();
}

function renderEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  // Different colors based on enemy type
  let primaryColor, secondaryColor, glowColor;
  
  if (enemy.type === 'easy') {
    primaryColor = '#f87171'; // Red
    secondaryColor = '#991b1b';
    glowColor = 'rgba(248, 113, 113, 0.3)';
  } else if (enemy.type === 'medium') {
    primaryColor = '#fb923c'; // Orange
    secondaryColor = '#9a3412';
    glowColor = 'rgba(251, 146, 60, 0.3)';
  } else {
    primaryColor = '#facc15'; // Yellow
    secondaryColor = '#a16207';
    glowColor = 'rgba(250, 204, 21, 0.3)';
  }
  
  // Pulsating animation
  const pulse = Math.sin(enemy.animationFrame * 0.2) * 0.1 + 0.9;
  const size = enemy.width * pulse;
  
  // Draw enemy glow
  const gradient = ctx.createRadialGradient(
    enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 5,
    enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 30
  );
  gradient.addColorStop(0, glowColor);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 30, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw enemy body
  ctx.fillStyle = primaryColor;
  
  // Draw alien shape
  ctx.beginPath();
  ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw tentacles
  ctx.fillStyle = secondaryColor;
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI + (enemy.animationFrame * 0.05);
    const tentacleX = enemy.x + enemy.width / 2 + Math.cos(angle) * (size / 2);
    const tentacleY = enemy.y + enemy.height / 2 + Math.sin(angle) * (size / 2);
    
    ctx.beginPath();
    ctx.arc(tentacleX, tentacleY, size / 6, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw eyes
  ctx.fillStyle = '#1e293b';
  const eyeOffset = size / 6;
  ctx.beginPath();
  ctx.arc(enemy.x + enemy.width / 2 - eyeOffset, enemy.y + enemy.height / 2 - eyeOffset, size / 8, 0, Math.PI * 2);
  ctx.arc(enemy.x + enemy.width / 2 + eyeOffset, enemy.y + enemy.height / 2 - eyeOffset, size / 8, 0, Math.PI * 2);
  ctx.fill();
}

function renderBullet(ctx: CanvasRenderingContext2D, bullet: Bullet, color: string) {
  // Draw bullet glow
  const gradient = ctx.createRadialGradient(
    bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, 1,
    bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, 10
  );
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(bullet.x + bullet.width / 2, bullet.y + bullet.height / 2, 10, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw bullet core
  ctx.fillStyle = color;
  ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  
  // Draw bullet trail
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(bullet.x + bullet.width / 2, bullet.y + (bullet.direction === 'up' ? bullet.height : 0), bullet.width / 2, 0, Math.PI * 2);
  ctx.fill();
}

function renderExplosion(ctx: CanvasRenderingContext2D, explosion: Explosion) {
  const progress = explosion.frame / explosion.maxFrames;
  const radius = explosion.size * (1 - progress);
  const alpha = 1 - progress;
  
  // Outer glow
  const gradient = ctx.createRadialGradient(
    explosion.x, explosion.y, 0,
    explosion.x, explosion.y, radius * 1.5
  );
  gradient.addColorStop(0, `rgba(255, 165, 0, ${alpha})`);
  gradient.addColorStop(0.5, `rgba(255, 69, 0, ${alpha * 0.8})`);
  gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(explosion.x, explosion.y, radius * 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Inner explosion
  const innerGradient = ctx.createRadialGradient(
    explosion.x, explosion.y, 0,
    explosion.x, explosion.y, radius
  );
  innerGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
  innerGradient.addColorStop(0.4, `rgba(255, 255, 0, ${alpha})`);
  innerGradient.addColorStop(1, `rgba(255, 69, 0, 0)`);
  
  ctx.fillStyle = innerGradient;
  ctx.beginPath();
  ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Particles
  const particleCount = Math.floor(explosion.size / 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = radius * (0.3 + Math.random() * 0.7);
    const particleX = explosion.x + Math.cos(angle) * distance;
    const particleY = explosion.y + Math.sin(angle) * distance;
    const particleSize = 1 + Math.random() * 2;
    
    ctx.fillStyle = `rgba(255, ${Math.floor(Math.random() * 200)}, 0, ${alpha})`;
    ctx.beginPath();
    ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
    ctx.fill();
  }
}

function renderStars(ctx: CanvasRenderingContext2D, stars: Star[]) {
  stars.forEach(star => {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function renderTargetingLine(ctx: CanvasRenderingContext2D, gameState: GameState) {
  if (gameState.gameOver || gameState.paused) return;
  
  const player = gameState.player;
  const mouse = gameState.mousePosition;
  
  // Draw targeting line
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.3)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
  ctx.setLineDash([]);
  
  // Draw targeting reticle
  ctx.strokeStyle = 'rgba(96, 165, 250, 0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 10, 0, Math.PI * 2);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(mouse.x - 15, mouse.y);
  ctx.lineTo(mouse.x - 5, mouse.y);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(mouse.x + 5, mouse.y);
  ctx.lineTo(mouse.x + 15, mouse.y);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y - 15);
  ctx.lineTo(mouse.x, mouse.y - 5);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y + 5);
  ctx.lineTo(mouse.x, mouse.y + 15);
  ctx.stroke();
}

function renderUI(ctx: CanvasRenderingContext2D, gameState: GameState, canvasWidth: number) {
  // Render lives
  ctx.fillStyle = '#4ade80';
  for (let i = 0; i < gameState.player.lives; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 25, 30);
    ctx.lineTo(30 + i * 25, 15);
    ctx.lineTo(40 + i * 25, 30);
    ctx.closePath();
    ctx.fill();
  }
  
  // Render level indicator
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'right';
  ctx.fillText(`LEVEL ${gameState.level}`, canvasWidth - 20, 30);
  
  // Render score
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`SCORE: ${gameState.score}`, canvasWidth / 2, 30);
}
