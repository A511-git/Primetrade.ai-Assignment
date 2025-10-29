import React, { useState, useEffect, useCallback } from 'react';
import { NotebookText, Trash2, Edit } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiFetch } from '../services/api';
import NoteForm from '../components/NoteForm';
import AuthPrompt from '../components/AuthPrompt';

// Notes List and Dashboard View
const Dashboard = () => {
    const { isLoggedIn, user, handleMessage, isAdmin } = useAuth();
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [listLoading, setListLoading] = useState(false);

    // NEW LOGIC: Determine if the user can edit/delete a specific note
    const canEditOrDelete = useCallback((note) => {
        if (!user) return false;
        // User can act if they are the owner OR if they are an admin
        // Note: note.owner is an ID string; user._id is an ID string.
        return note.owner === user._id || isAdmin;
    }, [user, isAdmin]);


    const fetchNotes = useCallback(async () => {
        if (!isLoggedIn) return; 
        setListLoading(true);
        try {
            // Using the global endpoint to show all notes
            const endpoint = `/notes/all-notes`; 
            const result = await apiFetch(endpoint); 
            setNotes(result.data || []);
        } catch (error) {
            handleMessage({ type: 'error', text: 'Failed to fetch notes: ' + error.message });
        } finally {
            setListLoading(false);
        }
    }, [isLoggedIn, handleMessage]); // Removed 'user' dependency since we are using /all-notes

    useEffect(() => {
        if (isLoggedIn) {
            fetchNotes();
        }
    }, [isLoggedIn, fetchNotes]); // Removed 'user' dependency to allow faster fetch

    const handleDelete = async (noteId) => {
        // NOTE: window.confirm is used here for brevity; a custom modal is preferred 
        if (!window.confirm('Are you sure you want to delete this note?')) return; 
        handleMessage({ type: 'clear' });
        try {
            await apiFetch(`/notes/${noteId}`, { method: 'DELETE' });
            handleMessage({ type: 'success', text: 'Note deleted successfully.' });
            fetchNotes();
        } catch (error) {
            handleMessage({ type: 'error', text: error.message });
        }
    };

    if (!isLoggedIn) {
        return <AuthPrompt />;
    }
    
    return (
        <div className="w-full space-y-8">
            {(isCreatingNew || editingNote) && (
                <NoteForm
                    currentNote={editingNote}
                    fetchNotes={fetchNotes}
                    onCancel={() => { setEditingNote(null); setIsCreatingNew(false); }}
                />
            )}

            <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 flex justify-between items-center">
                    All Available Notes ({notes.length})
                    {/* Only show 'Add Note' if the user object is available */}
                    {user && (
                        <button
                            onClick={() => { setIsCreatingNew(true); setEditingNote(null); }}
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md flex items-center text-sm"
                        >
                            <NotebookText className="w-4 h-4 mr-2" />
                            Add Note
                        </button>
                    )}
                </h3>
                {listLoading ? (
                    <div className="flex justify-center items-center h-40"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div></div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-gray-100 rounded-lg">
                        <p>No notes found in the system. Be the first to create one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {notes.map(note => {
                            const canAct = canEditOrDelete(note); // Check authorization for buttons
                            return (
                                <div key={note._id} className="p-5 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 transform hover:scale-[1.01] flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-xl font-bold text-indigo-700 truncate mb-2">{note.title}</h4>
                                        <p className="text-gray-600 text-sm h-16 overflow-hidden mb-4">{note.content}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-400">Owner ID: {note.owner.substring(0, 8)}...</span>
                                        {canAct && (
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => { setEditingNote(note); setIsCreatingNew(false); }}
                                                    className="p-2 text-indigo-500 hover:text-indigo-700 transition duration-150 rounded-full bg-indigo-50 hover:bg-indigo-100"
                                                    title="Edit Note"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(note._id)}
                                                    className="p-2 text-red-500 hover:text-red-700 transition duration-150 rounded-full bg-red-50 hover:bg-red-100"
                                                    title="Delete Note"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
