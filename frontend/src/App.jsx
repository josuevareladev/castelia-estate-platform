import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchSection from './components/SearchSection';
import CreateProperty from './pages/CreateProperty';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 font-sans">
                {/* Sticky Header */}
                <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                        <Link to="/" className="text-2xl font-extrabold text-green-800 tracking-tight">
                            Castelia Studio
                        </Link>
                        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                            <Link to="/create" className="hover:text-green-600 transition-colors">
                                Add Property
                            </Link>
                            <Link to="/" className="hover:text-green-600 transition-colors">
                                AI Agent
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="container mx-auto px-6 py-8">
                    {/* Organic Breadcrumb Dinámico */}
                    <nav className="mb-8 text-sm text-gray-500 flex items-center gap-2">
                        <Link to="/" className="hover:text-green-700 transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Platform</span>
                    </nav>

                    {/* Inyección de vistas controlada por URL */}
                    <Routes>
                        <Route path="/" element={<SearchSection />} />
                        <Route path="/create" element={<CreateProperty />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;