import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Create properly typed motion components
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionTr = motion.tr as any;
import {
  ChartBarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClockIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

import Layout from '@/components/Layout';

// Mock statistics data
const platformStats = {
  totalPlayers: 2847,
  totalGames: 15692,
  totalTokensDistributed: 847000,
  totalNFTs: 1247,
  averageGameTime: 12.5,
  activePlayersToday: 156,
  gamesPlayedToday: 89,
  tokensEarnedToday: 2450
};

const gameTypeStats = [
  { type: 'Blitz', games: 6234, percentage: 39.7, trend: 'up' },
  { type: 'Rapid', games: 5891, percentage: 37.5, trend: 'up' },
  { type: 'Classical', games: 2456, percentage: 15.6, trend: 'down' },
  { type: 'Bullet', games: 1111, percentage: 7.2, trend: 'up' }
];

const recentGames = [
  {
    id: 1,
    white: { name: 'ChessMaster', rating: 2450, avatar: '👑' },
    black: { name: 'CryptoKnight', rating: 2380, avatar: '♞' },
    result: 'white',
    timeControl: '10+0',
    wager: '50 CHESS',
    duration: '15:32'
  },
  {
    id: 2,
    white: { name: 'BlockchainBishop', rating: 2320, avatar: '♗' },
    black: { name: 'Web3Wizard', rating: 2280, avatar: '🧙‍♂️' },
    result: 'black',
    timeControl: '5+0',
    wager: '25 CHESS',
    duration: '8:45'
  },
  {
    id: 3,
    white: { name: 'DeFiDragon', rating: 2240, avatar: '🐉' },
    black: { name: 'NFTNinja', rating: 2190, avatar: '🥷' },
    result: 'draw',
    timeControl: '15+10',
    wager: '75 CHESS',
    duration: '28:17'
  }
];

const topEarners = [
  { name: 'ChessMaster', avatar: '👑', earned: '12,450', games: 156 },
  { name: 'CryptoKnight', avatar: '♞', earned: '9,850', games: 142 },
  { name: 'BlockchainBishop', avatar: '♗', earned: '8,200', games: 128 },
  { name: 'Web3Wizard', avatar: '🧙‍♂️', earned: '6,750', games: 98 },
  { name: 'DeFiDragon', avatar: '🐉', earned: '5,890', games: 89 }
];

export default function Stats() {
  const [timeframe, setTimeframe] = useState('all-time');

  const timeframes = [
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' },
    { id: 'all-time', name: 'All Time' }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Layout>
      <Head>
        <title>Statistics - BlockChain Chess Arena</title>
        <meta name="description" content="Platform statistics and analytics for the blockchain chess arena" />
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
              📊 Platform Statistics
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time analytics and insights from the blockchain chess arena
            </p>
          </MotionDiv>

          {/* Timeframe Selector */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/10 rounded-lg p-1 backdrop-blur-md">
              {timeframes.map((tf) => (
                <button
                  key={tf.id}
                  onClick={() => setTimeframe(tf.id)}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    timeframe === tf.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tf.name}
                </button>
              ))}
            </div>
          </MotionDiv>

          {/* Main Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card text-center"
            >
              <UserGroupIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{formatNumber(platformStats.totalPlayers)}</div>
              <div className="text-gray-400 text-sm">Total Players</div>
              <div className="text-green-400 text-xs mt-1">+{platformStats.activePlayersToday} today</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card text-center"
            >
              <TrophyIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{formatNumber(platformStats.totalGames)}</div>
              <div className="text-gray-400 text-sm">Games Played</div>
              <div className="text-green-400 text-xs mt-1">+{platformStats.gamesPlayedToday} today</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card text-center"
            >
              <CurrencyDollarIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{formatNumber(platformStats.totalTokensDistributed)}</div>
              <div className="text-gray-400 text-sm">CHESS Distributed</div>
              <div className="text-green-400 text-xs mt-1">+{formatNumber(platformStats.tokensEarnedToday)} today</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card text-center"
            >
              <SparklesIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white">{formatNumber(platformStats.totalNFTs)}</div>
              <div className="text-gray-400 text-sm">NFTs Created</div>
              <div className="text-blue-400 text-xs mt-1">89 for sale</div>
            </MotionDiv>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Game Types Distribution */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-6">Game Types Distribution</h3>
              <div className="space-y-4">
                {gameTypeStats.map((stat, index) => (
                  <div key={stat.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold text-white">{stat.type}</div>
                      <div className="flex items-center space-x-1">
                        {stat.trend === 'up' ? (
                          <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                        ) : (
                          <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
                        )}
                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                          {stat.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400">{formatNumber(stat.games)} games</div>
                  </div>
                ))}
              </div>
            </MotionDiv>

            {/* Top Earners */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <h3 className="text-xl font-bold text-white mb-6">Top Token Earners</h3>
              <div className="space-y-4">
                {topEarners.map((earner, index) => (
                  <div key={earner.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{earner.avatar}</div>
                      <div>
                        <div className="text-white font-semibold">{earner.name}</div>
                        <div className="text-gray-400 text-sm">{earner.games} games</div>
                      </div>
                    </div>
                    <div className="text-yellow-400 font-semibold">{earner.earned} CHESS</div>
                  </div>
                ))}
              </div>
            </MotionDiv>
          </div>

          {/* Recent Games */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card"
          >
            <h3 className="text-xl font-bold text-white mb-6">Recent Games</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Players</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Result</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Time Control</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Wager</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGames.map((game) => (
                    <tr key={game.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{game.white.avatar}</span>
                            <div>
                              <div className="text-white text-sm font-semibold">{game.white.name}</div>
                              <div className="text-gray-400 text-xs">({game.white.rating})</div>
                            </div>
                          </div>
                          <span className="text-gray-400">vs</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{game.black.avatar}</span>
                            <div>
                              <div className="text-white text-sm font-semibold">{game.black.name}</div>
                              <div className="text-gray-400 text-xs">({game.black.rating})</div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          game.result === 'white' ? 'bg-green-500/20 text-green-400' :
                          game.result === 'black' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {game.result === 'white' ? 'White Wins' :
                           game.result === 'black' ? 'Black Wins' : 'Draw'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{game.timeControl}</td>
                      <td className="py-3 px-4 text-yellow-400 font-semibold">{game.wager}</td>
                      <td className="py-3 px-4 text-gray-400">{game.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MotionDiv>

          {/* Additional Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="card text-center"
            >
              <ClockIcon className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{platformStats.averageGameTime}m</div>
              <div className="text-gray-400 text-sm">Average Game Time</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="card text-center"
            >
              <ChartBarIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">2,156</div>
              <div className="text-gray-400 text-sm">Average Rating</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="card text-center"
            >
              <TrophyIcon className="w-8 h-8 text-pink-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">67.3%</div>
              <div className="text-gray-400 text-sm">Decisive Games</div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </Layout>
  );
} 
