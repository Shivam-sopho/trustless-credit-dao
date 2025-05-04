'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { createCreditRecord } from '@/utils/contract';

export function CreateCreditRecord() {
    const { address } = useAccount();
    const [borrower, setBorrower] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) return;

        try {
            setIsLoading(true);
            setError(null);
            setSuccess(null);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const txHash = await createCreditRecord(signer, borrower, amount);
            setSuccess(`Credit record created! Transaction hash: ${txHash}`);
        } catch (err) {
            console.error('Error creating credit record:', err);
            setError(err instanceof Error ? err.message : 'Failed to create credit record');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create Credit Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="borrower" className="block text-sm font-medium text-gray-700">
                        Borrower Address
                    </label>
                    <input
                        type="text"
                        id="borrower"
                        value={borrower}
                        onChange={(e) => setBorrower(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0x..."
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount (SMR)
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0.1"
                        step="0.1"
                        min="0"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
                <button
                    type="submit"
                    disabled={isLoading || !address}
                    className={`w-full py-2 px-4 rounded-md text-white ${isLoading || !address
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                >
                    {isLoading ? 'Creating...' : 'Create Credit Record'}
                </button>
            </form>
        </div>
    );
} 