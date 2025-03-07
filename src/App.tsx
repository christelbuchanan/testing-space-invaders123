import React, { useState, useEffect } from 'react';
import { Rocket, Zap, Bug } from 'lucide-react';
import WalletConnect from './components/WalletConnect';
import GameCanvas from './components/GameCanvas';
import GameInstructions from './components/GameInstructions';
import Leaderboard from './components/Leaderboard';

// Mock leaderboard data - in a real app, this would come from a backend
const mockLeaderboard = [
  { address: '0x1234567890abcdef1234567890abcdef12345678', score: 12500, level: 5 },
  { address: '0xabcdef1234567890abcdef1234567890abcdef12', score: 9800, level: 4 },
  { address: '0x7890abcdef1234567890abcdef1234567890abcd', score: 7200, level: 3 },
];

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const returnToMenu = () => {
    setGameStarted(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bug className="text-purple-400" size={28} />
          <h1 className="text-2xl font-bold">Space Invaders Web3</h1>
        </div>
        <WalletConnect onConnect={handleWalletConnect} />
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {!gameStarted ? (
          <div className="flex flex-col items-center">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3">
                <Rocket className="text-purple-400" />
                Space Invaders
                <Bug className="text-green-400" />
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Defend Earth from alien invaders! Connect your wallet and compete for the highest score on the blockchain.
              </p>
            </div>

            {/* Game Start Button */}
            <div className="mb-12">
              {walletAddress ? (
                <button
                  onClick={startGame}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xl font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Zap size={24} />
                  Start Game
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-lg text-gray-400 mb-4">Connect your wallet to play</p>
                  <WalletConnect onConnect={handleWalletConnect} />
                </div>
              )}
            </div>

            {/* Game Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <GameInstructions />
              <Leaderboard entries={leaderboard} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <GameCanvas width={800} height={600} playerAddress={walletAddress} />
            
            <button
              onClick={returnToMenu}
              className="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Return to Menu
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-4 px-6 text-center text-gray-400">
        <p>© 2023 Space Invaders Web3 | Connect your wallet to save high scores</p>
      </footer>
    </div>
  );
}

export default App;
