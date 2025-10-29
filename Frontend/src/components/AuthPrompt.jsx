import React from 'react';
import { LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthPrompt = () => {
    const { setView } = useAuth();
    return (
        <div className="text-center py-24 px-4 bg-white rounded-xl shadow-xl max-w-lg mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Login to View Your Notes</h2>
            <p className="text-gray-600">Please log in or create an account to access the NoteKeeper dashboard and manage your notes.</p>
            <button onClick={() => setView('login')} className="px-6 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-lg">
                <LogIn className="inline w-5 h-5 mr-2" /> Go to Login
            </button>
        </div>
    );
}

export default AuthPrompt;
