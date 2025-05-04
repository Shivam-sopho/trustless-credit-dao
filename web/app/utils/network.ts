export const IOTA_TESTNET = {
    chainId: '0x433', // 1075 in hex
    chainName: 'IOTA EVM Testnet',
    nativeCurrency: {
        name: 'Shimmer',
        symbol: 'SMR',
        decimals: 18,
    },
    rpcUrls: ['https://json-rpc.evm.testnet.iotaledger.net'],
    blockExplorerUrls: ['https://explorer.evm.testnet.iotaledger.net'],
};

export async function addIotaTestnet() {
    if (!window.ethereum) {
        console.error('MetaMask is not installed');
        return false;
    }

    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [IOTA_TESTNET],
        });
        return true;
    } catch (error) {
        console.error('Error adding IOTA testnet:', error);
        return false;
    }
} 