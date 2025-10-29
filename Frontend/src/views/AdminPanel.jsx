import React, { useState } from 'react';
import { Shield, User, Users, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../services/api';

// --- 4. ADMIN PANEL ---
const AdminPanel = () => {
    const { user, handleMessage } = useAuth();
    const [targetUserId, setTargetUserId] = useState('');
    const [targetRole, setTargetRole] = useState('USER');
    const [loading, setLoading] = useState(false);

    // Prevent Admin from deleting or updating their own account
    const isSelfTarget = targetUserId && user && targetUserId === user._id;

    // Handle Role Update (PATCH /admin/update-role/:userId)
    const handleRoleUpdate = async () => {
        if (!targetUserId || !targetRole) { handleMessage({ type: 'error', text: 'User ID and Role are required.' }); return; }
        if (isSelfTarget) { handleMessage({ type: 'error', text: 'You cannot change your own role.' }); return; }

        setLoading(true); handleMessage({ type: 'clear' });
        try {
            const endpoint = `/admin/update-role/${targetUserId}`;
            const result = await apiFetch(endpoint, { method: 'PATCH', body: { role: targetRole } });
            handleMessage({ type: 'success', text: `Role for ${result.data.username} successfully updated to ${result.data.role}` });
        } catch (error) {
            handleMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    // Handle Account Deletion (DELETE /admin/delete-account/:userId)
    const handleDeleteAccount = async () => {
        if (!targetUserId) { handleMessage({ type: 'error', text: 'User ID is required for deletion.' }); return; }
        if (isSelfTarget) { handleMessage({ type: 'error', text: 'You cannot delete your own account.' }); return; }

        if (!window.confirm(`WARNING: Are you absolutely sure you want to delete user ID: ${targetUserId}? This will delete all their notes.`)) return;

        setLoading(true); handleMessage({ type: 'clear' });
        try {
            const endpoint = `/admin/delete-account/${targetUserId}`;
            await apiFetch(endpoint, { method: 'DELETE' });
            handleMessage({ type: 'success', text: `User ${targetUserId} and associated notes deleted successfully.` });
        } catch (error) {
            handleMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
            setTargetUserId('');
        }
    };

    // Handle Global Note Deletion (DELETE /admin/delete-all-notes)
    const handleDeleteAllNotes = async () => {
        if (!window.confirm('EXTREME WARNING: Are you sure you want to delete ALL notes globally?')) return;

        setLoading(true); handleMessage({ type: 'clear' });
        try {
            const endpoint = `/admin/delete-all-notes`;
            await apiFetch(endpoint, { method: 'DELETE' });
            handleMessage({ type: 'success', text: `Successfully deleted all notes from the database.` });
        } catch (error) {
            handleMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl space-y-8 mt-6">
            <h2 className="text-3xl font-bold text-red-700 flex items-center border-b pb-3 font-poppins">
                <Shield className="w-7 h-7 mr-3" />
                Administrator Panel
            </h2>

            {/* 1. Update User Role */}
            <div className="p-6 bg-white rounded-xl shadow-xl border border-red-200 space-y-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <User className="w-5 h-5 mr-2 text-red-500" /> Modify User Role
                </h3>
                <input type="text" placeholder="Target User ID (e.g., 65f...)" value={targetUserId} 
                    onChange={(e) => setTargetUserId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
                />
                <div className="flex space-x-3">
                    <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
                        className="grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    <button onClick={handleRoleUpdate} disabled={loading || isSelfTarget || !targetUserId}
                        className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition duration-200 shadow-md disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Change Role'}
                    </button>
                </div>
                {isSelfTarget && <p className="text-sm text-red-500 pt-2">Cannot change your own role.</p>}
            </div>
            
            {/* 2. Delete User Account and Global Wipeout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Delete User */}
                <div className="p-6 bg-white rounded-xl shadow-xl border border-red-200 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-red-500" /> Delete User
                    </h3>
                    <input type="text" placeholder="User ID to Delete" value={targetUserId}
                        onChange={(e) => setTargetUserId(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
                    />
                    <button onClick={handleDeleteAccount} disabled={loading || isSelfTarget || !targetUserId}
                        className="w-full py-2 text-white bg-red-700 rounded-lg hover:bg-red-800 transition duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        DELETE ACCOUNT
                    </button>
                </div>

                {/* Global Delete */}
                <div className="p-6 bg-white rounded-xl shadow-xl border border-red-200 space-y-4">
                    <h3 className="text-xl font-semibold text-red-700 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" /> Global Action
                    </h3>
                    <p className="text-sm text-gray-600 pt-2">Permanently deletes all notes created by all users.</p>
                    <button onClick={handleDeleteAllNotes} disabled={loading}
                        className="w-full py-2 text-white bg-gray-900 rounded-lg hover:bg-gray-700 transition duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        DELETE ALL NOTES
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
