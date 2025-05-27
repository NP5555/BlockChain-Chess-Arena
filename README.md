# 🏆 BlockChain Chess Arena

**A Decentralized, Play-to-Earn Chess Platform on Blockchain**

*"Play Chess. Earn Crypto. Outsmart Your Opponent."*

## 🚀 Features

- ✅ **Play-to-Earn (P2E) Model** – Players earn crypto points/tokens for victories
- ✅ **Provably Fair System** – Every move is recorded on-chain, preventing cheating
- ✅ **NFT Chess Boards & Pieces** – Customizable, tradable in-game assets
- ✅ **Smooth, Lag-Free Experience** – Optimized for fast, real-time gameplay
- ✅ **Web3 Authentication** – Sign in via MetaMask, WalletConnect
- ✅ **Real-Time Multiplayer** – Live chess matches with WebSocket technology

## 🛠 Technology Stack

### Blockchain & Smart Contracts
- **Ethereum/Polygon** (Solidity)
- **Smart Contracts** for game logic and rewards
- **NFT Support** (ERC-721 tokens)

### Frontend
- **Next.js + TypeScript**
- **React** with modern hooks
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Web3.js/Ethers.js** for blockchain interactions

### Backend
- **Node.js + Express**
- **Socket.io** for real-time gameplay
- **MongoDB** for user data
- **IPFS** for NFT metadata storage

## 🏗 Project Structure

```
blockchain-chess-arena/
├── contracts/              # Smart contracts (Solidity)
├── pages/                  # Next.js pages
├── components/             # React components
├── server/                 # Backend server
├── styles/                 # CSS and styling
├── utils/                  # Utility functions
├── hooks/                  # Custom React hooks
├── store/                  # State management
├── types/                  # TypeScript definitions
└── public/                 # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or Web3 wallet
- MongoDB (for development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd blockchain-chess-arena
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Compile smart contracts**
```bash
npm run compile
```

5. **Start the development server**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:server
```

6. **Open your browser**
Navigate to `http://localhost:3000`

## 🎮 How to Play

1. **Connect Wallet** - Use MetaMask or WalletConnect
2. **Find Opponent** - Join matchmaking or challenge a friend
3. **Play Chess** - Make moves in real-time
4. **Earn Rewards** - Win games to earn $CHESS tokens
5. **Customize** - Buy/trade NFT chess pieces and boards

## 🏆 Game Modes

- **Blitz** (3+0, 5+0) - Fast-paced games
- **Rapid** (10+0, 15+10) - Standard games
- **Custom** - Set your own time controls
- **Tournament** - Compete for prize pools

## 💰 Tokenomics

- **$CHESS Token** - Main reward currency
- **Win Rewards** - Earn tokens for victories
- **Leaderboard Bonuses** - Top players get extra rewards
- **NFT Trading** - Buy/sell custom chess sets

## 🔧 Development

### Smart Contract Development
```bash
# Compile contracts
npm run compile

# Run tests
npm run test

# Deploy to testnet
npm run deploy
```

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Backend Development
```bash
# Start backend server
npm run server

# Start with auto-reload
npm run dev:server
```

## 🌐 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy to Vercel
```

### Smart Contracts (Polygon)
```bash
# Configure hardhat.config.js for Polygon
npm run deploy -- --network polygon
```

### Backend (AWS/Railway)
```bash
# Build and deploy backend server
npm run server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🔗 Links

- **Website**: [Coming Soon]
- **Discord**: [Coming Soon]
- **Twitter**: [Coming Soon]
- **Documentation**: [Coming Soon]

---

**Built with ❤️ by the BlockChain Chess Arena Team** 