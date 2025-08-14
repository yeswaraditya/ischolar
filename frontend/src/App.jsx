import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Import Page Components
import HomePage from './components/HomePage';
import ApplicantPage from './components/ApplicantPage';
import DonorPage from './components/DonorPage';
import DashboardPage from './components/DashboardPage';
import ProjectFormPage from './components/ProjectFormPage';
import FunderDashboard from './components/FunderDashboard';
// Import Context and Protected Route
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './common/ProtectedRoute';

// CORRECT STRUCTURE ✅
function App() {
    return (
        // 1. BrowserRouter now wraps everything, providing routing context.
        <BrowserRouter>
            {/* 2. AuthProvider is now INSIDE the router, so it can use useNavigate. */}
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/donor" element={<DonorPage />} />
                    
                    {/* --- Applicant Portal Routes --- */}
                    <Route path="/applicant" element={<ApplicantPage />} />
                    
                    <Route 
                        path="/applicant/dashboard" 
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/funder/dashboard" 
                        element={
                            <ProtectedRoute>
                                <FunderDashboard />
                            </ProtectedRoute>
                        } 
                    />

                    <Route 
                        path="/applicant/submit-project" 
                        element={
                            <ProtectedRoute>
                                <ProjectFormPage />
                            </ProtectedRoute>
                        } 
                    />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;