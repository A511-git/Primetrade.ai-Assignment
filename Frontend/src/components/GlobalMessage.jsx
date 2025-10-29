import React from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// --- GLOBAL MESSAGE COMPONENT ---
const GlobalMessage = () => {
    const { message, handleMessage } = useAuth();
    if (!message) return null;
    return (
        <div className={`p-4 mb-4 rounded-lg shadow-md flex justify-between items-center max-w-7xl mx-auto ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} role="alert">
            <span className="font-medium">{message.text}</span>
            <button onClick={() => handleMessage({ type: 'clear' })} className="text-lg font-bold">
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default GlobalMessage;