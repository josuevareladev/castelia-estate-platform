import { useState } from 'react';
import { Search, Loader2, ChevronDown, ChevronUp, MapPin, Tag } from 'lucide-react';
import Swal from 'sweetalert2';
import { searchProperties } from '../services/apiService';

const SearchSection = () => {
    const [prompt, setPrompt] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        // Limpiamos resultados anteriores para evitar confusión visual si la nueva búsqueda falla
        setResults([]); 
        
        try {
            const response = await searchProperties(prompt);
            
            if (response.success) {
                setResults(response.data);
                if (response.data.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'No matches found',
                        text: 'The AI agent could not find properties matching your exact criteria. Try broadening your search.',
                        confirmButtonColor: '#16a34a'
                    });
                }
            } else {
                throw new Error(response.error || 'Failed to communicate with the AI agent.');
            }
        } catch (error) {
            // Manejo de errores de red o servidor 500 estandarizados por errorHandler.js
            const errorMessage = error.response?.data?.error || error.message || 'System timeout. Please try again later.';
            
            Swal.fire({
                icon: 'error',
                title: 'AI System Error',
                text: errorMessage,
                confirmButtonColor: '#16a34a'
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3 mb-10 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                <div className="relative flex-1 flex items-center">
                    <Search className="absolute left-4 text-gray-400" size={22} />
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., A modern apartment in the south with a pool..."
                        className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-lg"
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
                </button>
            </form>

            {/* Empty State / Instructional Text */}
            {!loading && results.length === 0 && prompt.trim() === '' && (
                <div className="text-center text-gray-400 mt-10">
                    <p>Enter a description above to let the AI find your ideal property.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.map((property) => {
                    const isExpanded = expandedId === property._id;
                    // Lógica segura para renderizar la primera imagen del arreglo de Cloudinary
                    const displayImage = property.images && property.images.length > 0 
                        ? property.images[0] 
                        : 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                    
                    return (
                        <article 
                            key={property._id} 
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
                        >
                            <div className="relative h-56 overflow-hidden bg-gray-100">
                                <img 
                                    src={displayImage} 
                                    alt={property.title} 
                                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
                                    onError={(e) => { e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; }}
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-green-700 font-bold text-sm shadow-sm">
                                    ${property.price.toLocaleString()}
                                </div>
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="font-bold text-xl text-gray-800 mb-2 line-clamp-1">{property.title}</h3>
                                
                                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                    <MapPin size={16} />
                                    <span className="capitalize">{property.region}</span>
                                </div>

                                {/* Expandable Art Card Details */}
                                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-48 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{property.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {property.features && property.features.map((feature, idx) => (
                                            <span key={idx} className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                                                <Tag size={12} /> {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={() => toggleExpand(property._id)}
                                    className="mt-auto flex items-center justify-center gap-2 w-full py-2 border-t border-gray-100 text-green-600 font-medium hover:bg-green-50 transition-colors rounded-b-xl cursor-pointer"
                                >
                                    {isExpanded ? (
                                        <><ChevronUp size={18} /> Show Less</>
                                    ) : (
                                        <><ChevronDown size={18} /> View Details</>
                                    )}
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
};

export default SearchSection;