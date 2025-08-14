// In smart-contracts/hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // To load environment variables

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // Ensure this matches your pragma version
  networks: {
     hardhat: {
    chainId: 1337
  },
  localhost: {
    url: "http://127.0.0.1:8546", 
    chainId: 1337
  },
   
    sepolia: {
      url: process.env.RPC_URL, 
      accounts: [process.env.SERVER_WALLET_PRIVATE_KEY], 
    },
  },
};