const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chess-arena');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Game state management
const activeGames = new Map();
const waitingPlayers = new Set();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔗 User connected: ${socket.id}`);

  // Join game room
  socket.on('join-game', (gameId) => {
    socket.join(gameId);
    console.log(`🎮 User ${socket.id} joined game ${gameId}`);
  });

  // Handle chess moves
  socket.on('make-move', (data) => {
    const { gameId, move, fen } = data;
    
    // Broadcast move to other players in the game
    socket.to(gameId).emit('move-made', {
      move,
      fen,
      player: socket.id
    });
    
    console.log(`♟️ Move made in game ${gameId}:`, move);
  });

  // Handle game creation
  socket.on('create-game', (gameData) => {
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    activeGames.set(gameId, {
      id: gameId,
      creator: socket.id,
      opponent: null,
      state: 'waiting',
      ...gameData
    });
    
    socket.join(gameId);
    socket.emit('game-created', { gameId });
    
    console.log(`🆕 Game created: ${gameId}`);
  });

  // Handle joining existing game
  socket.on('join-existing-game', (gameId) => {
    const game = activeGames.get(gameId);
    
    if (game && game.state === 'waiting' && game.creator !== socket.id) {
      game.opponent = socket.id;
      game.state = 'active';
      
      socket.join(gameId);
      
      // Notify both players
      io.to(gameId).emit('game-started', {
        gameId,
        whitePlayer: game.creator,
        blackPlayer: socket.id
      });
      
      console.log(`🚀 Game started: ${gameId}`);
    } else {
      socket.emit('join-failed', { reason: 'Game not available' });
    }
  });

  // Handle matchmaking
  socket.on('find-match', (playerData) => {
    if (waitingPlayers.size > 0) {
      // Match with waiting player
      const opponent = waitingPlayers.values().next().value;
      waitingPlayers.delete(opponent);
      
      const gameId = `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      activeGames.set(gameId, {
        id: gameId,
        creator: opponent,
        opponent: socket.id,
        state: 'active'
      });
      
      // Join both players to the game room
      socket.join(gameId);
      io.sockets.sockets.get(opponent)?.join(gameId);
      
      // Notify both players
      io.to(gameId).emit('match-found', {
        gameId,
        whitePlayer: opponent,
        blackPlayer: socket.id
      });
      
      console.log(`🎯 Match found: ${gameId}`);
    } else {
      // Add to waiting list
      waitingPlayers.add(socket.id);
      socket.emit('waiting-for-match');
      console.log(`⏳ Player ${socket.id} waiting for match`);
    }
  });

  // Handle game end
  socket.on('game-end', (data) => {
    const { gameId, result, winner } = data;
    
    // Broadcast game end to all players in the game
    io.to(gameId).emit('game-ended', {
      result,
      winner
    });
    
    // Clean up game state
    activeGames.delete(gameId);
    
    console.log(`🏁 Game ended: ${gameId}, Result: ${result}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
    
    // Remove from waiting players
    waitingPlayers.delete(socket.id);
    
    // Handle active games
    for (const [gameId, game] of activeGames.entries()) {
      if (game.creator === socket.id || game.opponent === socket.id) {
        // Notify other player about disconnection
        socket.to(gameId).emit('player-disconnected');
        
        // Clean up game if both players are gone
        activeGames.delete(gameId);
        console.log(`🧹 Cleaned up game: ${gameId}`);
      }
    }
  });
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/stats', (req, res) => {
  res.json({
    activeGames: activeGames.size,
    waitingPlayers: waitingPlayers.size,
    connectedUsers: io.engine.clientsCount
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;

const startServer = async () => {
  await connectDB();
  
  server.listen(PORT, () => {
    console.log('🚀 BlockChain Chess Arena Server Started');
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log('='.repeat(50));
  });
};

startServer().catch(console.error); 