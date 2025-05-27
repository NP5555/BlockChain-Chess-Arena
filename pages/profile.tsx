import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

// Create properly typed motion components
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;
const MotionTr = motion.tr as any;
import {
  UserIcon,
  CogIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

import Layout from '@/components/Layout';
import { useWallet } from '@/hooks/useWallet';

// Mock user data
const mockUserData = {
  username: 'ChessMaster',
  email: 'chessmaster@example.com',
  avatar: '👑',
  bio: 'Passionate chess player exploring the blockchain world. Love strategic games and crypto!',
  joinDate: '2024-01-15',
  location: 'Global',
  website: 'https://chessmaster.com',
  stats: {
    gamesPlayed: 156,
    gamesWon: 134,
    gamesLost: 18,
    gamesDrawn: 4,
    winRate: 85.9,
    rating: 2450,
    highestRating: 2520,
    tokensEarned: '12,450',
    nftsOwned: 8,
    rank: 1
  },
  preferences: {
    notifications: {
      gameInvites: true,
      gameResults: true,
      tokenRewards: true,
      marketplaceActivity: false,
      newsletter: true
    },
    privacy: {
      showEmail: false,
      showStats: true,
      showOnlineStatus: true
    },
    gameplay: {
      autoAcceptDraws: false,
      showMoveHints: true,
      soundEffects: true,
      boardTheme: 'classic'
    }
  }
};

const boardThemes = [
  { id: 'classic', name: 'Classic', preview: '🏁' },
  { id: 'wood', name: 'Wood', preview: '🪵' },
  { id: 'marble', name: 'Marble', preview: '⚪' },
  { id: 'neon', name: 'Neon', preview: '🌈' },
  { id: 'space', name: 'Space', preview: '🌌' }
];

export default function Profile() {
  const { wallet } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(mockUserData);
  const [editForm, setEditForm] = useState({
    username: userData.username,
    bio: userData.bio,
    location: userData.location,
    website: userData.website
  });

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'stats', name: 'Statistics', icon: ChartBarIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon }
  ];

  const handleSaveProfile = () => {
    setUserData(prev => ({
      ...prev,
      username: editForm.username,
      bio: editForm.bio,
      location: editForm.location,
      website: editForm.website
    }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      username: userData.username,
      bio: userData.bio,
      location: userData.location,
      website: userData.website
    });
    setIsEditing(false);
  };

  const updatePreference = (category: string, key: string, value: any) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: {
          ...prev.preferences[category as keyof typeof prev.preferences],
          [key]: value
        }
      }
    }));
  };

  return (
    <Layout>
      <Head>
        <title>Profile - BlockChain Chess Arena</title>
        <meta name="description" content="Manage your chess profile and settings" />
      </Head>

      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              👤 Profile
            </h1>
            <p className="text-xl text-gray-400">
              Manage your chess profile and preferences
            </p>
          </MotionDiv>

          {/* Profile Header */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl">
                  {userData.avatar}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <PhotoIcon className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                  <h2 className="text-2xl font-bold text-white">{userData.username}</h2>
                  <div className="flex items-center space-x-1">
                    <TrophyIcon className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold">#{userData.stats.rank}</span>
                  </div>
                </div>
                <p className="text-gray-400 mb-2">{userData.bio}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                  <span>📍 {userData.location}</span>
                  <span>📅 Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
                  {wallet && (
                    <span className="font-mono">🔗 {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary flex items-center space-x-2"
              >
                <PencilIcon className="w-4 h-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </MotionDiv>

          {/* Edit Form */}
          {isEditing && (
            <MotionDiv
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card mb-8"
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Profile</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Username</label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Website</label>
                  <input
                    type="url"
                    value={editForm.website}
                    onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="btn-primary flex items-center space-x-2"
                >
                  <CheckIcon className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </MotionDiv>
          )}

          {/* Tabs */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/10 rounded-lg p-1 backdrop-blur-md">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </MotionDiv>

          {/* Tab Content */}
          <MotionDiv
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="card">
                  <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating</span>
                      <span className="text-white font-semibold">{userData.stats.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Games Played</span>
                      <span className="text-white">{userData.stats.gamesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="text-green-400 font-semibold">{userData.stats.winRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tokens Earned</span>
                      <span className="text-yellow-400 font-semibold">{userData.stats.tokensEarned} CHESS</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                  <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-400 text-sm">Won against CryptoKnight</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-400 text-sm">Purchased Golden Rook NFT</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-400 text-sm">Earned 50 CHESS tokens</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-400 text-sm">Reached new rating high</span>
                    </div>
                  </div>
                </div>

                {/* NFT Collection */}
                <div className="card">
                  <h3 className="text-lg font-bold text-white mb-4">NFT Collection</h3>
                  <div className="text-center">
                    <div className="text-3xl mb-2">🎨</div>
                    <div className="text-2xl font-bold text-white">{userData.stats.nftsOwned}</div>
                    <div className="text-gray-400 text-sm">NFTs Owned</div>
                    <button className="btn-secondary mt-3 text-sm">
                      View Collection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card text-center">
                  <TrophyIcon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{userData.stats.gamesWon}</div>
                  <div className="text-gray-400 text-sm">Games Won</div>
                </div>
                <div className="card text-center">
                  <XMarkIcon className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{userData.stats.gamesLost}</div>
                  <div className="text-gray-400 text-sm">Games Lost</div>
                </div>
                <div className="card text-center">
                  <div className="w-8 h-8 bg-gray-400 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
                    =
                  </div>
                  <div className="text-2xl font-bold text-white">{userData.stats.gamesDrawn}</div>
                  <div className="text-gray-400 text-sm">Games Drawn</div>
                </div>
                <div className="card text-center">
                  <ChartBarIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{userData.stats.highestRating}</div>
                  <div className="text-gray-400 text-sm">Highest Rating</div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Notifications */}
                <div className="card">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <BellIcon className="w-5 h-5" />
                    <span>Notifications</span>
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(userData.preferences.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <button
                          onClick={() => updatePreference('notifications', key, !value)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            value ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy */}
                <div className="card">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span>Privacy</span>
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(userData.preferences.privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <button
                          onClick={() => updatePreference('privacy', key, !value)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            value ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gameplay */}
                <div className="card">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                    <CogIcon className="w-5 h-5" />
                    <span>Gameplay</span>
                  </h3>
                  <div className="space-y-4">
                    {/* Board Theme */}
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Board Theme</label>
                      <div className="grid grid-cols-5 gap-2">
                        {boardThemes.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => updatePreference('gameplay', 'boardTheme', theme.id)}
                            className={`p-3 rounded-lg border-2 transition-colors ${
                              userData.preferences.gameplay.boardTheme === theme.id
                                ? 'border-blue-500 bg-blue-500/20'
                                : 'border-white/20 bg-white/5 hover:border-white/40'
                            }`}
                          >
                            <div className="text-2xl mb-1">{theme.preview}</div>
                            <div className="text-xs text-gray-400">{theme.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Other Gameplay Settings */}
                    {Object.entries(userData.preferences.gameplay)
                      .filter(([key]) => key !== 'boardTheme')
                      .map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <button
                          onClick={() => updatePreference('gameplay', key, !value)}
                          className={`w-12 h-6 rounded-full transition-colors ${
                            value ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </MotionDiv>
        </div>
      </div>
    </Layout>
  );
} 
