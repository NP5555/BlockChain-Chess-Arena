import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WalletIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

import { useWallet } from '@/hooks/useWallet';
import ClientOnly from './ClientOnly';

export default function WalletConnect() {
  return (
    <ClientOnly>
      <WalletConnectContent />
    </ClientOnly>
  );
}

function WalletConnectContent() {
  const { wallet, connect, disconnect, isConnecting } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatBalance = (balance: string) => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.001) return '<0.001';
    return num.toFixed(3);
  };

  const copyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.wallet-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!wallet) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="btn-primary flex items-center space-x-2"
      >
        <WalletIcon className="w-5 h-5" />
        <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
      </button>
    );
  }

  return (
    <div className="relative wallet-dropdown">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 transition-all duration-200"
      >
        {/* Wallet Icon */}
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <WalletIcon className="w-4 h-4 text-white" />
        </div>

        {/* Address and Balance */}
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-white">
            {formatAddress(wallet.address)}
          </div>
          <div className="text-xs text-gray-400">
            {formatBalance(wallet.chessTokenBalance)} CHESS
          </div>
        </div>

        {/* Dropdown Arrow */}
        <ChevronDownIcon 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            showDropdown ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-xl shadow-xl z-50">
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Wallet Connected</div>
                    <div className="text-xs text-gray-400">MetaMask</div>
                  </div>
                </div>
              </div>

              {/* Wallet Info */}
              <div className="p-4 space-y-4">
                {/* Address */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Address</label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-white font-mono">
                      {formatAddress(wallet.address)}
                    </span>
                    <button
                      onClick={copyAddress}
                      className="p-1 hover:bg-white/10 rounded transition-colors duration-200"
                      title="Copy address"
                    >
                      {copied ? (
                        <CheckIcon className="w-4 h-4 text-green-400" />
                      ) : (
                        <DocumentDuplicateIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Balances */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400 uppercase tracking-wide">ETH Balance</div>
                    <div className="text-lg font-semibold text-white mt-1">
                      {formatBalance(wallet.balance)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-gray-400 uppercase tracking-wide">CHESS Tokens</div>
                    <div className="text-lg font-semibold text-yellow-400 mt-1">
                      {formatBalance(wallet.chessTokenBalance)}
                    </div>
                  </div>
                </div>

                {/* Network Info */}
                <div>
                  <label className="text-xs text-gray-400 uppercase tracking-wide">Network</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-white">
                      {wallet.chainId === 137 ? 'Polygon' : 
                       wallet.chainId === 1 ? 'Ethereum' : 
                       wallet.chainId === 80001 ? 'Mumbai Testnet' : 
                       `Chain ${wallet.chainId}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg py-2 px-4 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Disconnect Wallet</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 