require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
    solidity: "0.8.20",
    networks: {
        iotaTestnet: {
            url: "https://json-rpc.evm.testnet.iotaledger.net",
            chainId: 1075,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
}; 