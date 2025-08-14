import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProjectFormPage = () => {
    // Get the submitProject function from our context
    const { submitProject } = useContext(AuthContext); 
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [requestedAmount, setRequestedAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const projectData = { title, description, requestedAmount };
        await submitProject(projectData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="mb-4">
                    <Link to="/applicant/dashboard" className="text-blue-600 hover:text-blue-800 font-semibold">&larr; Back to Dashboard</Link>
                </div>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">New Project Application ✍️</h2>
                {/* Ensure the form calls handleSubmit */}
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8">
                    {/* Project Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectTitle">Project Title</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
                            id="projectTitle"
                            type="text"
                            placeholder="e.g., Community Garden Initiative"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    {/* Project Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectDescription">Project Description</label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 h-40"
                            id="projectDescription"
                            placeholder="Provide a detailed explanation of your project..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    {/* Budget renamed to Requested Amount */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="requestedAmount">Requested Amount (ETH)</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
                            id="requestedAmount"
                            type="number"
                            placeholder="5"
                            value={requestedAmount}
                            onChange={(e) => setRequestedAmount(e.target.value)}
                            required
                        />
                    </div>
                    {/* Submit Button */}
                    <div className="flex items-center justify-end">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
                            type="submit"
                        >
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectFormPage;