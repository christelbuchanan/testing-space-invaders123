import React, { useRef, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useGameControls } from '../hooks/useGameControls';
import { useGameLoop } from '../hooks/useGameLoop';
import { useGameRenderer } from '../hooks/useGameRenderer';

interface GameCanvasProps {
  width: number;
  height: number;
  playerAddress: string | null;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ width, height, playerAddress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameState = useGameState(width, height);
  
  // Set up game controls
  useGameControls(gameState);
  
  // Set up game rendering
  const { render } = useGameRenderer(canvasRef);
  
  // Set up game loop
  useGameLoop(gameState, render);

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="bg-black border-2 border-purple-600 rounded-lg cursor-crosshair"
      />
      
      {gameState.gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-white">
          <h2 className="text-4xl font-bold mb-4 text-red-500">Game Over</h2>
          <p className="text-2xl mb-2">Final Score: {gameState.score}</p>
          <p className="text-xl mb-6">Level Reached: {gameState.level}</p>
          <button 
            onClick={() => gameState.resetGame()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      )}
      
      {gameState.paused && !gameState.gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Paused</h2>
            <p className="text-xl mb-6">Press ESC or P to resume</p>
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Controls:</h3>
              <p>Move: Arrow Keys or A/D</p>
              <p>Shoot: Space or Click</p>
              <p>Aim: Mouse</p>
              <p>Pause: ESC or P</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center">
        <div className="text-white">
          <span className="text-gray-400">Player: </span>
          {playerAddress ? `${playerAddress.substring(0, 6)}...${playerAddress.substring(playerAddress.length - 4)}` : 'Not Connected'}
        </div>
        
        <button
          onClick={() => gameState.togglePause()}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          {gameState.paused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
};

export default GameCanvas;
