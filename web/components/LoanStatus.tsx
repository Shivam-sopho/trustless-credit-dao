import React from 'react';
import { ethers } from 'ethers';

interface Record {
    amount: number;
    description: string;
    timestamp: string;
    creator: string;
}

interface LoanStatusProps {
    loanRequests: Record[];
    activeLoans: any[];
}

const LoanStatus: React.FC<LoanStatusProps> = ({ loanRequests, activeLoans }) => {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const formatAmount = (amount: string) => {
        return ethers.formatEther(amount);
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Credit Records</h3>
                {loanRequests.length === 0 ? (
                    <p className="text-gray-500">No credit records found.</p>
                ) : (
                    <div className="space-y-4">
                        {loanRequests.map((record, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Amount: {record.amount} ETH
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {record.description}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            {record.timestamp}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Created by: {record.creator.slice(0, 6)}...{record.creator.slice(-4)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Active Loans */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Active Loans</h3>
                {activeLoans.length === 0 ? (
                    <p className="text-gray-500">No active loans</p>
                ) : (
                    <div className="space-y-4">
                        {activeLoans.map((loan, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{formatAmount(loan.amount)} SMR</p>
                                        <p className="text-sm text-gray-500">
                                            Due: {formatDate(loan.dueTime)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            Interest: {loan.interestRate}%
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Credit Score: {loan.creditScore}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Loan Requests */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Loan Requests</h3>
                {loanRequests.length === 0 ? (
                    <p className="text-gray-500">No loan requests</p>
                ) : (
                    <div className="space-y-4">
                        {loanRequests.map((request, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{formatAmount(request.amount)} SMR</p>
                                        <p className="text-sm text-gray-500">
                                            Purpose: {request.purpose}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            Status: {request.isApproved ? 'Approved' : 'Pending'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Credit Score: {request.creditScore}
                                        </p>
                                    </div>
                                </div>
                                {request.aiReasoning && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        <p className="font-semibold">AI Analysis:</p>
                                        <p>{request.aiReasoning}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanStatus; 