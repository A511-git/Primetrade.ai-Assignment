import React, { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../services/api';

// --- 2. AUTH FORMS (Login/Register) ---
const AuthForm = ({ view, setView }) => {
    const { handleAuthSuccess, handleMessage } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const isLogin = view === 'login';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        handleMessage({ type: 'clear' });

        const endpoint = isLogin ? '/users/login' : '/users/register';
        const payload = isLogin 
            ? { email, password }
            : { email, password, username, fullName };

        try {
            await apiFetch(endpoint, { method: 'POST', body: payload });
            handleMessage({ type: 'success', text: isLogin ? 'Login successful!' : 'Registration successful! Please log in.' });
            
            if (isLogin) {
                handleAuthSuccess();
            } else {
                setView('login');
            }
        } catch (error) {
            handleMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    const buttonText = isLogin ? 'Log In' : 'Register Account';

    return (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800">
                {isLogin ? <LogIn className="inline mr-2 h-7 w-7 text-indigo-600" /> : <UserPlus className="inline mr-2 h-7 w-7 text-indigo-600" />}
                {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Registration Fields */}
                {!isLogin && (
                    <>
                        <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" required />
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" required />
                    </>
                )}
                {/* Login Fields */}
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" required />

                <button type="submit" disabled={loading}
                    className="w-full py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md disabled:opacity-50 flex items-center justify-center"
                >
                    {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                    {buttonText}
                </button>
            </form>

            <p className="text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                <button onClick={() => setView(isLogin ? 'register' : 'login')} disabled={loading}
                    className="text-indigo-600 font-medium hover:text-indigo-500 focus:outline-none"
                >
                    {isLogin ? 'Register Now' : 'Log In'}
                </button>
            </p>
        </div>
    );
};

export default AuthForm;
