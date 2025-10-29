import React, { useState } from 'react';
import { NotebookText, Edit, X, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../services/api';

// Note Creation/Edit Form
const NoteForm = ({ currentNote, fetchNotes, onCancel }) => {
    const { handleMessage } = useAuth();
    const [title, setTitle] = useState(currentNote?.title || '');
    const [content, setContent] = useState(currentNote?.content || '');
    const [loading, setLoading] = useState(false);

    const isEditing = !!currentNote;
    const buttonText = isEditing ? 'Save Changes' : 'Create Note';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        handleMessage({ type: 'clear' });

        if (!title.trim() || !content.trim()) {
            handleMessage({ type: 'error', text: 'Title and content cannot be empty.' });
            setLoading(false);
            return;
        }

        const endpoint = isEditing ? `/notes/${currentNote._id}` : '/notes';
        const method = isEditing ? 'PATCH' : 'POST';
        const payload = { title, content };

        try {
            await apiFetch(endpoint, { method, body: payload });
            handleMessage({ type: 'success', text: `Note ${isEditing ? 'updated' : 'created'} successfully!` });
            
            if (!isEditing) { setTitle(''); setContent(''); }
            onCancel(); 
            fetchNotes(); 
            
        } catch (error) {
            handleMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                {isEditing ? <Edit className="w-5 h-5 mr-2 text-indigo-500" /> : <NotebookText className="w-5 h-5 mr-2 text-indigo-500" />}
                {isEditing ? 'Edit Note' : 'New Note'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" placeholder="Note Title" value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" required />
                <textarea placeholder="Note Content..." rows="4" value={content} onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none" required />

                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} disabled={loading}
                        className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-150"
                    >
                        <X className="w-4 h-4 mr-2" /> Cancel
                    </button>
                    <button type="submit" disabled={loading}
                        className="flex items-center px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md disabled:opacity-50"
                    >
                        {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                        <Save className="w-4 h-4 mr-2" /> {buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NoteForm;
