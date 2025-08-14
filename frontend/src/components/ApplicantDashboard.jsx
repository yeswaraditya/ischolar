import React from 'react';
import { useNavigate } from 'react-router-dom';

const dummyProjects = [
  { id: 1, title: 'Eco-Friendly Water Filter', status: 'Approved' },
  { id: 2, title: 'Community Garden Initiative', status: 'In Review' },
  { id: 3, title: 'AI-Powered Literacy App', status: 'Submitted' },
];

const statusStyles = {
  Approved: 'bg-green-100 text-green-800',
  'In Review': 'bg-yellow-100 text-yellow-800',
  Submitted: 'bg-blue-100 text-blue-800',
};

const ApplicantDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl p-4 mx-auto my-10 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, Applicant!</h1>
          <button onClick={() => navigate('/submit-project')} className="px-4 py-2 font-bold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors">
            + Submit New Project
          </button>
        </header>
        <main>
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">Your Submissions</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Project Title</th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dummyProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{project.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[project.status]}`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicantDashboard;