import React, { useState } from 'react';
import { LogIn, UserPlus, NotebookText, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
    const { isLoggedIn, user, isAdmin, handleLogout, setView, view } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="bg-white shadow-lg sticky top-0 z-10 font-poppins">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                
                {/* Logo/Title */}
                <h1 className="text-2xl font-extrabold text-indigo-600 cursor-pointer" onClick={() => setView(isLoggedIn ? 'dashboard' : 'login')}>
                    NoteKeeper
                </h1>

                {/* Right Side Controls */}
                {isLoggedIn ? (
                    <div className="flex items-center space-x-3">
                        {/* Admin Button */}
                        {isAdmin && (
                            <button
                                onClick={() => setView('admin')}
                                className={`hidden sm:flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-md 
                                    ${view === 'admin' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Admin Panel
                            </button>
                        )}

                        {/* Add Note Button */}
                        <button
                            onClick={() => setView('dashboard')}
                            className={`hidden sm:flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-md 
                                ${view === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                        >
                            <NotebookText className="w-4 h-4 mr-2" />
                            Dashboard
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-150"
                            >
                                <User className="w-6 h-6 text-indigo-600" />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20">
                                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                        <p className="font-semibold truncate">{user.username}</p>
                                        <p className="text-xs text-gray-500">{user.role}</p>
                                    </div>
                                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-150">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex space-x-3">
                        <button onClick={() => setView('login')} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md transition duration-200 flex items-center">
                            <LogIn className="w-4 h-4 mr-2" /> Login
                        </button>
                        <button onClick={() => setView('register')} className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 shadow-md transition duration-200 flex items-center">
                            <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
