import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, HTMLMotionProps } from 'framer-motion';
import {
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

import Layout from '@/components/Layout';
import { useWallet } from '@/hooks/useWallet';

// Chess piece types
type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

interface ChessPiece {
  type: PieceType;
  color: PieceColor;
}

interface ChessBoard {
  [key: string]: ChessPiece | null;
}

// Initial chess board setup
const initialBoard: ChessBoard = {
  'a8': { type: 'rook', color: 'black' },
  'b8': { type: 'knight', color: 'black' },
  'c8': { type: 'bishop', color: 'black' },
  'd8': { type: 'queen', color: 'black' },
  'e8': { type: 'king', color: 'black' },
  'f8': { type: 'bishop', color: 'black' },
  'g8': { type: 'knight', color: 'black' },
  'h8': { type: 'rook', color: 'black' },
  'a7': { type: 'pawn', color: 'black' },
  'b7': { type: 'pawn', color: 'black' },
  'c7': { type: 'pawn', color: 'black' },
  'd7': { type: 'pawn', color: 'black' },
  'e7': { type: 'pawn', color: 'black' },
  'f7': { type: 'pawn', color: 'black' },
  'g7': { type: 'pawn', color: 'black' },
  'h7': { type: 'pawn', color: 'black' },
  'a2': { type: 'pawn', color: 'white' },
  'b2': { type: 'pawn', color: 'white' },
  'c2': { type: 'pawn', color: 'white' },
  'd2': { type: 'pawn', color: 'white' },
  'e2': { type: 'pawn', color: 'white' },
  'f2': { type: 'pawn', color: 'white' },
  'g2': { type: 'pawn', color: 'white' },
  'h2': { type: 'pawn', color: 'white' },
  'a1': { type: 'rook', color: 'white' },
  'b1': { type: 'knight', color: 'white' },
  'c1': { type: 'bishop', color: 'white' },
  'd1': { type: 'queen', color: 'white' },
  'e1': { type: 'king', color: 'white' },
  'f1': { type: 'bishop', color: 'white' },
  'g1': { type: 'knight', color: 'white' },
  'h1': { type: 'rook', color: 'white' },
};

// Chess piece Unicode symbols
const pieceSymbols = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

// Mock game data
const mockGame = {
  id: '12345',
  whitePlayer: {
    address: '0x1234...5678',
    username: 'ChessMaster',
    rating: 2450,
    avatar: '👑'
  },
  blackPlayer: {
    address: '0x2345...6789',
    username: 'CryptoKnight',
    rating: 2380,
    avatar: '♞'
  },
  wager: '50',
  timeControl: '10+0',
  status: 'active',
  currentTurn: 'white',
  moves: [] as string[],
  timeLeft: {
    white: 540,
    black: 580
  }
};

// Create properly typed motion components
const MotionDiv = motion.div as any;
const MotionButton = motion.button as any;

export default function GamePage() {
  const router = useRouter();
  const { id, type, mode } = router.query;
  const { wallet } = useWallet();
  const [game, setGame] = useState(mockGame);
  const [board, setBoard] = useState<ChessBoard>(initialBoard);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('white');
  const [gameStatus, setGameStatus] = useState<'active' | 'draw_offered' | 'resigned' | 'draw_accepted' | 'finished'>('active');
  const [drawOfferedBy, setDrawOfferedBy] = useState<PieceColor | null>(null);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [gameResult, setGameResult] = useState<string>('');

  // Update game data based on type
  useEffect(() => {
    if (type) {
      const gameTypeMap: { [key: string]: { timeControl: string; wager: string } } = {
        blitz: { timeControl: '3+0', wager: '5' },
        rapid: { timeControl: '10+0', wager: '10' },
        classical: { timeControl: '30+0', wager: '25' },
        custom: { timeControl: 'Custom', wager: 'Custom' }
      };

      const gameConfig = gameTypeMap[type as string] || gameTypeMap.rapid;
      
      setGame(prev => ({
        ...prev,
        id: id as string,
        timeControl: gameConfig.timeControl,
        wager: gameConfig.wager,
        whitePlayer: {
          ...prev.whitePlayer,
          address: wallet?.address || prev.whitePlayer.address,
          username: wallet?.address ? `Player_${wallet.address.slice(-4)}` : prev.whitePlayer.username
        }
      }));

      // Simulate game start after a short delay
      setTimeout(() => {
        setGameStarted(true);
      }, 1000);
    }
  }, [type, id, wallet]);

  // Basic move validation for pawns (simplified)
  const isValidPawnMove = (from: string, to: string, piece: ChessPiece): boolean => {
    const fromFile = from.charCodeAt(0) - 97; // a=0, b=1, etc.
    const fromRank = parseInt(from[1]) - 1; // 1=0, 2=1, etc.
    const toFile = to.charCodeAt(0) - 97;
    const toRank = parseInt(to[1]) - 1;

    const direction = piece.color === 'white' ? 1 : -1;
    const startRank = piece.color === 'white' ? 1 : 6;

    // Forward move
    if (fromFile === toFile && !board[to]) {
      if (toRank === fromRank + direction) return true;
      if (fromRank === startRank && toRank === fromRank + 2 * direction) return true;
    }

    // Capture move
    if (Math.abs(fromFile - toFile) === 1 && toRank === fromRank + direction && board[to]) {
      return board[to]!.color !== piece.color;
    }

    return false;
  };

  // Basic move validation for other pieces (simplified)
  const isValidMove = (from: string, to: string): boolean => {
    const piece = board[from];
    if (!piece) return false;

    const targetPiece = board[to];
    if (targetPiece && targetPiece.color === piece.color) return false;

    switch (piece.type) {
      case 'pawn':
        return isValidPawnMove(from, to, piece);
      case 'rook':
        return from[0] === to[0] || from[1] === to[1]; // Same file or rank
      case 'bishop':
        return Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === Math.abs(parseInt(from[1]) - parseInt(to[1])); // Diagonal
      case 'queen':
        return (from[0] === to[0] || from[1] === to[1]) || 
               (Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) === Math.abs(parseInt(from[1]) - parseInt(to[1]))); // Rook + Bishop
      case 'king':
        return Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) <= 1 && Math.abs(parseInt(from[1]) - parseInt(to[1])) <= 1; // One square
      case 'knight':
        const fileDiff = Math.abs(from.charCodeAt(0) - to.charCodeAt(0));
        const rankDiff = Math.abs(parseInt(from[1]) - parseInt(to[1]));
        return (fileDiff === 2 && rankDiff === 1) || (fileDiff === 1 && rankDiff === 2); // L-shape
      default:
        return false;
    }
  };

  // Get possible moves for a piece (simplified)
  const getPossibleMoves = (square: string): string[] => {
    const piece = board[square];
    if (!piece || piece.color !== currentTurn) return [];

    const moves: string[] = [];
    
    // Check all squares on the board
    for (let file = 0; file < 8; file++) {
      for (let rank = 1; rank <= 8; rank++) {
        const targetSquare = String.fromCharCode(97 + file) + rank;
        if (targetSquare !== square && isValidMove(square, targetSquare)) {
          moves.push(targetSquare);
        }
      }
    }

    return moves;
  };

  // Handle square click
  const handleSquareClick = (square: string) => {
    if (!gameStarted || gameStatus !== 'active') return;

    const piece = board[square];

    if (selectedSquare) {
      if (selectedSquare === square) {
        // Deselect
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else if (possibleMoves.includes(square)) {
        // Make move
        const newBoard = { ...board };
        newBoard[square] = newBoard[selectedSquare];
        newBoard[selectedSquare] = null;
        
        setBoard(newBoard);
        setSelectedSquare(null);
        setPossibleMoves([]);
        setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
        
        // Add move to game history
        setGame(prev => ({
          ...prev,
          moves: [...prev.moves, `${selectedSquare}-${square}`],
          currentTurn: currentTurn === 'white' ? 'black' : 'white'
        }));
      } else if (piece && piece.color === currentTurn) {
        // Select new piece
        setSelectedSquare(square);
        setPossibleMoves(getPossibleMoves(square));
      } else {
        // Invalid move or wrong color
        setSelectedSquare(null);
        setPossibleMoves([]);
      }
    } else if (piece && piece.color === currentTurn) {
      // Select piece
      setSelectedSquare(square);
      setPossibleMoves(getPossibleMoves(square));
    }
  };

  // Handle draw offer
  const handleOfferDraw = () => {
    if (gameStatus !== 'active') return;
    
    const playerColor = wallet?.address === game.whitePlayer.address ? 'white' : 'black';
    setDrawOfferedBy(playerColor);
    setGameStatus('draw_offered');
    
    // Show notification
    alert(`${playerColor === 'white' ? 'White' : 'Black'} has offered a draw!`);
  };

  // Handle draw acceptance
  const handleAcceptDraw = () => {
    setGameStatus('draw_accepted');
    setGameResult('Game ended in a draw by mutual agreement');
    setShowGameEndModal(true);
  };

  // Handle draw decline
  const handleDeclineDraw = () => {
    setDrawOfferedBy(null);
    setGameStatus('active');
    alert('Draw offer declined. Game continues!');
  };

  // Handle resignation
  const handleResign = () => {
    const playerColor = wallet?.address === game.whitePlayer.address ? 'white' : 'black';
    const winner = playerColor === 'white' ? 'black' : 'white';
    
    if (confirm(`Are you sure you want to resign? This will end the game and ${winner} will win.`)) {
      setGameStatus('resigned');
      setGameResult(`${winner === 'white' ? 'White' : 'Black'} wins by resignation!`);
      setShowGameEndModal(true);
    }
  };

  // Close game end modal and return to play page
  const handleCloseGameEndModal = () => {
    setShowGameEndModal(false);
    router.push('/play');
  };

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if current user is playing
  const isPlayerInGame = wallet && (
    wallet.address === game.whitePlayer.address || 
    wallet.address === game.blackPlayer.address
  );

  const isCurrentPlayerTurn = wallet && (
    (currentTurn === 'white' && wallet.address === game.whitePlayer.address) ||
    (currentTurn === 'black' && wallet.address === game.blackPlayer.address)
  );

  return (
    <Layout>
      <Head>
        <title>Game {id} - BlockChain Chess Arena</title>
        <meta name="description" content="Live chess game on blockchain" />
      </Head>

      <div className="min-h-screen py-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <MotionButton
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push('/play')}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Play
          </MotionButton>

          {/* Game Loading State */}
          {!gameStarted && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="loading-spinner mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {mode === 'create' ? 'Creating Game...' : 'Joining Game...'}
              </h2>
              <p className="text-gray-400">
                {mode === 'create' 
                  ? 'Setting up your game room and waiting for an opponent'
                  : 'Connecting to the game and loading board state'
                }
              </p>
            </MotionDiv>
          )}

          {gameStarted && (
            <div className="grid lg:grid-cols-3 gap-8">
            {/* Game Board */}
            <div className="lg:col-span-2">
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-2xl"
              >
                {/* Turn Indicator */}
                <div className="mb-6 text-center">
                  <div className={`inline-flex items-center px-6 py-3 rounded-xl shadow-lg border-2 transition-all duration-300 ${
                    currentTurn === 'white' 
                      ? 'bg-gradient-to-r from-white to-gray-100 text-gray-800 border-gray-300 shadow-white/20' 
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-600 shadow-black/40'
                  }`}>
                    <span className="text-3xl mr-3 animate-pulse">
                      {currentTurn === 'white' ? '♔' : '♚'}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-bold text-lg">
                        {currentTurn === 'white' ? 'White' : 'Black'}
                      </span>
                      <span className="text-sm opacity-80">
                        to move
                      </span>
                    </div>
                  </div>
                </div>

                <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 shadow-2xl">
                  {/* Chess Board */}
                  <div className="w-full h-full grid grid-cols-8 gap-0 rounded-xl overflow-hidden border-4 border-amber-900 shadow-inner">
                    {Array.from({ length: 64 }, (_, i) => {
                      const row = Math.floor(i / 8);
                      const col = i % 8;
                      const isLight = (row + col) % 2 === 0;
                      const square = String.fromCharCode(97 + col) + (8 - row);
                      const piece = board[square];
                      const isSelected = selectedSquare === square;
                      const isPossibleMove = possibleMoves.includes(square);
                      
                      return (
                        <div
                          key={i}
                          className={`chess-square aspect-square flex items-center justify-center text-4xl md:text-5xl cursor-pointer transition-all duration-300 relative group ${
                            isLight 
                              ? 'bg-gradient-to-br from-amber-50 to-amber-100' 
                              : 'bg-gradient-to-br from-amber-800 to-amber-900'
                          } ${isSelected ? 'ring-4 ring-blue-400 bg-blue-100 shadow-lg scale-105' : ''} ${
                            isPossibleMove && !piece ? 'possible-move ring-2 ring-green-400' : ''
                          } ${
                            isPossibleMove && piece ? 'capture-move ring-2 ring-red-400' : ''
                          } hover:shadow-lg hover:scale-105 hover:z-10`}
                          onClick={() => handleSquareClick(square)}
                        >
                          {/* Coordinate labels */}
                          {col === 0 && (
                            <div className={`absolute top-1 left-1 text-xs font-bold ${
                              isLight ? 'text-amber-800' : 'text-amber-200'
                            }`}>
                              {8 - row}
                            </div>
                          )}
                          {row === 7 && (
                            <div className={`absolute bottom-1 right-1 text-xs font-bold ${
                              isLight ? 'text-amber-800' : 'text-amber-200'
                            }`}>
                              {String.fromCharCode(97 + col)}
                            </div>
                          )}
                          
                          {/* Possible move indicator */}
                          {isPossibleMove && !piece && (
                            <div className="w-6 h-6 bg-green-400 rounded-full opacity-70 shadow-lg animate-pulse"></div>
                          )}
                          
                          {/* Attack indicator for captures */}
                          {isPossibleMove && piece && (
                            <div className="absolute inset-0 bg-red-400 opacity-30 rounded-sm animate-pulse"></div>
                          )}
                          
                          {/* Chess piece */}
                          {piece && (
                            <span className={`chess-piece select-none ${piece.color} ${
                              piece.color === currentTurn 
                                ? 'filter brightness-110 scale-110' 
                                : 'opacity-90 filter brightness-95'
                            } ${isSelected ? 'selected animate-bounce' : ''}`}>
                              {pieceSymbols[piece.color][piece.type]}
                            </span>
                          )}
                          
                          {/* Hover effect */}
                          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Board border decoration */}
                  <div className="absolute inset-0 rounded-xl border-2 border-amber-600 pointer-events-none"></div>
                </div>

                {/* Game Controls */}
                <div className="mt-6 space-y-4">
                  {/* Game Status */}
                  <div className={`text-center py-4 px-6 rounded-xl border-2 transition-all duration-300 ${
                    gameStatus === 'active' && isCurrentPlayerTurn 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 text-green-300 shadow-lg shadow-green-500/20' 
                      : gameStatus === 'draw_offered'
                      ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-400/50 text-yellow-300 shadow-lg shadow-yellow-500/20'
                      : gameStatus === 'resigned' || gameStatus === 'draw_accepted'
                      ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-400/50 text-red-300 shadow-lg shadow-red-500/20'
                      : 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-400/50 text-gray-400 shadow-lg shadow-gray-500/20'
                  }`}>
                    <div className="flex items-center justify-center space-x-2">
                      {gameStatus === 'draw_offered' ? (
                        <>
                          <span className="text-2xl animate-pulse">🤝</span>
                          <span className="font-bold text-lg">
                            {drawOfferedBy === 'white' ? 'White' : 'Black'} offered a draw!
                          </span>
                        </>
                      ) : gameStatus === 'resigned' ? (
                        <>
                          <span className="text-2xl">🏳️</span>
                          <span className="font-bold text-lg">Game Over - Resignation</span>
                        </>
                      ) : gameStatus === 'draw_accepted' ? (
                        <>
                          <span className="text-2xl">🤝</span>
                          <span className="font-bold text-lg">Game Over - Draw</span>
                        </>
                      ) : isCurrentPlayerTurn ? (
                        <>
                          <span className="text-2xl animate-bounce">⚡</span>
                          <span className="font-bold text-lg">Your Turn - Make a Move!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl animate-spin">⏳</span>
                          <span className="font-semibold">Waiting for Opponent...</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Draw Offer Response */}
                  {gameStatus === 'draw_offered' && drawOfferedBy !== (wallet?.address === game.whitePlayer.address ? 'white' : 'black') && (
                    <div className="flex gap-3">
                      <button 
                        onClick={handleAcceptDraw}
                        className="btn-success flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                      >
                        ✅ Accept Draw
                      </button>
                      <button 
                        onClick={handleDeclineDraw}
                        className="btn-danger flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                      >
                        ❌ Decline Draw
                      </button>
                    </div>
                  )}
                  
                  {/* Regular Game Controls */}
                  {isPlayerInGame && gameStatus === 'active' && (
                    <div className="flex gap-3">
                      <button 
                        onClick={handleOfferDraw}
                        className="btn-secondary flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                        disabled={drawOfferedBy !== null}
                      >
                        🤝 Offer Draw
                      </button>
                      <button 
                        onClick={handleResign}
                        className="btn-danger flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                      >
                        🏳️ Resign
                      </button>
                    </div>
                  )}
                  
                  {/* Game Over Message */}
                  {(gameStatus === 'resigned' || gameStatus === 'draw_accepted') && (
                    <div className="text-center">
                      <button 
                        onClick={handleCloseGameEndModal}
                        className="btn-primary py-3 px-6 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                      >
                        🏠 Return to Play
                      </button>
                    </div>
                  )}
                </div>
              </MotionDiv>
            </div>

            {/* Game Info */}
            <div className="space-y-6">
              {/* Players */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <h3 className="text-lg font-bold text-white mb-4">Players</h3>
                
                {/* White Player */}
                <div className={`flex items-center justify-between p-3 rounded-lg mb-3 ${
                  currentTurn === 'white' ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{game.whitePlayer.avatar}</div>
                    <div>
                      <div className="text-white font-semibold">{game.whitePlayer.username}</div>
                      <div className="text-gray-400 text-sm">Rating: {game.whitePlayer.rating}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-mono">{formatTime(game.timeLeft.white)}</div>
                    <div className="text-gray-400 text-xs">White</div>
                  </div>
                </div>

                {/* Black Player */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  currentTurn === 'black' ? 'bg-green-500/20 border border-green-500/30' : 'bg-white/5'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{game.blackPlayer.avatar}</div>
                    <div>
                      <div className="text-white font-semibold">{game.blackPlayer.username}</div>
                      <div className="text-gray-400 text-sm">Rating: {game.blackPlayer.rating}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-mono">{formatTime(game.timeLeft.black)}</div>
                    <div className="text-gray-400 text-xs">Black</div>
                  </div>
                </div>
              </MotionDiv>

              {/* Game Info */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <h3 className="text-lg font-bold text-white mb-4">Game Info</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Game ID:</span>
                    <span className="text-white font-mono">{game.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Time Control:</span>
                    <span className="text-white">{game.timeControl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wager:</span>
                    <span className="text-yellow-400 font-semibold">{game.wager} CHESS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`capitalize font-semibold ${
                      gameStatus === 'active' ? 'text-green-400' :
                      gameStatus === 'draw_offered' ? 'text-yellow-400' :
                      gameStatus === 'draw_accepted' ? 'text-blue-400' :
                      gameStatus === 'resigned' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {gameStatus === 'draw_offered' ? 'Draw Offered' :
                       gameStatus === 'draw_accepted' ? 'Draw Accepted' :
                       gameStatus === 'resigned' ? 'Resigned' :
                       gameStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Turn:</span>
                    <span className="text-white capitalize">{currentTurn}</span>
                  </div>
                </div>
              </MotionDiv>

              {/* Move History */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h3 className="text-lg font-bold text-white mb-4">Move History</h3>
                
                <div className="max-h-64 overflow-y-auto">
                  {game.moves.length > 0 ? (
                    <div className="space-y-1 text-sm">
                      {game.moves.map((move, index) => (
                        <div key={index} className="flex items-center">
                          <span className="text-gray-400 w-8">{index + 1}.</span>
                          <span className="text-white font-mono">{move}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm text-center py-4">
                      No moves yet. Game just started!
                    </p>
                  )}
                </div>
              </MotionDiv>

              {/* Game Instructions */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                className="card"
              >
                <h3 className="text-lg font-bold text-white mb-4">How to Play</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>• Click on a piece to select it</p>
                  <p>• Green dots show possible moves</p>
                  <p>• Click on a highlighted square to move</p>
                  <p>• You can only move pieces of your color</p>
                  <p>• Take turns with your opponent</p>
                </div>
              </MotionDiv>

              {/* Spectator Info */}
              {!isPlayerInGame && (
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card text-center"
                >
                  <UserIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-white mb-2">Spectating</h3>
                  <p className="text-gray-400 text-sm">
                    You are watching this game as a spectator
                  </p>
                </MotionDiv>
              )}
            </div>
            </div>
          )}

          {/* Game End Modal */}
          {showGameEndModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <MotionDiv
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              >
                <div className="text-6xl mb-4">
                  {gameStatus === 'draw_accepted' ? '🤝' : '🏆'}
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Game Over!
                </h2>
                <p className="text-gray-300 mb-6 text-lg">
                  {gameResult}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleCloseGameEndModal}
                    className="btn-primary w-full py-3 px-6 rounded-xl font-semibold"
                  >
                    🏠 Return to Play
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary w-full py-3 px-6 rounded-xl font-semibold"
                  >
                    🔄 Play Again
                  </button>
                </div>
              </MotionDiv>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 