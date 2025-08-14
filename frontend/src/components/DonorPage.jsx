// In frontend/src/components/DonorPage.jsx
import React from 'react'; // <-- ADD THIS LINE
import FunderDashboard from './FunderDashboard';
import ProposalList from './ProposalList';
import { Link } from 'react-router-dom';

function DonorPage() {
    return (
        <div className="p-8 bg-gray-900 min-h-screen text-white">
            <Link to="/" className="text-indigo-400 hover:underline mb-8 block">&larr; Back to Home</Link>
            <h1 className="text-4xl font-bold mb-8 text-center">Donor Dashboard</h1>
            <FunderDashboard />
            <hr className="my-12 border-gray-700" />
            <ProposalList />
        </div>
    );
}

export default DonorPage;