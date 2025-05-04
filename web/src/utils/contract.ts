import { ethers } from 'ethers';
import { TrustlessCredit } from '../artifacts/contracts/TrustlessCredit.sol/TrustlessCredit.json';

export const CONTRACT_ADDRESS = '0xE136f1a0b6daf85f7E89b1737461E1B1C169591f';

export interface CreditRecord {
    id: number;
    borrower: string;
    lender: string;
    amount: string;
    status: 'Open' | 'Closed';
    timestamp: number;
}

export async function getContract(signer: ethers.Signer) {
    return new ethers.Contract(
        CONTRACT_ADDRESS,
        TrustlessCredit.abi,
        signer
    );
}

export async function createCreditRecord(
    signer: ethers.Signer,
    borrower: string,
    amount: string
) {
    const contract = await getContract(signer);
    const tx = await contract.createCreditRecord(borrower, ethers.parseEther(amount));
    await tx.wait();
    return tx.hash;
}

export async function getCreditRecords(signer: ethers.Signer): Promise<CreditRecord[]> {
    const contract = await getContract(signer);
    const records = await contract.getCreditRecords();

    return records.map((record: any) => ({
        id: Number(record.id),
        borrower: record.borrower,
        lender: record.lender,
        amount: ethers.formatEther(record.amount),
        status: record.status === 0 ? 'Open' : 'Closed',
        timestamp: Number(record.timestamp) * 1000, // Convert to milliseconds
    }));
}

export async function closeCreditRecord(signer: ethers.Signer, id: number) {
    const contract = await getContract(signer);
    const tx = await contract.closeCreditRecord(id);
    await tx.wait();
    return tx.hash;
} 