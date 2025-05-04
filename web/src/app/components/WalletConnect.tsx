'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useState } from 'react';

export function WalletConnect() {
    const { address, isConnected } = useAccount();
    const { connect, error } = useConnect();
    const { disconnect } = useDisconnect();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        try {
            setIsConnecting(true);
            await connect({ connector: injected({ target: 'metaMask' }) });
        } catch (err) {
            console.error('Connection error:', err);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {error && (
                <p className="text-red-500 text-sm">
                    {error.message.includes('user rejected')
                        ? 'Connection rejected by user'
                        : 'Failed to connect to wallet'}
                </p>
            )}
            {!isConnected ? (
                <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className={`px-4 py-2 rounded ${isConnecting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                >
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm text-gray-600">
                        Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                    <button
                        onClick={() => disconnect()}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
} 