import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

// Create properly typed motion components
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionTr = motion.tr as any;
import {
  PlayIcon,
  ClockIcon,
  TrophyIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

import Layout from '@/components/Layout';
import { useWallet } from '@/hooks/useWallet';

const gameTypes = [
  {
    id: 'blitz',
    name: 'Blitz',
    description: 'Fast-paced games',
    timeControl: '3+0',
    wager: '5 CHESS',
    icon: '⚡',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'rapid',
    name: 'Rapid',
    description: 'Standard games',
    timeControl: '10+0',
    wager: '10 CHESS',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'classical',
    name: 'Classical',
    description: 'Long games',
    timeControl: '30+0',
    wager: '25 CHESS',
    icon: '🏛️',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'custom',
    name: 'Custom',
    description: 'Set your own rules',
    timeControl: 'Custom',
    wager: 'Custom',
    icon: '⚙️',
    color: 'from-green-500 to-emerald-500'
  }
];

export default function Play() {
  const { wallet } = useWallet();
  const router = useRouter();
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleQuickMatch = (gameType: string) => {
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }
    
    setSelectedGameType(gameType);
    setIsSearching(true);
    
    // Simulate matchmaking process
    setTimeout(() => {
      setIsSearching(false);
      // Generate a random game ID and navigate to the game
      const gameId = Math.random().toString(36).substring(2, 15);
      router.push(`/game/${gameId}?type=${gameType}`);
    }, 2000);
  };

  const handleCreateGame = () => {
    if (!wallet) {
      alert('Please connect your wallet first');
      return;
    }
    
    // Create a new game and navigate to it
    const gameId = Math.random().toString(36).substring(2, 15);
    router.push(`/game/${gameId}?type=custom&mode=create`);
  };

  return (
    <Layout>
      <Head>
        <title>Play Chess - BlockChain Chess Arena</title>
        <meta name="description" content="Play chess and earn crypto rewards" />
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
              Choose Your Game Mode
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Select a game type and start earning CHESS tokens by winning matches
            </p>
          </MotionDiv>

          {/* Wallet Status */}
          {!wallet && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-8 text-center"
            >
              <p className="text-yellow-300">
                Please connect your wallet to start playing
              </p>
            </MotionDiv>
          )}

          {/* Game Types Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {gameTypes.map((gameType, index) => (
              <MotionDiv
                key={gameType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleQuickMatch(gameType.id)}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${gameType.color} flex items-center justify-center text-2xl`}>
                  {gameType.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 text-center">
                  {gameType.name}
                </h3>
                
                <p className="text-gray-400 text-center mb-4">
                  {gameType.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time:</span>
                    <span className="text-white">{gameType.timeControl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wager:</span>
                    <span className="text-yellow-400">{gameType.wager}</span>
                  </div>
                </div>
                
                <button
                  className="w-full mt-4 btn-primary"
                  disabled={!wallet || isSearching}
                >
                  {isSearching && selectedGameType === gameType.id ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Searching...
                    </div>
                  ) : (
                    <>
                      <PlayIcon className="w-4 h-4 mr-2" />
                      Quick Match
                    </>
                  )}
                </button>
              </MotionDiv>
            ))}
          </div>

          {/* Additional Options */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Create Game */}
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                  <UserGroupIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Create Game</h3>
              </div>
              
              <p className="text-gray-400 mb-6">
                Create a custom game and invite friends or wait for opponents to join
              </p>
              
              <button
                onClick={handleCreateGame}
                className="btn-success w-full"
                disabled={!wallet}
              >
                Create Custom Game
              </button>
            </MotionDiv>

            {/* Tournament */}
            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                  <TrophyIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Tournaments</h3>
              </div>
              
              <p className="text-gray-400 mb-6">
                Join tournaments with massive prize pools and compete for the top spot
              </p>
              
              <button
                className="btn-warning w-full"
                disabled
              >
                Coming Soon
              </button>
            </MotionDiv>
          </div>

          {/* Stats */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-gray-400 text-sm">Games Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">89</div>
              <div className="text-gray-400 text-sm">Players Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">12.5K</div>
              <div className="text-gray-400 text-sm">CHESS Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">2:34</div>
              <div className="text-gray-400 text-sm">Avg Match Time</div>
            </div>
          </MotionDiv>
        </div>
      </div>
    </Layout>
  );
} 
