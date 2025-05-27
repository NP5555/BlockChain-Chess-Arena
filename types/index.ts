// Blockchain and Web3 Types
export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  balance: string;
  chessTokenBalance: string;
}

export interface ContractAddresses {
  chessToken: string;
  chessGame: string;
  chessNFT: string;
}

// Game Types
export enum GameState {
  Waiting = 0,
  Active = 1,
  Finished = 2,
  Cancelled = 3
}

export enum GameResult {
  None = 0,
  WhiteWins = 1,
  BlackWins = 2,
  Draw = 3
}

export interface ChessGame {
  gameId: string;
  whitePlayer: string;
  blackPlayer: string;
  state: GameState;
  result: GameResult;
  wager: string;
  startTime: number;
  endTime: number;
  timeControl: number;
  moves: string;
  rewardsClaimed: boolean;
}

export interface GameMove {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
  san: string;
  fen: string;
  timestamp: number;
  player: string;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  totalRewards: string;
  rating: number;
}

export interface Player {
  address: string;
  username?: string;
  avatar?: string;
  stats: PlayerStats;
  isOnline: boolean;
}

// NFT Types
export enum NFTType {
  ChessSet = 0,
  ChessBoard = 1,
  ChessPiece = 2,
  Special = 3
}

export enum NFTRarity {
  Common = 0,
  Uncommon = 1,
  Rare = 2,
  Epic = 3,
  Legendary = 4
}

export interface ChessNFT {
  tokenId: string;
  owner: string;
  tokenURI: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

// UI Types
export interface GameUIState {
  selectedSquare: string | null;
  possibleMoves: string[];
  isPlayerTurn: boolean;
  isGameOver: boolean;
  orientation: 'white' | 'black';
}

export interface AppState {
  wallet: WalletConnection | null;
  currentGame: ChessGame | null;
  gameUI: GameUIState;
  isLoading: boolean;
  error: string | null;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type Address = string;
export type TokenAmount = string; 