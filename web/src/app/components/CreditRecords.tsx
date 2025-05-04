'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { CreditRecord, getCreditRecords, closeCreditRecord } from '@/utils/contract';

export function CreditRecords() {
    const { address } = useAccount();
    const [records, setRecords] = useState<CreditRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadRecords = async () => {
        if (!address) return;

        try {
            setIsLoading(true);
            setError(null);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const records = await getCreditRecords(signer);
            setRecords(records);
        } catch (err) {
            console.error('Error loading credit records:', err);
            setError(err instanceof Error ? err.message : 'Failed to load credit records');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseRecord = async (id: number) => {
        if (!address) return;

        try {
            setIsLoading(true);
            setError(null);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const txHash = await closeCreditRecord(signer, id);
            await loadRecords(); // Reload records after closing
        } catch (err) {
            console.error('Error closing credit record:', err);
            setError(err instanceof Error ? err.message : 'Failed to close credit record');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRecords();
    }, [address]);

    if (!address) {
        return <p className="text-gray-500">Please connect your wallet to view credit records.</p>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Credit Records</h2>
                <button
                    onClick={loadRecords}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                    Refresh
                </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {isLoading ? (
                <p className="text-gray-500">Loading records...</p>
            ) : records.length === 0 ? (
                <p className="text-gray-500">No credit records found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Borrower
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {records.map((record) => (
                                <tr key={record.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.borrower.slice(0, 6)}...{record.borrower.slice(-4)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.lender.slice(0, 6)}...{record.lender.slice(-4)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.amount} SMR
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Open'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(record.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.status === 'Open' && record.lender === address && (
                                            <button
                                                onClick={() => handleCloseRecord(record.id)}
                                                disabled={isLoading}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Close
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
} 