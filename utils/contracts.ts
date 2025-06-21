import { ethers } from 'ethers';
import { ContractAddresses } from '@/types';

// Contract ABIs (simplified for now - in production, import from artifacts)
export const CHESS_TOKEN_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
];

export const CHESS_GAME_ABI = [
  "function createGame(uint256 wager, uint256 timeControl) external",
  "function joinGame(uint256 gameId) external",
  "function makeMove(uint256 gameId, string calldata move) external",
  "function finishGame(uint256 gameId, uint8 result) external",
  "function claimRewards(uint256 gameId) external",
  "function getGame(uint256 gameId) view returns (tuple)",
  "function getPlayerGames(address player) view returns (uint256[])",
  "function playerStats(address player) view returns (tuple)"
];

export const CHESS_NFT_ABI = [
  "function mintNFT(address to, uint8 nftType, uint8 rarity, string memory name, string memory description, string memory tokenURI) external",
  "function listForSale(uint256 tokenId, uint256 price) external",
  "function buyNFT(uint256 tokenId) external",
  "function removeFromSale(uint256 tokenId) external",
  "function getUserNFTs(address user) view returns (uint256[])",
  "function getActiveListings() view returns (uint256[])",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)"
];

// Contract addresses (will be set from environment variables)
export const getContractAddresses = (): ContractAddresses => ({
  chessToken: process.env.NEXT_PUBLIC_CHESS_TOKEN_ADDRESS || '',
  chessGame: process.env.NEXT_PUBLIC_CHESS_GAME_ADDRESS || '',
  chessNFT: process.env.NEXT_PUBLIC_CHESS_NFT_ADDRESS || ''
});

// Get contract instance
export const getContract = (
  address: string,
  abi: string[],
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  return new ethers.Contract(address, abi, signerOrProvider);
};

// Get provider
export const getProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.BrowserProvider(window.ethereum);
  }
  
  // Fallback to RPC provider
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  if (rpcUrl) {
    return new ethers.JsonRpcProvider(rpcUrl);
  }
  
  throw new Error('No provider available');
};

// Get signer
export const getSigner = async () => {
  const provider = getProvider();
  if (provider instanceof ethers.BrowserProvider) {
    return await provider.getSigner();
  }
  throw new Error('No signer available');
};

// Format token amount
export const formatTokenAmount = (amount: string | number, decimals: number = 18): string => {
  return ethers.formatUnits(amount.toString(), decimals);
};

// Parse token amount
export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  return ethers.parseUnits(amount, decimals);
};

// Check if contracts are deployed
export const areContractsDeployed = (): boolean => {
  const addresses = getContractAddresses();
  return !!(addresses.chessToken && addresses.chessGame && addresses.chessNFT);
};

// Get CHESS token balance
export const getChessTokenBalance = async (address: string): Promise<string> => {
  try {
    const contractAddresses = getContractAddresses();
    if (!contractAddresses.chessToken) {
      return '0';
    }

    const provider = getProvider();
    const contract = getContract(contractAddresses.chessToken, CHESS_TOKEN_ABI, provider);
    const balance = await contract.balanceOf(address);
    return formatTokenAmount(balance.toString());
  } catch (error) {
    console.error('Error fetching CHESS token balance:', error);
    return '0';
  }
}; 