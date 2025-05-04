'use client';

import { useAccount, useReadContract } from 'wagmi';
import { CreditRecordABI } from '../utils/contract';

export function CreditRecords() {
    const { address } = useAccount();
    const { data: records, isLoading } = useReadContract({
        address: '0x38E4204798650643572acE8bDd1936c6666991ef', // Replace with your contract address
        abi: CreditRecordABI,
        functionName: 'getCreditRecords',
        args: [address],
    });

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Credit Records</h2>
                <p>Loading records...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Credit Records</h2>
            {records && records.length > 0 ? (
                <div className="space-y-4">
                    {records.map((record: any, index: number) => (
                        <div key={index} className="border-b pb-4">
                            <p className="font-medium">Amount: {record.amount.toString()}</p>
                            <p className="text-gray-600">Description: {record.description}</p>
                            <p className="text-sm text-gray-500">
                                Created: {new Date(Number(record.timestamp) * 1000).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No credit records found.</p>
            )}
        </div>
    );
} 