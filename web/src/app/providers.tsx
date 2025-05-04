'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';

// Define IOTA EVM Testnet
const iotaTestnet = {
    id: 1075,
    name: 'IOTA EVM Testnet',
    network: 'iota-testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Shimmer',
        symbol: 'SMR',
    },
    rpcUrls: {
        default: { http: ['https://json-rpc.evm.testnet.iotaledger.net'] },
        public: { http: ['https://json-rpc.evm.testnet.iotaledger.net'] },
    },
    blockExplorers: {
        default: { name: 'IOTA EVM Explorer', url: 'https://explorer.evm.testnet.iotaledger.net' },
    },
    testnet: true,
} as const;

const config = createConfig({
    chains: [iotaTestnet],
    connectors: [
        injected({
            target: 'metaMask',
        }),
    ],
    transports: {
        [iotaTestnet.id]: http(),
    },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
} 