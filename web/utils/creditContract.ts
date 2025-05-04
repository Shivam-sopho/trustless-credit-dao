import { ethers } from 'ethers';

// IOTA EVM Testnet configuration
const IOTA_EVM_TESTNET = {
    chainId: 1075,
    rpcUrl: 'https://evm.wasp.sc.iota.org',
    name: 'IOTA EVM Testnet',
    currency: 'IOTA',
    explorer: 'https://explorer.wasp.sc.iota.org'
};

const CREDIT_CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS'; // Replace with your deployed contract address

const CreditRecordABI = [
    "function createCreditRecord(uint256 amount, string memory description) public payable",
    "function getCreditRecords(address user) public view returns (tuple(uint256 amount, string description, uint256 timestamp, address creator)[])",
    "function getContractBalance() public view returns (uint256)",
    "function withdraw() public"
];

export const getCreditContract = async (signer: ethers.Signer) => {
    if (!CREDIT_CONTRACT_ADDRESS || CREDIT_CONTRACT_ADDRESS === '0xYOUR_DEPLOYED_CONTRACT_ADDRESS') {
        throw new Error('Contract address not set. Please update CREDIT_CONTRACT_ADDRESS in creditContract.ts');
    }
    return new ethers.Contract(CREDIT_CONTRACT_ADDRESS, CreditRecordABI, signer);
};

export const createCreditRecord = async (
    contract: ethers.Contract,
    amount: number,
    description: string
) => {
    try {
        const tx = await contract.createCreditRecord(amount, description, {
            value: ethers.parseEther('0.01'), // Adjust this value as needed
        });
        const receipt = await tx.wait();
        return receipt;
    } catch (error: any) {
        console.error('Error creating credit record:', error);
        throw new Error(error.reason || error.message || 'Failed to create credit record');
    }
};

export const getUserRecords = async (
    contract: ethers.Contract,
    userAddress: string
) => {
    try {
        const records = await contract.getCreditRecords(userAddress);
        return records.map((record: any) => ({
            amount: Number(record.amount),
            description: record.description,
            timestamp: new Date(Number(record.timestamp) * 1000).toLocaleString(),
            creator: record.creator,
        }));
    } catch (error: any) {
        console.error('Error getting user records:', error);
        throw new Error(error.reason || error.message || 'Failed to get user records');
    }
};

export const getContractBalance = async (contract: ethers.Contract) => {
    try {
        const balance = await contract.getContractBalance();
        return ethers.formatEther(balance);
    } catch (error: any) {
        console.error('Error getting contract balance:', error);
        throw new Error(error.reason || error.message || 'Failed to get contract balance');
    }
};

export const withdrawFunds = async (contract: ethers.Contract) => {
    try {
        const tx = await contract.withdraw();
        const receipt = await tx.wait();
        return receipt;
    } catch (error: any) {
        console.error('Error withdrawing funds:', error);
        throw new Error(error.reason || error.message || 'Failed to withdraw funds');
    }
};

export const setupNetwork = async () => {
    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }

    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: `0x${IOTA_EVM_TESTNET.chainId.toString(16)}`,
                chainName: IOTA_EVM_TESTNET.name,
                nativeCurrency: {
                    name: IOTA_EVM_TESTNET.currency,
                    symbol: IOTA_EVM_TESTNET.currency,
                    decimals: 18
                },
                rpcUrls: [IOTA_EVM_TESTNET.rpcUrl],
                blockExplorerUrls: [IOTA_EVM_TESTNET.explorer]
            }]
        });
    } catch (error: any) {
        if (error.code !== 4001) { // User rejected the request
            console.error('Error setting up network:', error);
            throw new Error('Failed to setup IOTA EVM Testnet');
        }
    }
}; 