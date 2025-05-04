'use client';

import { useState } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { toast } from 'react-hot-toast';
import { CreditRecordABI } from '../utils/contract';

export function CreateCreditRecord() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!amount || !description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await writeContract({
        address: '0x024DfB6842Ea9674743977019665d092C2476864',
        abi: CreditRecordABI,
        functionName: 'createCreditRecord',
        args: [BigInt(amount), description],
        value: BigInt(amount),
      });

      toast.success('Credit record created successfully!');
    } catch (error) {
      console.error('Error creating credit record:', error);
      toast.error('Failed to create credit record. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Credit Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (SMR)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter amount in SMR"
            required
            disabled={isPending}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter description"
            required
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white ${isPending
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          disabled={isPending || !isConnected}
        >
          {isPending ? 'Creating...' : 'Create Record'}
        </button>
        {!isConnected && (
          <p className="text-sm text-red-600 text-center">
            Please connect your wallet to create a record
          </p>
        )}
      </form>
    </div>
  );
} 