import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthForm from './AuthForm';
import AdminPanel from '../views/AdminPanel';
import Dashboard from '../views/Dashboard';
import AuthPrompt from './AuthPrompt';

const AppContent = () => {
    const { isLoggedIn, view, loading, isAdmin, setView } = useAuth();
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen-3/4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
            </div>
        );
    }
    
    let ContentComponent;

    if (!isLoggedIn) {
        // If not logged in, show AuthPrompt if not on register/login view
        if (view === 'dashboard' || view === 'admin') {
            ContentComponent = <AuthPrompt />;
        } else {
            ContentComponent = <AuthForm view={view} setView={setView} />;
        }
    } else if (view === 'admin' && isAdmin) {
        ContentComponent = <AdminPanel />;
    } else {
        ContentComponent = <Dashboard />;
    }

    return (
        <div className="flex justify-center">
            {/* Center the content based on the current view */}
            <div className={isLoggedIn && view === 'admin' ? 'w-full max-w-4xl' : 'w-full max-w-7xl'}> 
                {ContentComponent}
            </div>
        </div>
    );
}

export default AppContent;
