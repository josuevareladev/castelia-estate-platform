import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = !!localStorage.getItem('token');

    const handleLogout = () => {
        Swal.fire({
            title: 'Sign Out?',
            text: "You will be logged out of the admin panel.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4A7C2A',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, sign out',
            cancelButtonText: 'Cancel',
            background: '#F6F9F2',
            color: '#1E382B'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        });
    };

    if (location.pathname === '/login') return null;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-castelia-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-black text-xl">C</span>
                    </div>
                    <span className="text-xl font-black text-castelia-dark tracking-tighter">
                        Castelia<span className="text-castelia-primary">Studio</span>
                    </span>
                </Link>

                {isAuthenticated && (
                    <div className="flex items-center gap-6">
                        <Link 
                            to="/" 
                            className={`font-bold text-sm uppercase tracking-wider transition-colors ${location.pathname === '/' ? 'text-castelia-primary' : 'text-gray-400 hover:text-castelia-dark'}`}
                        >
                            Dashboard
                        </Link>
                        <Link 
                            to="/properties" 
                            className={`font-bold text-sm uppercase tracking-wider transition-colors ${location.pathname.includes('/properties') ? 'text-castelia-primary' : 'text-gray-400 hover:text-castelia-dark'}`}
                        >
                            Catalog
                        </Link>
                        
                        <div className="w-px h-6 bg-gray-200 mx-2"></div>
                        
                        <button 
                            onClick={handleLogout}
                            className="text-sm font-black text-red-500 hover:text-white hover:bg-red-500 py-2 px-4 rounded-lg transition-all border border-red-100 hover:border-red-500 uppercase tracking-wider"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};