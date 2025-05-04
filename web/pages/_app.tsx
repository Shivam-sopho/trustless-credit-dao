import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import type { AppProps } from 'next/app';

function getLibrary(provider: any) {
    return new ethers.BrowserProvider(provider);
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Component {...pageProps} />
        </Web3ReactProvider>
    );
} 