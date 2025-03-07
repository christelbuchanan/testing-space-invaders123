import { useEffect, useRef } from 'react';
import { GameState } from '../types/game';

export const useGameLoop = (
  gameState: GameState & {
    updateGameState: () => void;
  },
  render: (gameState: GameState) => void
) => {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  const gameLoop = (time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    
    const deltaTime = time - previousTimeRef.current;
    
    // Update game state at 60fps
    if (deltaTime > 16) {
      gameState.updateGameState();
      previousTimeRef.current = time;
    }
    
    // Always render at maximum FPS
    render(gameState);
    
    requestRef.current = requestAnimationFrame(gameLoop);
  };
  
  useEffect(() => {
    // Store game state in canvas data attribute for the renderer
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.setAttribute('data-game-state', JSON.stringify(gameState));
    }
    
    requestRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameState, render]);
};
