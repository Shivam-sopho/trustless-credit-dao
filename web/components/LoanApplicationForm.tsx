import React, { useState } from 'react';
import { ethers } from 'ethers';

interface LoanApplicationFormProps {
    contract: ethers.Contract;
    onApplicationSubmit: (amount: number, description: string) => Promise<void>;
}

export default function LoanApplicationForm({ contract, onApplicationSubmit }: LoanApplicationFormProps) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            if (!amount || !description) {
                throw new Error('Please fill in all fields');
            }

            const amountNumber = Number(amount);
            if (isNaN(amountNumber) || amountNumber <= 0) {
                throw new Error('Please enter a valid amount');
            }

            await onApplicationSubmit(amountNumber, description);
            setAmount('');
            setDescription('');
        } catch (error: any) {
            console.error('Error submitting application:', error);
            setError(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Loan Amount (ETH)
                </label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.000000000000000001"
                    placeholder="Enter amount in ETH"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    required
                    placeholder="Enter loan purpose"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                    </div>
                ) : (
                    'Submit Application'
                )}
            </button>
        </form>
    );
} 