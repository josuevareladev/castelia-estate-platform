import SearchSection from './components/SearchSection';

const App = () => {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold text-green-800 tracking-tight">Castelia Studio</h1>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                        <a href="#" className="hover:text-green-600 transition-colors">Properties</a>
                        <a href="#" className="hover:text-green-600 transition-colors">AI Agent</a>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Organic Breadcrumb */}
                <nav className="mb-8 text-sm text-gray-500 flex items-center gap-2">
                    <a href="#" className="hover:text-green-700 transition-colors">Home</a>
                    <span>/</span>
                    <a href="#" className="hover:text-green-700 transition-colors">Smart Search</a>
                </nav>

                {/* AI Module */}
                <SearchSection />
            </main>
        </div>
    );
};

export default App;