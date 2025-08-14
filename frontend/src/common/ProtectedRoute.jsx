import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        // If user is not authenticated, redirect to the applicant login page
        return <Navigate to="/applicant" replace />;
    }

    // If authenticated, render the child component (the protected page)
    return children;
};

export default ProtectedRoute;