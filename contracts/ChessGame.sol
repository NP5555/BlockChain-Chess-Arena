// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title ChessGame
 * @dev Smart contract for managing chess games on blockchain
 * @notice Handles game creation, move validation, and reward distribution
 */
contract ChessGame is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    // Game counter for unique game IDs
    Counters.Counter private _gameIds;
    
    // Chess token interface
    IERC20 public chessToken;
    
    // Game states
    enum GameState {
        Waiting,    // Waiting for second player
        Active,     // Game in progress
        Finished,   // Game completed
        Cancelled   // Game cancelled
    }
    
    // Game results
    enum GameResult {
        None,       // Game not finished
        WhiteWins,  // White player wins
        BlackWins,  // Black player wins
        Draw        // Game is a draw
    }
    
    // Game structure
    struct Game {
        uint256 gameId;
        address whitePlayer;
        address blackPlayer;
        GameState state;
        GameResult result;
        uint256 wager;          // Amount wagered by each player
        uint256 startTime;
        uint256 endTime;
        uint256 timeControl;    // Time control in seconds
        string moves;           // Encoded moves string
        bool rewardsClaimed;
    }
    
    // Player statistics
    struct PlayerStats {
        uint256 gamesPlayed;
        uint256 gamesWon;
        uint256 gamesLost;
        uint256 gamesDrawn;
        uint256 totalRewards;
        uint256 rating;
    }
    
    // Mappings
    mapping(uint256 => Game) public games;
    mapping(address => PlayerStats) public playerStats;
    mapping(address => uint256[]) public playerGames;
    mapping(uint256 => bool) public gameExists;
    
    // Events
    event GameCreated(uint256 indexed gameId, address indexed creator, uint256 wager, uint256 timeControl);
    event GameJoined(uint256 indexed gameId, address indexed player);
    event GameStarted(uint256 indexed gameId, address indexed whitePlayer, address indexed blackPlayer);
    event MoveMade(uint256 indexed gameId, address indexed player, string move);
    event GameFinished(uint256 indexed gameId, GameResult result, address winner);
    event RewardsClaimed(uint256 indexed gameId, address indexed player, uint256 amount);
    
    // Configuration
    uint256 public constant MIN_WAGER = 1e18; // 1 CHESS token
    uint256 public constant MAX_WAGER = 1000e18; // 1000 CHESS tokens
    uint256 public constant PLATFORM_FEE = 250; // 2.5% (basis points)
    uint256 public constant WIN_REWARD = 10e18; // 10 CHESS tokens for winning
    uint256 public constant DRAW_REWARD = 5e18; // 5 CHESS tokens for draw
    uint256 public constant PARTICIPATION_REWARD = 1e18; // 1 CHESS token for participation
    
    constructor(address _chessToken) {
        chessToken = IERC20(_chessToken);
    }
    
    /**
     * @dev Create a new chess game
     * @param _wager Amount to wager (0 for free games)
     * @param _timeControl Time control in seconds
     */
    function createGame(uint256 _wager, uint256 _timeControl) external nonReentrant {
        require(_timeControl >= 60, "Time control too short"); // Minimum 1 minute
        require(_timeControl <= 7200, "Time control too long"); // Maximum 2 hours
        
        if (_wager > 0) {
            require(_wager >= MIN_WAGER && _wager <= MAX_WAGER, "Invalid wager amount");
            require(chessToken.transferFrom(msg.sender, address(this), _wager), "Wager transfer failed");
        }
        
        _gameIds.increment();
        uint256 gameId = _gameIds.current();
        
        games[gameId] = Game({
            gameId: gameId,
            whitePlayer: msg.sender,
            blackPlayer: address(0),
            state: GameState.Waiting,
            result: GameResult.None,
            wager: _wager,
            startTime: 0,
            endTime: 0,
            timeControl: _timeControl,
            moves: "",
            rewardsClaimed: false
        });
        
        gameExists[gameId] = true;
        playerGames[msg.sender].push(gameId);
        
        emit GameCreated(gameId, msg.sender, _wager, _timeControl);
    }
    
    /**
     * @dev Join an existing game
     * @param _gameId ID of the game to join
     */
    function joinGame(uint256 _gameId) external nonReentrant {
        require(gameExists[_gameId], "Game does not exist");
        Game storage game = games[_gameId];
        require(game.state == GameState.Waiting, "Game not available");
        require(game.whitePlayer != msg.sender, "Cannot join own game");
        require(game.blackPlayer == address(0), "Game already full");
        
        if (game.wager > 0) {
            require(chessToken.transferFrom(msg.sender, address(this), game.wager), "Wager transfer failed");
        }
        
        game.blackPlayer = msg.sender;
        game.state = GameState.Active;
        game.startTime = block.timestamp;
        
        playerGames[msg.sender].push(_gameId);
        
        emit GameJoined(_gameId, msg.sender);
        emit GameStarted(_gameId, game.whitePlayer, game.blackPlayer);
    }
    
    /**
     * @dev Make a move in the game
     * @param _gameId ID of the game
     * @param _move Move in algebraic notation
     */
    function makeMove(uint256 _gameId, string calldata _move) external {
        require(gameExists[_gameId], "Game does not exist");
        Game storage game = games[_gameId];
        require(game.state == GameState.Active, "Game not active");
        require(msg.sender == game.whitePlayer || msg.sender == game.blackPlayer, "Not a player in this game");
        
        // Update moves string (in production, this would include move validation)
        if (bytes(game.moves).length == 0) {
            game.moves = _move;
        } else {
            game.moves = string(abi.encodePacked(game.moves, ",", _move));
        }
        
        emit MoveMade(_gameId, msg.sender, _move);
    }
    
    /**
     * @dev Finish a game with result
     * @param _gameId ID of the game
     * @param _result Result of the game
     */
    function finishGame(uint256 _gameId, GameResult _result) external {
        require(gameExists[_gameId], "Game does not exist");
        Game storage game = games[_gameId];
        require(game.state == GameState.Active, "Game not active");
        require(msg.sender == game.whitePlayer || msg.sender == game.blackPlayer, "Not a player in this game");
        require(_result != GameResult.None, "Invalid result");
        
        game.state = GameState.Finished;
        game.result = _result;
        game.endTime = block.timestamp;
        
        // Update player statistics
        _updatePlayerStats(game.whitePlayer, _result == GameResult.WhiteWins, _result == GameResult.Draw);
        _updatePlayerStats(game.blackPlayer, _result == GameResult.BlackWins, _result == GameResult.Draw);
        
        address winner = address(0);
        if (_result == GameResult.WhiteWins) {
            winner = game.whitePlayer;
        } else if (_result == GameResult.BlackWins) {
            winner = game.blackPlayer;
        }
        
        emit GameFinished(_gameId, _result, winner);
    }
    
    /**
     * @dev Claim rewards for a finished game
     * @param _gameId ID of the game
     */
    function claimRewards(uint256 _gameId) external nonReentrant {
        require(gameExists[_gameId], "Game does not exist");
        Game storage game = games[_gameId];
        require(game.state == GameState.Finished, "Game not finished");
        require(!game.rewardsClaimed, "Rewards already claimed");
        require(msg.sender == game.whitePlayer || msg.sender == game.blackPlayer, "Not a player in this game");
        
        game.rewardsClaimed = true;
        
        uint256 totalPot = game.wager * 2; // Both players' wagers
        uint256 platformFee = (totalPot * PLATFORM_FEE) / 10000;
        uint256 netPot = totalPot - platformFee;
        
        if (game.result == GameResult.Draw) {
            // Split the pot and give draw rewards
            if (totalPot > 0) {
                uint256 refund = game.wager;
                require(chessToken.transfer(game.whitePlayer, refund), "Refund failed");
                require(chessToken.transfer(game.blackPlayer, refund), "Refund failed");
            }
            
            // Give draw rewards
            require(chessToken.transfer(game.whitePlayer, DRAW_REWARD), "Draw reward failed");
            require(chessToken.transfer(game.blackPlayer, DRAW_REWARD), "Draw reward failed");
            
            playerStats[game.whitePlayer].totalRewards += DRAW_REWARD;
            playerStats[game.blackPlayer].totalRewards += DRAW_REWARD;
            
            emit RewardsClaimed(_gameId, game.whitePlayer, DRAW_REWARD);
            emit RewardsClaimed(_gameId, game.blackPlayer, DRAW_REWARD);
        } else {
            address winner = game.result == GameResult.WhiteWins ? game.whitePlayer : game.blackPlayer;
            address loser = game.result == GameResult.WhiteWins ? game.blackPlayer : game.whitePlayer;
            
            // Winner gets the pot plus win reward
            if (totalPot > 0) {
                require(chessToken.transfer(winner, netPot), "Winner payout failed");
            }
            require(chessToken.transfer(winner, WIN_REWARD), "Win reward failed");
            require(chessToken.transfer(loser, PARTICIPATION_REWARD), "Participation reward failed");
            
            playerStats[winner].totalRewards += (netPot + WIN_REWARD);
            playerStats[loser].totalRewards += PARTICIPATION_REWARD;
            
            emit RewardsClaimed(_gameId, winner, netPot + WIN_REWARD);
            emit RewardsClaimed(_gameId, loser, PARTICIPATION_REWARD);
        }
    }
    
    /**
     * @dev Cancel a waiting game
     * @param _gameId ID of the game to cancel
     */
    function cancelGame(uint256 _gameId) external {
        require(gameExists[_gameId], "Game does not exist");
        Game storage game = games[_gameId];
        require(game.state == GameState.Waiting, "Can only cancel waiting games");
        require(msg.sender == game.whitePlayer, "Only creator can cancel");
        
        game.state = GameState.Cancelled;
        
        // Refund wager if any
        if (game.wager > 0) {
            require(chessToken.transfer(game.whitePlayer, game.wager), "Refund failed");
        }
    }
    
    /**
     * @dev Update player statistics
     */
    function _updatePlayerStats(address player, bool won, bool draw) internal {
        PlayerStats storage stats = playerStats[player];
        stats.gamesPlayed++;
        
        if (won) {
            stats.gamesWon++;
            stats.rating += 10; // Simple rating system
        } else if (draw) {
            stats.gamesDrawn++;
            stats.rating += 5;
        } else {
            stats.gamesLost++;
            if (stats.rating > 5) {
                stats.rating -= 5;
            }
        }
    }
    
    /**
     * @dev Get game details
     */
    function getGame(uint256 _gameId) external view returns (Game memory) {
        require(gameExists[_gameId], "Game does not exist");
        return games[_gameId];
    }
    
    /**
     * @dev Get player's games
     */
    function getPlayerGames(address player) external view returns (uint256[] memory) {
        return playerGames[player];
    }
    
    /**
     * @dev Get current game count
     */
    function getCurrentGameId() external view returns (uint256) {
        return _gameIds.current();
    }
    
    /**
     * @dev Withdraw platform fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = chessToken.balanceOf(address(this));
        require(chessToken.transfer(owner(), balance), "Withdrawal failed");
    }
    
    /**
     * @dev Emergency function to update chess token address
     */
    function updateChessToken(address _newToken) external onlyOwner {
        chessToken = IERC20(_newToken);
    }
} 