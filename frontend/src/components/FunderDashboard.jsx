import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { depositFunds, voteOnProposal } from '../services/wallet.js';

const API_URL = 'http://localhost:3001/api';

const FunderDashboard = () => {
  const { logout, walletAddress, connectAndSetWallet } = useContext(AuthContext);
  const [proposals, setProposals] = useState([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/applications/shortlisted`);
        const data = await res.json();
        setProposals(data);
      } catch (error) {
        console.error("Failed to fetch proposals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!walletAddress) return alert("Please connect your wallet first.");
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      return alert('Please enter a valid amount.');
    }

    const amountInOctas = Math.floor(parseFloat(depositAmount) * 10 ** 8).toString();
    alert(`Depositing ${depositAmount} APT... Please confirm in your wallet.`);

    setTxLoading(true);
    const result = await depositFunds(amountInOctas);
    setTxLoading(false);

    if (result.success) {
      alert('✅ Deposit successful!\nTx Hash: ' + result.hash);
      setDepositAmount('');
    } else {
      console.error(result.error);
      alert('❌ Deposit failed. See console for details.');
    }
  };

  const handleVote = async (proposalId, inFavor) => {
    if (!walletAddress) return alert("Please connect your wallet to vote.");

    alert(`Submitting your vote for proposal #${proposalId}... Please confirm in your wallet.`);
    setTxLoading(true);
    const result = await voteOnProposal(proposalId, inFavor);
    setTxLoading(false);

    if (result.success) {
      alert('✅ Vote cast successfully!');
    } else {
      console.error(result.error);
      alert('❌ Vote failed. See console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Funder Dashboard</h1>
          <div className="flex gap-2 items-center">
            {walletAddress ? (
              <span className="text-sm font-mono bg-gray-200 p-2 rounded-md">
                {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
              </span>
            ) : (
              <button
                onClick={connectAndSetWallet}
                className="mr-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Connect Wallet 🅿️
              </button>
            )}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Deposit Section */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Contribute to Funding Pool</h3>
            <form onSubmit={handleDeposit} className="mt-4">
              <label htmlFor="deposit" className="block text-sm font-medium text-gray-700">
                Amount (APT)
              </label>
              <input
                type="number"
                step="0.01"
                id="deposit"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                placeholder="e.g., 100"
                disabled={txLoading}
              />
              <button
                type="submit"
                disabled={txLoading}
                className={`mt-4 w-full ${
                  txLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white py-2 px-4 rounded-md`}
              >
                {txLoading ? 'Processing...' : 'Deposit Funds'}
              </button>
            </form>
          </div>
        </div>

        {/* Proposals Section */}
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Proposals Awaiting Vote</h3>
          {loading ? (
            <p>Loading proposals...</p>
          ) : proposals.length === 0 ? (
            <p className="text-gray-600">No proposals available for voting.</p>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div key={proposal._id} className="bg-white p-4 rounded-lg shadow">
                  <h4 className="font-bold text-lg text-blue-800">{proposal.title}</h4>
                  <p className="text-gray-600 my-2">{proposal.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-mono text-gray-800">{proposal.requestedAmount} APT</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleVote(proposal.onChainId, true)}
                        disabled={txLoading}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVote(proposal.onChainId, false)}
                        disabled={txLoading}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FunderDashboard;
