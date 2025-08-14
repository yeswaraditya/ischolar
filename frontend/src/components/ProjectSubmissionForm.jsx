// src/components/ProjectSubmissionForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const ProjectSubmissionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const allProjects = JSON.parse(localStorage.getItem('projects')) || [];
    
    const newProject = {
      id: Date.now(), 
      userEmail: currentUser.email,
      title,
      description,
      status: 'Submitted', 
    };

    allProjects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(allProjects));
    
    alert('Project submitted successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">Submit Your Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Project Title</label>
            <input
              type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Project Description</label>
            <textarea
              id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="5"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex items-center justify-end space-x-4">
            <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectSubmissionForm;
