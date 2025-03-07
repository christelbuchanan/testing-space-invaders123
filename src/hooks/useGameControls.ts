import { useEffect } from 'react';
import { GameState, Position } from '../types/game';

export const useGameControls = (gameState: GameState & {
  movePlayer: (direction: 'left' | 'right') => void;
  setPlayerTarget: (targetX: number) => void;
  updateMousePosition: (x: number, y: number) => void;
  shootBullet: () => void;
  togglePause: () => void;
}) => {
  useEffect(() => {
    const keysPressed: Record<string, boolean> = {};
    
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed[e.key] = true;
      
      // Pause game on 'p' or 'Escape'
      if (e.key === 'p' || e.key === 'Escape') {
        gameState.togglePause();
      }
      
      // Shoot on Space
      if (e.key === ' ' && !keysPressed[' ']) {
        gameState.shootBullet();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed[e.key] = false;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Get canvas position
      const canvas = e.target as HTMLElement;
      const rect = canvas.getBoundingClientRect();
      
      // Calculate mouse position relative to canvas
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      gameState.updateMousePosition(x, y);
      gameState.setPlayerTarget(x);
    };
    
    const handleMouseClick = () => {
      gameState.shootBullet();
    };
    
    // Game loop for continuous movement
    const moveInterval = setInterval(() => {
      if (keysPressed['ArrowLeft'] || keysPressed['a']) {
        gameState.movePlayer('left');
      }
      if (keysPressed['ArrowRight'] || keysPressed['d']) {
        gameState.movePlayer('right');
      }
    }, 16); // ~60fps
    
    // Find the canvas element
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('click', handleMouseClick);
    }
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      clearInterval(moveInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('click', handleMouseClick);
      }
    };
  }, [gameState]);
};
