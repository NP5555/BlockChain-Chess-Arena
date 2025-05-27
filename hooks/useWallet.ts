import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { WalletConnection } from '@/types';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected
  const checkConnection = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        const balance = await provider.getBalance(address);
        
        // Get CHESS token balance (placeholder for now)
        const chessTokenBalance = '0'; // TODO: Implement actual token balance fetching
        
        setWallet({
          address,
          chainId: network.chainId,
          isConnected: true,
          balance: ethers.utils.formatEther(balance),
          chessTokenBalance
        });
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err);
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(address);
      
      // Get CHESS token balance (placeholder for now)
      const chessTokenBalance = '0'; // TODO: Implement actual token balance fetching
      
      setWallet({
        address,
        chainId: network.chainId,
        isConnected: true,
        balance: ethers.utils.formatEther(balance),
        chessTokenBalance
      });
    } catch (err: any) {
      if (err.code === 4001) {
        setError('Please connect to MetaMask.');
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
      console.error('Error connecting wallet:', err);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWallet(null);
    setError(null);
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (chainId: number) => {
    if (!window.ethereum) {
      setError('MetaMask is not installed');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (err: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [getNetworkConfig(chainId)],
          });
        } catch (addError) {
          setError('Failed to add network');
        }
      } else {
        setError('Failed to switch network');
      }
    }
  }, []);

  // Get network configuration
  const getNetworkConfig = (chainId: number) => {
    switch (chainId) {
      case 137: // Polygon Mainnet
        return {
          chainId: '0x89',
          chainName: 'Polygon Mainnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://polygon-rpc.com/'],
          blockExplorerUrls: ['https://polygonscan.com/'],
        };
      case 80001: // Mumbai Testnet
        return {
          chainId: '0x13881',
          chainName: 'Mumbai Testnet',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18,
          },
          rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
          blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
        };
      case 1: // Ethereum Mainnet
        return {
          chainId: '0x1',
          chainName: 'Ethereum Mainnet',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18,
          },
          rpcUrls: ['https://mainnet.infura.io/v3/'],
          blockExplorerUrls: ['https://etherscan.io/'],
        };
      default:
        throw new Error('Unsupported network');
    }
  };

  // Update balances
  const updateBalances = useCallback(async () => {
    if (!wallet || !window.ethereum) return;

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(wallet.address);
      
      // Get CHESS token balance (placeholder for now)
      const chessTokenBalance = '0'; // TODO: Implement actual token balance fetching
      
      setWallet((prev: WalletConnection | null) => prev ? {
        ...prev,
        balance: ethers.utils.formatEther(balance),
        chessTokenBalance
      } : null);
    } catch (err) {
      console.error('Error updating balances:', err);
    }
  }, [wallet]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        checkConnection();
      }
    };

    const handleChainChanged = () => {
      checkConnection();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkConnection, disconnect]);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  // Update balances periodically
  useEffect(() => {
    if (!wallet) return;

    const interval = setInterval(updateBalances, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [wallet, updateBalances]);

  return {
    wallet,
    connect,
    disconnect,
    switchNetwork,
    updateBalances,
    isConnecting,
    error
  };
} 