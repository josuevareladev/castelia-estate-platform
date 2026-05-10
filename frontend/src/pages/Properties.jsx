import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProperties } from '../services/propertyService';
import PropertyCard from '../components/PropertyCard';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Properties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const propertiesPerPage = 6; // Cantidad de Art Cards por página

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await getProperties();
                setProperties(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching properties:', error);
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // 1. Filter Logic
    const filteredProperties = properties.filter((property) => {
        const matchesSearch = 
            property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location.toLowerCase().includes(searchTerm.toLowerCase());
            
        const matchesStatus = 
            statusFilter === 'all' || property.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // 2. Pagination Logic
    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

    if (loading) {
        return (
            <section className="py-4">
                {/* Skeleton Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <Skeleton width={250} height={40} baseColor="#F6F9F2" highlightColor="#FFFFFF" />
                    <Skeleton width={180} height={48} borderRadius={12} baseColor="#F6F9F2" highlightColor="#FFFFFF" />
                </div>

                {/* Skeleton Filter Bar */}
                <div className="mb-8">
                    <Skeleton height={70} borderRadius={12} baseColor="#F6F9F2" highlightColor="#FFFFFF" />
                </div>

                {/* Skeleton Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <Skeleton height={240} baseColor="#F6F9F2" highlightColor="#FFFFFF" borderRadius={0} />
                            <div className="p-6">
                                <Skeleton width="80%" height={24} className="mb-2" baseColor="#F6F9F2" highlightColor="#FFFFFF" />
                                <Skeleton width="50%" height={16} className="mb-4" baseColor="#F6F9F2" highlightColor="#FFFFFF" />
                                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <Skeleton width={80} height={30} baseColor="#F6F9F2" highlightColor="#FFFFFF" />
                                    <Skeleton width={100} height={30} baseColor="#F6F9F2" highlightColor="#FFFFFF" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-black text-castelia-dark tracking-tight">Property Catalog</h2>
                <Link 
                    to="/create-property"
                    className="bg-castelia-primary hover:bg-castelia-accent text-white hover:text-castelia-dark font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-castelia-primary/20"
                >
                    + Add New Property
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <input 
                        type="text" 
                        placeholder="Search by title or location..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-castelia-primary outline-none transition-all bg-gray-50 focus:bg-white"
                    />
                </div>
                <div className="w-full md:w-64">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-castelia-primary outline-none transition-all bg-gray-50 focus:bg-white cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="available">Available</option>
                        <option value="rented">Rented</option>
                        <option value="sold">Sold</option>
                    </select>
                </div>
            </div>

            {/* Grid & Empty State */}
            {filteredProperties.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                        {currentProperties.map((property) => (
                            <PropertyCard key={property._id} property={property} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 border-t border-gray-200 pt-8">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-5 py-2 rounded-lg font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-castelia-dark hover:bg-gray-50 hover:border-castelia-primary"
                            >
                                Previous
                            </button>
                            
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                                Page <span className="text-castelia-dark">{currentPage}</span> of {totalPages}
                            </span>

                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-5 py-2 rounded-lg font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white border border-gray-200 text-castelia-dark hover:bg-gray-50 hover:border-castelia-primary"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-xl font-bold text-gray-400 mb-2">No properties found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search or filters.</p>
                    <button 
                        onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                        className="mt-4 text-castelia-primary font-bold hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </section>
    );
};

export default Properties;