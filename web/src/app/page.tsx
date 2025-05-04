import { CreateCreditRecord } from './components/CreateCreditRecord';
import { CreditRecords } from './components/CreditRecords';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome to Trustless Credit DAO
        </h1>
        <p className="text-gray-600">
          Create and manage credit records on the IOTA EVM Testnet. Connect your wallet to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <CreateCreditRecord />
        <CreditRecords />
        </div>
    </div>
  );
}
