import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  PlayIcon,
  ChartBarIcon,
  GlobeAltIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

import Layout from '@/components/Layout';
import WalletConnect from '@/components/WalletConnect';
import { useWallet } from '@/hooks/useWallet';

const features = [
  {
    icon: CurrencyDollarIcon,
    title: 'Play-to-Earn',
    description: 'Earn CHESS tokens for every victory. The better you play, the more you earn.',
    color: 'from-yellow-400 to-amber-500'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Provably Fair',
    description: 'Every move is recorded on-chain. No cheating possible, completely transparent.',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: SparklesIcon,
    title: 'NFT Chess Sets',
    description: 'Collect, trade, and customize your chess pieces and boards as NFTs.',
    color: 'from-purple-400 to-pink-500'
  },
  {
    icon: TrophyIcon,
    title: 'Tournaments',
    description: 'Compete in tournaments with massive prize pools and climb the leaderboard.',
    color: 'from-blue-400 to-cyan-500'
  }
];

const stats = [
  { label: 'Total Games Played', value: '12,847', icon: PlayIcon },
  { label: 'CHESS Tokens Earned', value: '2.4M', icon: CurrencyDollarIcon },
  { label: 'Active Players', value: '3,291', icon: ChartBarIcon },
  { label: 'Prize Pool', value: '$125K', icon: TrophyIcon }
];

// Create properly typed motion components
const MotionDiv = motion.div as any;

export default function Home() {
  const { wallet, connect, isConnecting } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Layout>
      <Head>
        <title>BlockChain Chess Arena - Play Chess, Earn Crypto</title>
        <meta name="description" content="The ultimate decentralized chess platform. Play chess, earn crypto rewards, and trade NFT chess pieces." />
        <meta name="keywords" content="chess, blockchain, crypto, NFT, play-to-earn, web3" />
        <meta property="og:title" content="BlockChain Chess Arena" />
        <meta property="og:description" content="Play Chess. Earn Crypto. Outsmart Your Opponent." />
        <meta property="og:type" content="website" />
      </Head>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 chess-board-pattern opacity-5"></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-pink-900/50"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">BlockChain</span>
              <br />
              <span className="text-white">Chess Arena</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Play Chess. Earn Crypto. Outsmart Your Opponent.
            </p>
            
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              The ultimate decentralized chess platform where skill meets blockchain technology. 
              Compete in real-time matches, earn CHESS tokens, and trade NFT chess pieces.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {wallet ? (
                <Link href="/play" className="btn-primary text-lg px-8 py-4">
                  <PlayIcon className="w-6 h-6 mr-2" />
                  Start Playing
                </Link>
              ) : (
                <WalletConnect />
              )}
              
              <Link href="/leaderboard" className="btn-secondary text-lg px-8 py-4">
                <TrophyIcon className="w-6 h-6 mr-2" />
                View Leaderboard
              </Link>
            </div>
          </MotionDiv>
        </div>

        {/* Floating Chess Pieces */}
        <div className="absolute inset-0 pointer-events-none">
          <MotionDiv
            className="absolute top-20 left-10 text-6xl opacity-20"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            ♔
          </MotionDiv>
          <MotionDiv
            className="absolute top-40 right-20 text-4xl opacity-20"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            ♛
          </MotionDiv>
          <MotionDiv
            className="absolute bottom-40 left-20 text-5xl opacity-20"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 2 }}
          >
            ♜
          </MotionDiv>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <MotionDiv
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience chess like never before with blockchain technology, 
              true ownership, and real rewards for your skills.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <MotionDiv
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get started in just a few simple steps and begin earning crypto rewards.
            </p>
          </MotionDiv>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your MetaMask or Web3 wallet to get started.',
                icon: '🔗'
              },
              {
                step: '02',
                title: 'Find Opponent',
                description: 'Join matchmaking or challenge a friend to a game.',
                icon: '⚔️'
              },
              {
                step: '03',
                title: 'Play & Earn',
                description: 'Win games to earn CHESS tokens and climb the leaderboard.',
                icon: '🏆'
              }
            ].map((item, index) => (
              <MotionDiv
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="text-6xl mb-6">{item.icon}</div>
                <div className="text-blue-400 font-bold text-lg mb-2">Step {item.step}</div>
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="card"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Chess Journey?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of players already earning crypto rewards through chess mastery.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {wallet ? (
                <Link href="/play" className="btn-primary text-lg px-8 py-4">
                  <PlayIcon className="w-6 h-6 mr-2" />
                  Start Playing Now
                </Link>
              ) : (
                <WalletConnect />
              )}
              
              <Link href="/marketplace" className="btn-secondary text-lg px-8 py-4">
                <SparklesIcon className="w-6 h-6 mr-2" />
                Browse NFTs
              </Link>
            </div>
          </MotionDiv>
        </div>
      </section>
    </Layout>
  );
} 
