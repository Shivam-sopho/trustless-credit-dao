'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Web3ContextType {
    account: string | null;
    connect: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
    account: null,
    connect: async () => { },
});

export function useWeb3() {
    return useContext(Web3Context);
}

export default function Web3Provider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<string | null>(null);

    const connect = async () => {
        try {
            if (typeof window === 'undefined' || !window.ethereum) {
                alert('Please install MetaMask to use this application');
                return;
            }

            // Direct connection request
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts && accounts.length > 0) {
                setAccount(accounts[0]);
            }

        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet. Please try again.');
        }
    };

    return (
        <Web3Context.Provider value={{ account, connect }}>
            {children}
        </Web3Context.Provider>
    );
} 