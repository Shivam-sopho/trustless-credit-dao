import React from 'react';
import { ethers } from 'ethers';

interface NavbarProps {
    account: string | null;
    onConnect: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ account, onConnect }) => {
    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-blue-600">Trustless Credit DAO</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        {account ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700">{formatAddress(account)}</span>
                            </div>
                        ) : (
                            <button
                                onClick={onConnect}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                            >
                                Connect Wallet
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 