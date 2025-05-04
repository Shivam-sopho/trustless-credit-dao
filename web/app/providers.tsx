'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { metaMask } from 'wagmi/connectors';
import { iotaTestnet } from 'viem/chains';

const config = createConfig({
    chains: [iotaTestnet],
    connectors: [metaMask()],
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