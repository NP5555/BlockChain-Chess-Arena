// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title ChessToken
 * @dev ERC20 token for the BlockChain Chess Arena
 * @notice CHESS token used for rewards, wagering, and governance
 */
contract ChessToken is ERC20, ERC20Burnable, Ownable, Pausable {
    
    // Token configuration
    uint256 public constant INITIAL_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant MAX_SUPPLY = 10_000_000_000 * 10**18; // 10 billion tokens max
    
    // Minting limits
    uint256 public constant DAILY_MINT_LIMIT = 1_000_000 * 10**18; // 1 million tokens per day
    uint256 public lastMintTime;
    uint256 public dailyMintedAmount;
    
    // Roles
    mapping(address => bool) public minters;
    mapping(address => bool) public gameContracts;
    
    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event GameContractAdded(address indexed gameContract);
    event GameContractRemoved(address indexed gameContract);
    event TokensMinted(address indexed to, uint256 amount, string reason);
    
    modifier onlyMinter() {
        require(minters[msg.sender] || owner() == msg.sender, "Not authorized to mint");
        _;
    }
    
    modifier onlyGameContract() {
        require(gameContracts[msg.sender], "Not authorized game contract");
        _;
    }
    
    constructor() ERC20("Chess Arena Token", "CHESS") {
        _mint(msg.sender, INITIAL_SUPPLY);
        lastMintTime = block.timestamp;
    }
    
    /**
     * @dev Mint tokens with daily limit check
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint
     * @param reason Reason for minting (for transparency)
     */
    function mint(address to, uint256 amount, string calldata reason) external onlyMinter whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        
        // Reset daily counter if a new day has started
        if (block.timestamp >= lastMintTime + 1 days) {
            dailyMintedAmount = 0;
            lastMintTime = block.timestamp;
        }
        
        require(dailyMintedAmount + amount <= DAILY_MINT_LIMIT, "Would exceed daily mint limit");
        
        dailyMintedAmount += amount;
        _mint(to, amount);
        
        emit TokensMinted(to, amount, reason);
    }
    
    /**
     * @dev Mint rewards for game winners (called by game contracts)
     * @param to Address to mint rewards to
     * @param amount Amount of reward tokens
     */
    function mintReward(address to, uint256 amount) external onlyGameContract whenNotPaused {
        require(to != address(0), "Cannot mint to zero address");
        require(amount > 0, "Amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed max supply");
        
        _mint(to, amount);
        emit TokensMinted(to, amount, "Game Reward");
    }
    
    /**
     * @dev Add a minter address
     * @param minter Address to add as minter
     */
    function addMinter(address minter) external onlyOwner {
        require(minter != address(0), "Cannot add zero address as minter");
        require(!minters[minter], "Address is already a minter");
        
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Remove a minter address
     * @param minter Address to remove from minters
     */
    function removeMinter(address minter) external onlyOwner {
        require(minters[minter], "Address is not a minter");
        
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    /**
     * @dev Add a game contract address
     * @param gameContract Address to add as authorized game contract
     */
    function addGameContract(address gameContract) external onlyOwner {
        require(gameContract != address(0), "Cannot add zero address as game contract");
        require(!gameContracts[gameContract], "Address is already a game contract");
        
        gameContracts[gameContract] = true;
        emit GameContractAdded(gameContract);
    }
    
    /**
     * @dev Remove a game contract address
     * @param gameContract Address to remove from game contracts
     */
    function removeGameContract(address gameContract) external onlyOwner {
        require(gameContracts[gameContract], "Address is not a game contract");
        
        gameContracts[gameContract] = false;
        emit GameContractRemoved(gameContract);
    }
    
    /**
     * @dev Pause token transfers (emergency function)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override transfer to add pause functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Airdrop tokens to multiple addresses
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts to send to each recipient
     */
    function airdrop(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length <= 200, "Too many recipients"); // Gas limit protection
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Would exceed max supply");
        require(balanceOf(msg.sender) >= totalAmount, "Insufficient balance for airdrop");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Cannot send to zero address");
            _transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Get remaining daily mint allowance
     */
    function getRemainingDailyMintAllowance() external view returns (uint256) {
        if (block.timestamp >= lastMintTime + 1 days) {
            return DAILY_MINT_LIMIT;
        }
        return DAILY_MINT_LIMIT - dailyMintedAmount;
    }
    
    /**
     * @dev Check if address is authorized minter
     */
    function isMinter(address account) external view returns (bool) {
        return minters[account] || owner() == account;
    }
    
    /**
     * @dev Check if address is authorized game contract
     */
    function isGameContract(address account) external view returns (bool) {
        return gameContracts[account];
    }
    
    /**
     * @dev Get token information
     */
    function getTokenInfo() external view returns (
        uint256 currentSupply,
        uint256 maxSupply,
        uint256 remainingSupply,
        uint256 dailyMintLimit,
        uint256 remainingDailyMint
    ) {
        currentSupply = totalSupply();
        maxSupply = MAX_SUPPLY;
        remainingSupply = MAX_SUPPLY - currentSupply;
        dailyMintLimit = DAILY_MINT_LIMIT;
        
        if (block.timestamp >= lastMintTime + 1 days) {
            remainingDailyMint = DAILY_MINT_LIMIT;
        } else {
            remainingDailyMint = DAILY_MINT_LIMIT - dailyMintedAmount;
        }
    }
} 