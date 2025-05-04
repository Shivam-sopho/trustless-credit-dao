'use client';

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract, getLoanRequests, getActiveLoans } from '../web/utils/contract';
import LoanApplicationForm from '../web/components/LoanApplicationForm';
import LoanStatus from '../web/components/LoanStatus';
import Navbar from '../web/components/Navbar';
import Footer from '../web/components/Footer';

export default function Home() {
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [account, setAccount] = useState<string | null>(null);
    const [loanRequests, setLoanRequests] = useState<any[]>([]);
    const [activeLoans, setActiveLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                if (typeof window.ethereum !== 'undefined') {
                    const contract = await getContract();
                    setContract(contract);

                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts[0]);

                    if (accounts[0]) {
                        const requests = await getLoanRequests(contract, accounts[0]);
                        const loans = await getActiveLoans(contract, accounts[0]);
                        setLoanRequests(requests);
                        setActiveLoans(loans);
                    }
                }
            } catch (error) {
                console.error('Error initializing:', error);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    const handleApplicationSubmit = async (data: any) => {
        if (contract && account) {
            const requests = await getLoanRequests(contract, account);
            const loans = await getActiveLoans(contract, account);
            setLoanRequests(requests);
            setActiveLoans(loans);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar account={account} />

            <main className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Trustless Credit DAO
                    </h1>
                    <p className="text-xl text-gray-600">
                        Get instant loans with AI-powered credit scoring
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Apply for a Loan</h2>
                        {contract && (
                            <LoanApplicationForm
                                contract={contract}
                                onApplicationSubmit={handleApplicationSubmit}
                            />
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
                                loanRequests={loanRequests}
                                activeLoans={activeLoans}
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
                            <p className="text-gray-600">Connect your MetaMask or Firefly wallet to get started</p>
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