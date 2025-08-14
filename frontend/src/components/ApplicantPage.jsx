import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginForm = ({ onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login 🚪</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
                        id="password"
                        type="password"
                        placeholder="******************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300"
                        type="submit"
                    >
                        Sign In
                    </button>
                </div>
            </form>
            <p className="text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignup} className="font-bold text-blue-600 hover:text-blue-800">
                    Sign Up
                </button>
            </p>
        </div>
    );
};
const SignupForm = ({ onSwitchToLogin }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('applicant'); // State for the role
    const { signup } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        signup(fullName, email, password, role);
    };

    return (
        <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account 📝</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
                {/* Input for Full Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                        Full Name
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
                        id="fullName"
                        type="text"
                        placeholder="Jane Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="signup-password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
                        id="signup-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
    
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                        Confirm Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700"
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                        I am a...
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="shadow border rounded w-full py-3 px-4 text-gray-700 bg-white leading-tight focus:outline-none focus:shadow-outline"
                    >
                        <option value="applicant">Applicant</option>
                        <option value="funder">Funder</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300"
                        type="submit"
                    >
                        Create Account
                    </button>
                </div>
            </form>
            <p className="text-center text-gray-600 text-sm">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-bold text-blue-600 hover:text-blue-800">
                    Sign In
                </button>
            </p>
        </div>
    );
};

const ApplicantPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const { isAuthenticated, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'funder') {
                navigate('/funder/dashboard');
            } else {
                navigate('/applicant/dashboard');
            }
        }
    }, [isAuthenticated, user, navigate]);
    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
             <div className="absolute top-5 left-5">
                <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">&larr; Back to Home</Link>
            </div>
            {isLoginView ? (
                <LoginForm onSwitchToSignup={() => setIsLoginView(false)} />
            ) : (
                <SignupForm onSwitchToLogin={() => setIsLoginView(true)} />
            )}
        </div>
    );
};

export default ApplicantPage;