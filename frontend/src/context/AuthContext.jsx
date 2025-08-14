import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { connectWallet } from '../services/wallet.js'; // Make sure to import your wallet service

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const API_URL = 'http://localhost:3001/api';

export const AuthProvider = ({ children }) => {
    // --- Hooks ---
    const navigate = useNavigate();

    // --- State Variables ---
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [walletAddress, setWalletAddress] = useState(null);

    // --- Effects ---
    // This effect handles authentication based on the token
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout(); // Token is expired
                } else {
                    setUser(decoded.user);
                    setIsAuthenticated(true);
                    localStorage.setItem('token', token);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                logout();
            }
        } else {
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoading(false);
    }, [token]);

    // This effect fetches projects whenever the connected wallet changes
    useEffect(() => {
        if (walletAddress) {
            fetchApplicantProjects();
        } else {
            // If wallet disconnects, clear the projects
            setProjects([]);
        }
    }, [walletAddress]);


    // --- Functions ---
   const signup = async (fullName, email, password, role) => {
    try {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Add role to the body
            body: JSON.stringify({ name: fullName, email, password, role }),
        });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Signup failed');
            setToken(data.token);
        } catch (error) {
            alert(error.message);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Login failed');
            setToken(data.token);
        } catch (error) {
            alert(error.message);
        }
    };
    
    const logout = () => {
        setToken(null);
        setWalletAddress(null); // Also clear wallet on logout
        navigate('/applicant');
    };

    const connectAndSetWallet = async () => {
        const result = await connectWallet();
        if (result.status === 'success') {
            setWalletAddress(result.address);
            return result.address;
        } else {
            alert(result.message);
            return null;
        }
    };

    const fetchApplicantProjects = async () => {
        if (!walletAddress) return;
        try {
            const res = await fetch(`${API_URL}/applications/by-applicant/${walletAddress}`);
            if (!res.ok) throw new Error('Failed to fetch projects');
            const projectData = await res.json();
            setProjects(projectData);
        } catch (error) {
            console.error(error);
        }
    };

    const submitProject = async (projectData) => {
        if (!token || !walletAddress) {
            return alert('You must be logged in and have your wallet connected to submit.');
        }
        try {
            const res = await fetch(`${API_URL}/applications`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...projectData, applicantWallet: walletAddress }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.msg || 'Project submission failed');
            }
            // Re-fetch projects and navigate after successful submission
            await fetchApplicantProjects();
            navigate('/applicant/dashboard');
        } catch (error) {
            alert(error.message);
        }
    };
    
    // The value object provided to all child components
    const value = {
        user,
        isAuthenticated,
        loading,
        projects,
        walletAddress,
        login,
        signup,
        logout,
        connectAndSetWallet,
        fetchApplicantProjects,
        submitProject,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};