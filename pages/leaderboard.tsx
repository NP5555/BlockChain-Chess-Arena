import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  StarIcon, 
  FireIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

import Layout from '@/components/Layout';
import { useWallet } from '@/hooks/useWallet';

// Create properly typed motion components
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionTr = motion.tr as any;

const mockLeaderboard = [
  {
    rank: 1,
    address: '0x1234...5678',
    username: 'ChessMaster',
    gamesPlayed: 156,
    gamesWon: 134,
    winRate: 85.9,
    rating: 2450,
    tokensEarned: '12,450',
    avatar: '👑'
  },
  {
    rank: 2,
    address: '0x2345...6789',
    username: 'CryptoKnight',
    gamesPlayed: 142,
    gamesWon: 118,
    winRate: 83.1,
    rating: 2380,
    tokensEarned: '9,850',
    avatar: '♞'
  },
  {
    rank: 3,
    address: '0x3456...7890',
    username: 'BlockchainBishop',
    gamesPlayed: 128,
    gamesWon: 102,
    winRate: 79.7,
    rating: 2320,
    tokensEarned: '8,200',
    avatar: '♗'
  },
  {
    rank: 4,
    address: '0x4567...8901',
    username: 'Web3Wizard',
    gamesPlayed: 98,
    gamesWon: 76,
    winRate: 77.6,
    rating: 2280,
    tokensEarned: '6,750',
    avatar: '🧙‍♂️'
  },
  {
    rank: 5,
    address: '0x5678...9012',
    username: 'DeFiDragon',
    gamesPlayed: 89,
    gamesWon: 67,
    winRate: 75.3,
    rating: 2240,
    tokensEarned: '5,890',
    avatar: '🐉'
  }
];

const timeframes = ['All Time', 'This Month', 'This Week', 'Today'];

export default function Leaderboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('All Time');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank.toString();
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <Layout>
      <Head>
        <title>Leaderboard - BlockChain Chess Arena</title>
        <meta name="description" content="Top players and rankings in the blockchain chess arena" />
      </Head>

      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🏆 Leaderboard
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Top players competing for glory and CHESS tokens
            </p>
          </MotionDiv>

          {/* Timeframe Selector */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/10 rounded-lg p-1 backdrop-blur-md">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </MotionDiv>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card text-center"
            >
              <TrophyIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2,847</div>
              <div className="text-gray-400 text-sm">Total Players</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card text-center"
            >
              <ChartBarIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">15,692</div>
              <div className="text-gray-400 text-sm">Games Played</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card text-center"
            >
              <CurrencyDollarIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">847K</div>
              <div className="text-gray-400 text-sm">CHESS Distributed</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card text-center"
            >
              <UserIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-gray-400 text-sm">Online Now</div>
            </MotionDiv>
          </div>

          {/* Leaderboard Table */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold">Rank</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold">Player</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold">Games</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold">Win Rate</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold">Rating</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-semibold">Tokens Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((player, index) => (
                    <MotionTr
                      key={player.address}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getRankColor(player.rank)} flex items-center justify-center text-sm font-bold`}>
                            {getRankIcon(player.rank)}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{player.avatar}</div>
                          <div>
                            <div className="text-white font-semibold">{player.username}</div>
                            <div className="text-gray-400 text-sm font-mono">{player.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white">{player.gamesPlayed}</div>
                        <div className="text-gray-400 text-sm">{player.gamesWon} wins</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white font-semibold">{player.winRate}%</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-white font-semibold">{player.rating}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-yellow-400 font-semibold">{player.tokensEarned} CHESS</div>
                      </td>
                    </MotionTr>
                  ))}
                </tbody>
              </table>
            </div>
          </MotionDiv>

          {/* Load More */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-8"
          >
            <button className="btn-secondary">
              Load More Players
            </button>
          </MotionDiv>
        </div>
      </div>
    </Layout>
  );
} 
