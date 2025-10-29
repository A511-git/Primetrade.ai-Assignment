import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import GlobalMessage from './components/GlobalMessage';
import AppContent from './components/AppContent';

const App = () => {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50 font-inter">
                <Header />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-8">
                    <GlobalMessage />
                    <AppContent />
                </main>
            </div>
        </AuthProvider>
    );
};

export default App;