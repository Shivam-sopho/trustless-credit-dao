'use client';

import { useAccount, useReadContract } from 'wagmi';
import { CreditRecordABI } from '../utils/contract';

export function CreditRecordList() {
    const { address, isConnected } = useAccount();

    const { data: records, isLoading } = useReadContract({
        address: '0x024DfB6842Ea9674743977019665d092C2476864',
        abi: CreditRecordABI,
        functionName: 'getCreditRecords',
        args: [address],
        query: {
            enabled: Boolean(address),
            refetchInterval: 5000, // Refetch every 5 seconds
        },
    });

    if (!isConnected) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Credit Records</h2>
                <p className="text-gray-600">Please connect your wallet to view your credit records</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Credit Records</h2>
                <p className="text-gray-600">Loading records...</p>
            </div>
        );
    }

    if (!records || records.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Credit Records</h2>
                <p className="text-gray-600">No credit records found</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Credit Records</h2>
            <div className="space-y-4">
                {records.map((record, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Amount</p>
                                <p className="font-medium">{record.amount.toString()} SMR</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-medium">
                                    {new Date(Number(record.timestamp) * 1000).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">Description</p>
                            <p className="font-medium">{record.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 