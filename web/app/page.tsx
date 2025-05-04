'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getCreditContract, createCreditRecord, getUserRecords, getContractBalance, setupNetwork } from '../utils/creditContract';
import LoanApplicationForm from '../components/LoanApplicationForm';
import LoanStatus from '../components/LoanStatus';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
    const [account, setAccount] = useState<string | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [records, setRecords] = useState<any[]>([]);
    const [balance, setBalance] = useState<string>('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [networkError, setNetworkError] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const connectWallet = async () => {
        try {
            setLoading(true);
            setError(null);
            setNetworkError(null);

            if (!isClient || !window.ethereum) {
                alert('Please install MetaMask to use this application');
                return;
            }

            // Setup IOTA EVM Testnet
            try {
                await setupNetwork();
            } catch (error: any) {
                setNetworkError('Failed to setup IOTA EVM Testnet. Please add it manually in MetaMask.');
                console.error('Network setup error:', error);
            }

            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts && accounts.length > 0) {
                setAccount(accounts[0]);
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contractInstance = await getCreditContract(signer);
                setContract(contractInstance);
            }

        } catch (error: any) {
            console.error('Error connecting wallet:', error);
            setError(error.message || 'Failed to connect wallet. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            if (contract && account) {
                try {
                    setLoading(true);
                    const records = await getUserRecords(contract, account);
                    const balance = await getContractBalance(contract);
                    setRecords(records);
                    setBalance(balance);
                } catch (error: any) {
                    console.error('Error loading data:', error);
                    setError(error.message || 'Failed to load contract data. Please try again.');
                } finally {
                    setLoading(false);
                }
            }
        };

        loadData();
    }, [contract, account]);

    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar account={account} onConnect={connectWallet} />

            <main className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Trustless Credit DAO
                    </h1>
                    <p className="text-xl text-gray-600">
                        Get instant loans with AI-powered credit scoring
                    </p>
                </div>

                {(error || networkError) && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
                        {error || networkError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Apply for a Loan</h2>
                        {!account ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600 mb-4">Please connect your wallet to apply for a loan</p>
                                <button
                                    onClick={connectWallet}
                                    disabled={loading}
                                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Connecting...
                                        </div>
                                    ) : (
                                        'Connect Wallet'
                                    )}
                                </button>
                            </div>
                        ) : contract ? (
                            <LoanApplicationForm
                                contract={contract}
                                onApplicationSubmit={async (amount: number, description: string) => {
                                    try {
                                        setLoading(true);
                                        setError(null);
                                        await createCreditRecord(contract, amount, description);
                                        const updatedRecords = await getUserRecords(contract, account);
                                        setRecords(updatedRecords);
                                    } catch (error: any) {
                                        console.error('Error creating credit record:', error);
                                        setError(error.message || 'Failed to create credit record. Please try again.');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            />
                        ) : (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Your Loan Status</h2>
                        {loading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                        ) : (
                            <LoanStatus
                                loanRequests={records}
                                activeLoans={[]}
                            />
                        )}
                    </div>
                </div>

                <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-4xl mb-4">1</div>
                            <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
                            <p className="text-gray-600">Connect your MetaMask wallet to get started</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">2</div>
                            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
                            <p className="text-gray-600">Our AI analyzes your application for creditworthiness</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">3</div>
                            <h3 className="text-xl font-semibold mb-2">Get Funds</h3>
                            <p className="text-gray-600">Receive your loan directly to your wallet</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}