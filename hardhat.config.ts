import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
  networks: {
        iotaTestnet: {
            url: process.env.IOTA_RPC_URL || "https://json-rpc.evm.testnet.iotaledger.net",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: parseInt(process.env.CHAIN_ID || "1075"),
            gas: parseInt(process.env.GAS_LIMIT || "5000000"),
            gasPrice: parseInt(process.env.GAS_PRICE || "10000000000"), // 10 gwei
            gasMultiplier: parseFloat(process.env.GAS_MULTIPLIER || "1.2"),
    },
    },
    etherscan: {
        apiKey: {
            iotaTestnet: "your-api-key", // Not needed for IOTA EVM Testnet
        },
        customChains: [
            {
                network: "iotaTestnet",
                chainId: parseInt(process.env.CHAIN_ID || "1075"),
                urls: {
                    apiURL: "https://explorer.evm.testnet.iotaledger.net/api",
                    browserURL: "https://explorer.evm.testnet.iotaledger.net",
                },
            },
        ],
  },
};

export default config; 