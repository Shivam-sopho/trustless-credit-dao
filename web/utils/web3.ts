import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
    supportedChainIds: [1075] // IOTA EVM Testnet chain ID
});

export const addIotaNetwork = async () => {
    try {
        await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: '0x433', // 1075 in hex
                chainName: 'IOTA EVM Testnet',
                nativeCurrency: {
                    name: 'SMR',
                    symbol: 'SMR',
                    decimals: 18
                },
                rpcUrls: ['https://json-rpc.evm.testnet.iotaledger.net'],
                blockExplorerUrls: ['https://explorer.evm.testnet.iotaledger.net']
            }]
        });
    } catch (error) {
        console.error('Error adding IOTA network:', error);
        throw error;
    }
}; 