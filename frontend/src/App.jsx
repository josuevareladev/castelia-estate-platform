import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import SearchSection from './components/SearchSection';
import CreateProperty from './pages/CreateProperty';
import Login from './pages/Login';
import { getAuthToken, logoutAdmin } from './services/authService';

// Component Wrapper to protect administration routes
const ProtectedRoute = ({ children }) => {
    const token = getAuthToken();
    return token ? children : <Navigate to="/login" replace />;
};

// Sub-component to manage the Header view state cleanly without collision
const NavigationHeader = ({ isAuthenticated, setIsAuthenticated }) => {
    const location = useLocation();

    // Sync auth state whenever the user changes routes
    useEffect(() => {
        setIsAuthenticated(!!getAuthToken());
    }, [location, setIsAuthenticated]);

    const handleLogOut = () => {
        logoutAdmin();
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-green-800 tracking-tight">
                    Castelia Studio
                </Link>
                <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600 items-center">
                    <Link to="/create" className="hover:text-green-600 transition-colors">
                        Add Property
                    </Link>
                    <Link to="/" className="hover:text-green-600 transition-colors">
                        AI Agent
                    </Link>
                    {isAuthenticated ? (
                        <button 
                            onClick={handleLogOut}
                            className="bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border-none"
                        >
                            Log Out
                        </button>
                    ) : (
                        <Link to="/login" className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all">
                            Admin Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 font-sans">
                {/* Isolated navigation layout to prevent re-render loops */}
                <NavigationHeader isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />

                <main className="container mx-auto px-6 py-8">
                    {/* Organic Breadcrumb */}
                    <nav className="mb-8 text-sm text-gray-500 flex items-center gap-2">
                        <Link to="/" className="hover:text-green-700 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Platform</span>
                    </nav>

                    <Routes>
                        <Route path="/" element={<SearchSection />} />
                        <Route path="/login" element={<Login />} />
                        
                        <Route 
                            path="/create" 
                            element={
                                <ProtectedRoute>
                                    <CreateProperty />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;