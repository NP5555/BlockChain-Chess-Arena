import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Create properly typed motion components
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionTr = motion.tr as any;
import {
  SparklesIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

import Layout from '@/components/Layout';

const mockNFTs = [
  {
    id: 1,
    name: 'Golden King',
    description: 'Legendary chess piece with golden finish',
    image: '👑',
    rarity: 'Legendary',
    price: '250',
    seller: '0x1234...5678',
    type: 'Chess Piece'
  },
  {
    id: 2,
    name: 'Crystal Queen',
    description: 'Epic queen piece made of pure crystal',
    image: '♛',
    rarity: 'Epic',
    price: '150',
    seller: '0x2345...6789',
    type: 'Chess Piece'
  },
  {
    id: 3,
    name: 'Marble Board',
    description: 'Classic marble chess board',
    image: '🏁',
    rarity: 'Rare',
    price: '75',
    seller: '0x3456...7890',
    type: 'Chess Board'
  },
  {
    id: 4,
    name: 'Dragon Knight',
    description: 'Mythical knight piece with dragon design',
    image: '🐉',
    rarity: 'Epic',
    price: '120',
    seller: '0x4567...8901',
    type: 'Chess Piece'
  },
  {
    id: 5,
    name: 'Neon Board',
    description: 'Futuristic neon-lit chess board',
    image: '🌈',
    rarity: 'Uncommon',
    price: '45',
    seller: '0x5678...9012',
    type: 'Chess Board'
  },
  {
    id: 6,
    name: 'Silver Rook',
    description: 'Elegant silver rook piece',
    image: '♜',
    rarity: 'Rare',
    price: '80',
    seller: '0x6789...0123',
    type: 'Chess Piece'
  }
];

const rarityColors = {
  'Common': 'from-gray-400 to-gray-600',
  'Uncommon': 'from-green-400 to-green-600',
  'Rare': 'from-blue-400 to-blue-600',
  'Epic': 'from-purple-400 to-purple-600',
  'Legendary': 'from-yellow-400 to-orange-500'
};

const categories = ['All', 'Chess Pieces', 'Chess Boards', 'Complete Sets'];
const rarities = ['All', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNFTs = mockNFTs.filter(nft => {
    const matchesCategory = selectedCategory === 'All' || 
      (selectedCategory === 'Chess Pieces' && nft.type === 'Chess Piece') ||
      (selectedCategory === 'Chess Boards' && nft.type === 'Chess Board');
    
    const matchesRarity = selectedRarity === 'All' || nft.rarity === selectedRarity;
    
    const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesRarity && matchesSearch;
  });

  return (
    <Layout>
      <Head>
        <title>NFT Marketplace - BlockChain Chess Arena</title>
        <meta name="description" content="Buy and sell NFT chess pieces and boards" />
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
              ✨ NFT Marketplace
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover, collect, and trade unique chess pieces and boards
            </p>
          </MotionDiv>

          {/* Search and Filters */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-900">
                    {category}
                  </option>
                ))}
              </select>

              {/* Rarity Filter */}
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity} className="bg-gray-900">
                    {rarity}
                  </option>
                ))}
              </select>
            </div>
          </MotionDiv>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card text-center"
            >
              <SparklesIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">1,247</div>
              <div className="text-gray-400 text-sm">Total NFTs</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card text-center"
            >
              <CurrencyDollarIcon className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">89</div>
              <div className="text-gray-400 text-sm">For Sale</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card text-center"
            >
              <div className="text-2xl font-bold text-white">45.2K</div>
              <div className="text-gray-400 text-sm">Volume (CHESS)</div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card text-center"
            >
              <div className="text-2xl font-bold text-white">156</div>
              <div className="text-gray-400 text-sm">Owners</div>
            </MotionDiv>
          </div>

          {/* NFT Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.map((nft, index) => (
              <MotionDiv
                key={nft.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="card hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                {/* NFT Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center text-6xl">
                  {nft.image}
                </div>

                {/* Rarity Badge */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${rarityColors[nft.rarity as keyof typeof rarityColors]} mb-3`}>
                  {nft.rarity}
                </div>

                {/* NFT Info */}
                <h3 className="text-xl font-bold text-white mb-2">{nft.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{nft.description}</p>

                {/* Type */}
                <div className="text-blue-400 text-sm mb-4">{nft.type}</div>

                {/* Price and Seller */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-gray-400 text-xs">Price</div>
                    <div className="text-yellow-400 font-bold">{nft.price} CHESS</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-xs">Seller</div>
                    <div className="text-white text-sm font-mono">{nft.seller}</div>
                  </div>
                </div>

                {/* Buy Button */}
                <button className="w-full btn-primary">
                  Buy Now
                </button>
              </MotionDiv>
            ))}
          </div>

          {/* No Results */}
          {filteredNFTs.length === 0 && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No NFTs Found</h3>
              <p className="text-gray-400">Try adjusting your search or filters</p>
            </MotionDiv>
          )}

          {/* Load More */}
          {filteredNFTs.length > 0 && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="text-center mt-8"
            >
              <button className="btn-secondary">
                Load More NFTs
              </button>
            </MotionDiv>
          )}
        </div>
      </div>
    </Layout>
  );
} 
