import React from 'react';
import { Zap, ArrowLeft, ArrowRight, MousePointer, KeySquare } from 'lucide-react';

const GameInstructions: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Zap className="text-yellow-400" />
        How to Play
      </h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-gray-700 p-2 rounded-md">
            <ArrowLeft size={20} className="text-blue-400" />
            <ArrowRight size={20} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Movement</h3>
            <p className="text-gray-300">Use arrow keys or A/D to move your ship left and right.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-gray-700 p-2 rounded-md">
            <MousePointer size={20} className="text-green-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Aim & Shoot</h3>
            <p className="text-gray-300">Move your mouse to aim. Click or press Space to fire.</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="bg-gray-700 p-2 rounded-md">
            <KeySquare size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Pause</h3>
            <p className="text-gray-300">Press ESC or P to pause the game.</p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Game Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-300">
            <li>5 lives to survive the alien invasion</li>
            <li>Spectacular explosions and visual effects</li>
            <li>Mouse-controlled aiming system</li>
            <li>Increasing difficulty with each level</li>
            <li>Score tracking on the blockchain</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameInstructions;
