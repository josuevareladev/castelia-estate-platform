import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import SearchSection from './components/SearchSection';
import CreateProperty from './pages/CreateProperty';
import Login from './pages/Login';
import Breadcrumb from './components/Breadcrumb';
import { getAuthToken, logoutAdmin } from './services/authService';

const ProtectedRoute = ({ children }) => {
    const token = getAuthToken();
    return token ? children : <Navigate to="/login" replace />;
};

const NavigationHeader = ({ isAuthenticated, setIsAuthenticated }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsAuthenticated(!!getAuthToken());
        setIsMobileMenuOpen(false);
    }, [location, setIsAuthenticated]);

    const handleLogOut = () => {
        logoutAdmin();
        setIsAuthenticated(false);
        navigate('/');
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-green-800 tracking-tight">
                    Castelia Studio
                </Link>
                
                <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 items-center">
                    <Link to="/create" className="hover:text-green-600 transition-colors">Add Property</Link>
                    <Link to="/" className="hover:text-green-600 transition-colors">AI Agent</Link>
                    {isAuthenticated ? (
                        <button onClick={handleLogOut} className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border-none cursor-pointer">
                            Log Out
                        </button>
                    ) : (
                        <Link to="/login" className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all">
                            Admin Login
                        </Link>
                    )}
                </nav>

                <button 
                    className="md:hidden p-2 text-gray-600 hover:text-green-600 transition-colors focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg">
                    <nav className="flex flex-col px-6 py-5 space-y-5 text-base font-medium text-gray-600">
                        <Link to="/create" className="hover:text-green-600 transition-colors block">Add Property</Link>
                        <Link to="/" className="hover:text-green-600 transition-colors block">AI Agent</Link>
                        <hr className="border-gray-50" />
                        {isAuthenticated ? (
                            <button onClick={handleLogOut} className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-4 py-3 rounded-lg text-sm font-bold uppercase transition-all text-left w-max">
                                Log Out
                            </button>
                        ) : (
                            <Link to="/login" className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm font-bold uppercase transition-all w-max inline-block">
                                Admin Login
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 font-sans">
                <NavigationHeader isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
                
                <main className="container mx-auto px-6 py-8">
                    <Breadcrumb />
                    
                    <Routes>
                        <Route path="/" element={<SearchSection />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/create" element={
                            <ProtectedRoute>
                                <CreateProperty />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;