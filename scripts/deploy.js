const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting BlockChain Chess Arena deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());
  console.log("");

  try {
    // 1. Deploy Chess Token
    console.log("🪙 Deploying Chess Token...");
    const ChessToken = await ethers.getContractFactory("ChessToken");
    const chessToken = await ChessToken.deploy();
    await chessToken.deployed();
    console.log("✅ Chess Token deployed to:", chessToken.address);
    console.log("");

    // 2. Deploy Chess Game Contract
    console.log("♟️  Deploying Chess Game Contract...");
    const ChessGame = await ethers.getContractFactory("ChessGame");
    const chessGame = await ChessGame.deploy(chessToken.address);
    await chessGame.deployed();
    console.log("✅ Chess Game Contract deployed to:", chessGame.address);
    console.log("");

    // 3. Deploy Chess NFT Contract
    console.log("🎨 Deploying Chess NFT Contract...");
    const ChessNFT = await ethers.getContractFactory("ChessNFT");
    const chessNFT = await ChessNFT.deploy(chessToken.address);
    await chessNFT.deployed();
    console.log("✅ Chess NFT Contract deployed to:", chessNFT.address);
    console.log("");

    // 4. Configure contracts
    console.log("⚙️  Configuring contracts...");
    
    // Add game contract as authorized minter for rewards
    console.log("🔗 Adding game contract as authorized game contract...");
    await chessToken.addGameContract(chessGame.address);
    console.log("✅ Game contract authorized");

    // Transfer some tokens to game contract for rewards
    const rewardPool = ethers.utils.parseEther("10000000"); // 10M tokens for rewards
    console.log("💰 Transferring reward pool to game contract...");
    await chessToken.transfer(chessGame.address, rewardPool);
    console.log("✅ Reward pool transferred");

    console.log("");
    console.log("🎉 Deployment completed successfully!");
    console.log("");
    console.log("📋 Contract Addresses:");
    console.log("=".repeat(50));
    console.log("🪙 Chess Token:", chessToken.address);
    console.log("♟️  Chess Game:", chessGame.address);
    console.log("🎨 Chess NFT:", chessNFT.address);
    console.log("=".repeat(50));
    console.log("");

    // 5. Verify token info
    console.log("📊 Token Information:");
    const tokenInfo = await chessToken.getTokenInfo();
    console.log("- Total Supply:", ethers.utils.formatEther(tokenInfo.currentSupply), "CHESS");
    console.log("- Max Supply:", ethers.utils.formatEther(tokenInfo.maxSupply), "CHESS");
    console.log("- Daily Mint Limit:", ethers.utils.formatEther(tokenInfo.dailyMintLimit), "CHESS");
    console.log("");

    // 6. Save deployment info
    const deploymentInfo = {
      network: await ethers.provider.getNetwork(),
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        ChessToken: {
          address: chessToken.address,
          name: "Chess Arena Token",
          symbol: "CHESS"
        },
        ChessGame: {
          address: chessGame.address,
          name: "Chess Game Contract"
        },
        ChessNFT: {
          address: chessNFT.address,
          name: "Chess Arena NFT",
          symbol: "CNFT"
        }
      },
      configuration: {
        rewardPoolTransferred: ethers.utils.formatEther(rewardPool),
        gameContractAuthorized: true
      }
    };

    console.log("💾 Deployment info saved");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // 7. Instructions for next steps
    console.log("");
    console.log("🔧 Next Steps:");
    console.log("1. Update .env.local with contract addresses");
    console.log("2. Verify contracts on block explorer");
    console.log("3. Start the frontend application");
    console.log("4. Test the application with MetaMask");
    console.log("");
    console.log("🌐 Environment Variables to Update:");
    console.log(`NEXT_PUBLIC_CHESS_TOKEN_ADDRESS=${chessToken.address}`);
    console.log(`NEXT_PUBLIC_CHESS_GAME_ADDRESS=${chessGame.address}`);
    console.log(`NEXT_PUBLIC_CHESS_NFT_ADDRESS=${chessNFT.address}`);
    console.log("");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment script failed:", error);
    process.exit(1);
  }); 