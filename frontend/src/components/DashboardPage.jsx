import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
    const { user, projects, logout, fetchApplicantProjects, walletAddress, connectAndSetWallet } = useContext(AuthContext);

    useEffect(() => {
        if (walletAddress) {
            fetchApplicantProjects();
        }
    }, [walletAddress, fetchApplicantProjects]); 
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome, {user?.name || 'Applicant'}! 👋
                    </h1>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Your Projects 📊</h2>
                        <Link
                            to="/applicant/submit-project"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg"
                        >
                            + Submit New Project
                        </Link>
                    </div>

                    {}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
                        {walletAddress ? (
                            <div>
                                <p className="text-gray-600">Connected Wallet:</p>
                                <p className="font-mono text-green-600">{walletAddress}</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-600">Please connect your wallet to view and submit projects.</p>
                                <button
                                    onClick={connectAndSetWallet}
                                    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Connect Wallet 🦊
                                </button>
                            </div>
                        )}
                    </div>

                    {}
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                        {projects.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {projects.map((project) => (
                                    <li key={project._id} className="p-4 sm:p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-lg font-semibold text-blue-700">{project.title}</p>
                                                <p className="text-sm text-gray-500 mt-1">Status: <span className="font-medium">{project.status}</span></p>
                                            </div>
                                            <span className="text-gray-800 font-mono">
                                                {project.requestedAmount} ETH
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-12 px-6">
                                <p className="text-gray-500 text-lg">You haven't submitted any projects with this wallet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;