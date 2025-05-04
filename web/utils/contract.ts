import { ethers } from 'ethers';
import LoanSystem from '../../artifacts/contracts/LoanSystem.sol/LoanSystem.json';

export const getContract = async () => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return new ethers.Contract(
            process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
            LoanSystem.abi,
            signer
        );
    } catch (error) {
        console.error('Error getting contract:', error);
        throw error;
    }
};

export const getLoanRequests = async (contract: ethers.Contract | null, address: string) => {
    try {
        if (!contract) {
            console.error('Contract not initialized');
            return [];
        }
        return await contract.getLoanRequests(address);
    } catch (error) {
        console.error('Error getting loan requests:', error);
        return [];
    }
};

export const getActiveLoans = async (contract: ethers.Contract | null, address: string) => {
    try {
        if (!contract) {
            console.error('Contract not initialized');
            return [];
        }
        return await contract.getActiveLoans(address);
    } catch (error) {
        console.error('Error getting active loans:', error);
        return [];
    }
};

export const repayLoan = async (contract: ethers.Contract | null, loanId: number, amount: string) => {
    try {
        if (!contract) {
            console.error('Contract not initialized');
            return null;
        }
        const tx = await contract.repayLoan(loanId, {
            value: ethers.parseEther(amount)
        });
        return await tx.wait();
    } catch (error) {
        console.error('Error repaying loan:', error);
        return null;
    }
}; 