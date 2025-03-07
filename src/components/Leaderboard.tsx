import React from 'react';
import { Trophy, Medal } from 'lucide-react';

interface LeaderboardEntry {
  address: string;
  score: number;
  level: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  // Sort entries by score (highest first)
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score);
  
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="text-yellow-400" />
        Leaderboard
      </h2>
      
      {sortedEntries.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No scores yet. Be the first to play!</p>
      ) : (
        <div className="overflow-hidden rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-300">Rank</th>
                <th className="py-2 px-4 text-left text-sm font-medium text-gray-300">Player</th>
                <th className="py-2 px-4 text-right text-sm font-medium text-gray-300">Score</th>
                <th className="py-2 px-4 text-right text-sm font-medium text-gray-300">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedEntries.map((entry, index) => (
                <tr key={index} className={index < 3 ? "bg-gray-700 bg-opacity-50" : ""}>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {index === 0 ? (
                      <Medal size={20} className="text-yellow-400" />
                    ) : index === 1 ? (
                      <Medal size={20} className="text-gray-400" />
                    ) : index === 2 ? (
                      <Medal size={20} className="text-amber-700" />
                    ) : (
                      <span className="text-gray-400">{index + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-mono">
                    {entry.address.substring(0, 6)}...{entry.address.substring(entry.address.length - 4)}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-bold">
                    {entry.score.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    {entry.level}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
