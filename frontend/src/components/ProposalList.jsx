// In frontend/src/components/ProposalList.jsx
import React, { useState, useEffect } from 'react'; // <-- ADD THIS LINE
import axios from 'axios';
import { voteOnProposal, tallyVotesOnChain } from '../services/wallet';

function ProposalList() {
    const [proposals, setProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchProposals = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:3001/api/applications/shortlisted');
            setProposals(response.data);
        } catch (error) {
            console.error("Failed to fetch proposals", error);
            setMessage("Could not load proposals.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProposals();
    }, []);

    const handleVote = async (proposalId, voteChoice) => {
        setMessage(`Casting vote...`);
        const result = await voteOnProposal(proposalId, voteChoice);
        if (result.success) {
            setMessage(`Vote successful!`);
            fetchProposals(); // Refresh list after voting
        } else {
            setMessage('Vote failed.');
        }
    };

    const handleTally = async (proposalId) => {
        setMessage(`Tallying votes...`);
        try {
            await tallyVotesOnChain(proposalId);
            setMessage('Votes tallied successfully!');
            fetchProposals(); // Refresh list
        // eslint-disable-next-line no-unused-vars
        } catch(error) {
            setMessage('Tallying failed.');
        }
    };

    if (isLoading) return <p className="text-center text-gray-400">Loading proposals...</p>;

    return (
        <div className="proposal-list">
            <h2 className="text-3xl font-semibold mb-6 text-center">Proposals Awaiting Vote</h2>
            {message && <p className="message text-center mb-4">{message}</p>}
            
            <div className="space-y-6 max-w-2xl mx-auto">
                {proposals.length === 0 ? (
                    <p className="text-center text-gray-500">No proposals are currently awaiting a vote.</p>
                ) : (
                    proposals.map(p => (
                        <div key={p._id} className="proposal-card bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-cyan-400 mb-2">{p.title}</h3>
                            <p className="text-gray-300 mb-4">{p.description}</p>
                            <small className="block text-gray-500 mb-4">Applicant: {p.applicantWallet}</small>
                            <div className="ai-summary bg-gray-700 p-3 rounded mb-4">
                                <strong className="text-white">AI Score:</strong>
                                <span className="ml-2 text-gray-300">Novelty - {p.aiEvaluation.novelty}, Feasibility - {p.aiEvaluation.feasibility}</span>
                            </div>
                            <div className="vote-buttons flex space-x-4">
                                <button onClick={() => handleVote(p._id, true)} className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded font-bold">Vote For</button>
                                <button onClick={() => handleVote(p._id, false)} className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded font-bold">Vote Against</button>
                                <button onClick={() => handleTally(p._id)} className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded font-bold">Tally Votes</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ProposalList;