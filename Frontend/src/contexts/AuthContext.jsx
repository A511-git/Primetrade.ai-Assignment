import React, { useState, useEffect, useCallback, createContext } from 'react';
import { apiFetch } from '../services/api';

// --- 1. AUTH CONTEXT & PROVIDER ---
const AuthContext = createContext();

// --- AUTH PROVIDER COMPONENT ---
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('login'); // 'login', 'register', 'dashboard', 'admin'
    const [message, setMessage] = useState(null);

    const isAdmin = user && user.role === 'ADMIN';

    const handleMessage = (msg) => {
        if (msg.type === 'clear') {
            setMessage(null);
        } else {
            setMessage(msg);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const checkAuthStatus = useCallback(async () => {
        try {
            const result = await apiFetch('/users/current-user');
            if (result.success) {
                // If the user is successfully fetched and already logged in, 
                // DO NOT reset the view. Just update user data.
                if (!isLoggedIn) {
                    // Set initial view only upon initial successful login/auth check
                    setView(result.data.role === 'ADMIN' ? 'admin' : 'dashboard');
                }
                setIsLoggedIn(true);
                setUser(result.data);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
            if (view !== 'register') setView('login');
        } finally {
            setLoading(false);
        }
    }, [view, isLoggedIn]); // Included isLoggedIn in dependencies

    const handleAuthSuccess = () => {
        setLoading(true);
        checkAuthStatus();
    };

    const handleLogout = async () => {
        try {
            await apiFetch('/users/logout', { method: 'POST' });
            handleMessage({ type: 'success', text: 'Logged out successfully.' });
        } catch (error) {
            handleMessage({ type: 'error', text: 'Logout failed.' });
        } finally {
            setIsLoggedIn(false);
            setUser(null);
            setView('login');
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    const contextValue = {
        isLoggedIn,
        user,
        isAdmin,
        loading,
        view,
        setView,
        handleAuthSuccess,
        handleLogout,
        handleMessage,
        message
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
