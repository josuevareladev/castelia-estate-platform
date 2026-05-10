import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const PropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await api.get(`/properties/${id}`);
                setProperty(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching property details", error);
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const handleDelete = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This action will permanently delete the property and its image from the cloud.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4A7C2A', 
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
            background: '#F6F9F2',
            color: '#1E382B',
            iconColor: '#A3C585', 
            customClass: {
                title: 'font-bold font-exo2',
                popup: 'rounded-2xl border-2 border-castelia-primary/20'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsDeleting(true);
                try {
                    await api.delete(`/properties/${id}`);
                    
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The property has been successfully removed.',
                        icon: 'success',
                        confirmButtonColor: '#4A7C2A',
                        background: '#F6F9F2',
                        color: '#1E382B'
                    });
                    
                    navigate('/properties');
                } catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Action could not be completed.',
                        icon: 'error',
                        confirmButtonColor: '#4A7C2A'
                    });
                    setIsDeleting(false);
                }
            }
        });
    };

    if (loading) return (
        <div className="p-20 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-castelia-primary border-t-transparent rounded-full mb-4"></div>
            <p className="font-bold text-castelia-dark tracking-widest uppercase text-sm">Loading details...</p>
        </div>
    );
    
    if (!property) return (
        <div className="p-20 text-center bg-white rounded-xl shadow-md">
            <p className="text-gray-500 font-semibold">Property not found.</p>
            <button onClick={() => navigate('/properties')} className="mt-4 text-castelia-primary underline">Return to catalog</button>
        </div>
    );

    return (
        <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden mb-12 border border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[300px] lg:h-auto overflow-hidden">
                    <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-6 left-6">
                        <span className="bg-castelia-dark/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
                            {property.status}
                        </span>
                    </div>
                </div>

                <div className="p-10 lg:p-14 flex flex-col justify-center">
                    <header className="mb-8">
                        <h2 className="text-4xl font-black text-castelia-dark mb-3 leading-tight">{property.title}</h2>
                        <div className="flex items-center text-castelia-accent font-bold tracking-wide">
                            <span className="mr-2">📍</span>
                            <span className="text-gray-500 uppercase text-sm">{property.location}</span>
                        </div>
                    </header>

                    <div className="relative mb-10">
                        <span className="absolute -top-4 -left-2 text-6xl text-castelia-primary/10 font-serif">“</span>
                        <p className="text-gray-600 leading-relaxed text-lg italic relative z-10 pl-4">
                            {property.description}
                        </p>
                    </div>

                    <div className="border-t border-gray-100 pt-8 mt-auto">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-black tracking-[0.2em] mb-1">Estimated Investment</p>
                                <span className="text-5xl font-black text-castelia-dark tracking-tighter">
                                    ${Number(property.price).toLocaleString()}
                                </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-3">
                                <button 
                                    onClick={() => navigate(`/edit-property/${id}`)}
                                    className="bg-castelia-light text-castelia-dark hover:bg-castelia-primary hover:text-white font-bold py-3 px-6 rounded-xl transition-all border border-castelia-primary/20"
                                >
                                    Edit
                                </button>

                                <button 
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-bold py-3 px-6 rounded-xl transition-all border border-red-100 disabled:opacity-50"
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </button>
                                
                                <button 
                                    onClick={() => navigate('/properties')}
                                    className="bg-castelia-primary text-white hover:bg-castelia-accent hover:text-castelia-dark font-black py-3 px-8 rounded-xl transition-all shadow-lg shadow-castelia-primary/20"
                                >
                                    Back to Catalog
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PropertyDetail;