// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ChessNFT
 * @dev NFT contract for chess pieces and boards
 * @notice Allows players to own, trade, and customize their chess experience
 */
contract ChessNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    IERC20 public chessToken;
    
    // NFT Categories
    enum NFTType {
        ChessSet,    // Complete chess set (pieces + board)
        ChessBoard,  // Board only
        ChessPiece,  // Individual piece
        Special      // Special/Limited edition items
    }
    
    // Rarity levels
    enum Rarity {
        Common,      // 60% - Basic designs
        Uncommon,    // 25% - Enhanced designs
        Rare,        // 10% - Premium designs
        Epic,        // 4% - Exclusive designs
        Legendary    // 1% - Ultra rare designs
    }
    
    // NFT Metadata
    struct ChessNFTMetadata {
        NFTType nftType;
        Rarity rarity;
        string name;
        string description;
        uint256 mintPrice;
        bool isForSale;
        uint256 salePrice;
        address creator;
        uint256 createdAt;
        uint256 lastSalePrice;
        uint256 totalSales;
    }
    
    // Mappings
    mapping(uint256 => ChessNFTMetadata) public nftMetadata;
    mapping(address => uint256[]) public userNFTs;
    mapping(NFTType => uint256[]) public nftsByType;
    mapping(Rarity => uint256[]) public nftsByRarity;
    mapping(uint256 => bool) public isMarketplaceListed;
    
    // Marketplace
    struct MarketplaceListing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        uint256 listedAt;
    }
    
    mapping(uint256 => MarketplaceListing) public marketplaceListings;
    uint256[] public activeListings;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed to, NFTType nftType, Rarity rarity, uint256 price);
    event NFTListedForSale(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event NFTRemovedFromSale(uint256 indexed tokenId, address indexed owner);
    
    // Configuration
    uint256 public constant MARKETPLACE_FEE = 250; // 2.5% (basis points)
    uint256 public constant CREATOR_ROYALTY = 500; // 5% (basis points)
    
    // Mint prices by rarity (in CHESS tokens)
    mapping(Rarity => uint256) public mintPrices;
    
    constructor(address _chessToken) ERC721("Chess Arena NFT", "CNFT") {
        chessToken = IERC20(_chessToken);
        
        // Set initial mint prices (18 decimals for CHESS token)
        mintPrices[Rarity.Common] = 10 * 10**18;      // 10 CHESS
        mintPrices[Rarity.Uncommon] = 25 * 10**18;    // 25 CHESS
        mintPrices[Rarity.Rare] = 50 * 10**18;        // 50 CHESS
        mintPrices[Rarity.Epic] = 100 * 10**18;       // 100 CHESS
        mintPrices[Rarity.Legendary] = 250 * 10**18;  // 250 CHESS
    }
    
    /**
     * @dev Mint a new chess NFT
     * @param to Address to mint the NFT to
     * @param nftType Type of NFT (ChessSet, ChessBoard, etc.)
     * @param rarity Rarity level of the NFT
     * @param name Name of the NFT
     * @param description Description of the NFT
     * @param tokenURI IPFS URI for the NFT metadata
     */
    function mintNFT(
        address to,
        NFTType nftType,
        Rarity rarity,
        string memory name,
        string memory description,
        string memory tokenURI
    ) external nonReentrant {
        require(to != address(0), "Cannot mint to zero address");
        
        uint256 mintPrice = mintPrices[rarity];
        require(chessToken.transferFrom(msg.sender, address(this), mintPrice), "Payment failed");
        
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        // Set metadata
        nftMetadata[tokenId] = ChessNFTMetadata({
            nftType: nftType,
            rarity: rarity,
            name: name,
            description: description,
            mintPrice: mintPrice,
            isForSale: false,
            salePrice: 0,
            creator: msg.sender,
            createdAt: block.timestamp,
            lastSalePrice: 0,
            totalSales: 0
        });
        
        // Update indexes
        userNFTs[to].push(tokenId);
        nftsByType[nftType].push(tokenId);
        nftsByRarity[rarity].push(tokenId);
        
        emit NFTMinted(tokenId, to, nftType, rarity, mintPrice);
    }
    
    /**
     * @dev List NFT for sale on marketplace
     * @param tokenId ID of the NFT to list
     * @param price Sale price in CHESS tokens
     */
    function listForSale(uint256 tokenId, uint256 price) external {
        require(_exists(tokenId), "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");
        require(!isMarketplaceListed[tokenId], "Already listed");
        
        nftMetadata[tokenId].isForSale = true;
        nftMetadata[tokenId].salePrice = price;
        
        marketplaceListings[tokenId] = MarketplaceListing({
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            listedAt: block.timestamp
        });
        
        isMarketplaceListed[tokenId] = true;
        activeListings.push(tokenId);
        
        emit NFTListedForSale(tokenId, msg.sender, price);
    }
    
    /**
     * @dev Buy NFT from marketplace
     * @param tokenId ID of the NFT to buy
     */
    function buyNFT(uint256 tokenId) external nonReentrant {
        require(_exists(tokenId), "NFT does not exist");
        require(isMarketplaceListed[tokenId], "NFT not for sale");
        
        MarketplaceListing storage listing = marketplaceListings[tokenId];
        require(listing.isActive, "Listing not active");
        require(listing.seller != msg.sender, "Cannot buy own NFT");
        
        uint256 price = listing.price;
        address seller = listing.seller;
        address creator = nftMetadata[tokenId].creator;
        
        // Calculate fees
        uint256 marketplaceFee = (price * MARKETPLACE_FEE) / 10000;
        uint256 creatorRoyalty = (price * CREATOR_ROYALTY) / 10000;
        uint256 sellerAmount = price - marketplaceFee - creatorRoyalty;
        
        // Transfer payment
        require(chessToken.transferFrom(msg.sender, seller, sellerAmount), "Payment to seller failed");
        require(chessToken.transferFrom(msg.sender, owner(), marketplaceFee), "Marketplace fee failed");
        require(chessToken.transferFrom(msg.sender, creator, creatorRoyalty), "Creator royalty failed");
        
        // Transfer NFT
        _transfer(seller, msg.sender, tokenId);
        
        // Update metadata
        nftMetadata[tokenId].isForSale = false;
        nftMetadata[tokenId].salePrice = 0;
        nftMetadata[tokenId].lastSalePrice = price;
        nftMetadata[tokenId].totalSales++;
        
        // Remove from marketplace
        listing.isActive = false;
        isMarketplaceListed[tokenId] = false;
        _removeFromActiveListings(tokenId);
        
        // Update user NFTs
        _removeFromUserNFTs(seller, tokenId);
        userNFTs[msg.sender].push(tokenId);
        
        emit NFTSold(tokenId, seller, msg.sender, price);
    }
    
    /**
     * @dev Remove NFT from sale
     * @param tokenId ID of the NFT to remove from sale
     */
    function removeFromSale(uint256 tokenId) external {
        require(_exists(tokenId), "NFT does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(isMarketplaceListed[tokenId], "NFT not listed");
        
        nftMetadata[tokenId].isForSale = false;
        nftMetadata[tokenId].salePrice = 0;
        
        marketplaceListings[tokenId].isActive = false;
        isMarketplaceListed[tokenId] = false;
        _removeFromActiveListings(tokenId);
        
        emit NFTRemovedFromSale(tokenId, msg.sender);
    }
    
    /**
     * @dev Get NFTs owned by a user
     * @param user Address of the user
     */
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }
    
    /**
     * @dev Get NFTs by type
     * @param nftType Type of NFTs to retrieve
     */
    function getNFTsByType(NFTType nftType) external view returns (uint256[] memory) {
        return nftsByType[nftType];
    }
    
    /**
     * @dev Get NFTs by rarity
     * @param rarity Rarity level of NFTs to retrieve
     */
    function getNFTsByRarity(Rarity rarity) external view returns (uint256[] memory) {
        return nftsByRarity[rarity];
    }
    
    /**
     * @dev Get active marketplace listings
     */
    function getActiveListings() external view returns (uint256[] memory) {
        return activeListings;
    }
    
    /**
     * @dev Get marketplace listing details
     * @param tokenId ID of the NFT
     */
    function getListingDetails(uint256 tokenId) external view returns (MarketplaceListing memory) {
        return marketplaceListings[tokenId];
    }
    
    /**
     * @dev Update mint prices (owner only)
     * @param rarity Rarity level to update
     * @param newPrice New mint price
     */
    function updateMintPrice(Rarity rarity, uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be greater than 0");
        mintPrices[rarity] = newPrice;
    }
    
    /**
     * @dev Withdraw accumulated fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = chessToken.balanceOf(address(this));
        require(chessToken.transfer(owner(), balance), "Withdrawal failed");
    }
    
    /**
     * @dev Remove token ID from user's NFT list
     */
    function _removeFromUserNFTs(address user, uint256 tokenId) internal {
        uint256[] storage userTokens = userNFTs[user];
        for (uint256 i = 0; i < userTokens.length; i++) {
            if (userTokens[i] == tokenId) {
                userTokens[i] = userTokens[userTokens.length - 1];
                userTokens.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Remove token ID from active listings
     */
    function _removeFromActiveListings(uint256 tokenId) internal {
        for (uint256 i = 0; i < activeListings.length; i++) {
            if (activeListings[i] == tokenId) {
                activeListings[i] = activeListings[activeListings.length - 1];
                activeListings.pop();
                break;
            }
        }
    }
    
    /**
     * @dev Override transfer to update user NFT lists
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        if (from != address(0) && to != address(0)) {
            _removeFromUserNFTs(from, tokenId);
            userNFTs[to].push(tokenId);
        }
    }
    
    /**
     * @dev Override burn to clean up metadata
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete nftMetadata[tokenId];
    }
    
    /**
     * @dev Override tokenURI
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
    
    /**
     * @dev Override supportsInterface
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 