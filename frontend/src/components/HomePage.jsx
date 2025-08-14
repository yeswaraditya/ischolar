import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connectWallet } from '../services/wallet';

const HomePage = () => {
    const [walletAddress, setWalletAddress] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const handleConnectWallet = async () => {
        setErrorMessage('');
        const result = await connectWallet();
        if (result.status === 'success') {
            setWalletAddress(result.address);
        } else {
            alert(result.message);
            setErrorMessage(result.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center text-center p-4">
            {/* Header with navigation */}
            <header className="absolute top-0 right-0 p-6 flex items-center space-x-6">
                <Link to="/applicant" className="text-lg font-medium text-gray-300 hover:text-white transition">
                    Applicant Login
                </Link>
                <Link to="/donor" className="text-lg font-medium text-gray-300 hover:text-white transition">
                    Funder Dashboard
                </Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
                    GitHub
                </a>
            </header>

            <main className="flex flex-col items-center">
                <h1 className="text-6xl md:text-8xl font-bold mb-4">
                    Welcome to <span className="text-cyan-400">AI-DeFund</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 mb-10">
                    The future of decentralized project funding.
                </p>

                {}
                {walletAddress ? (
                    <div className="bg-gray-800 border border-cyan-400 rounded-lg px-6 py-3">
                        <p className="text-lg">
                            Connected: <span className="font-mono text-cyan-300">{`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}</span>
                        </p>
                    </div>
                ) : (
                    <button
                        onClick={handleConnectWallet}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xl py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Connect Wallet 🦊
                    </button>
                )}

                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
            </main>
        </div>
    );
};

export default HomePage;