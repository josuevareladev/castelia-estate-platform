import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';

const EditProperty = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        status: ''
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await api.get(`/properties/${id}`);
                setFormData({
                    title: data.title,
                    description: data.description,
                    price: data.price,
                    location: data.location,
                    status: data.status
                });
                setLoading(false);
            } catch (error) {
                Swal.fire('Error', 'Could not load property data', 'error');
                navigate('/properties');
            }
        };
        fetchProperty();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (image) data.append('image', image);

        try {
            await api.put(`/properties/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Swal.fire({
                title: 'Updated!',
                text: 'Property details have been successfully modified.',
                icon: 'success',
                confirmButtonColor: '#4A7C2A'
            });
            navigate(`/properties/${id}`);
        } catch (error) {
            Swal.fire('Error', 'Update failed. Please try again.', 'error');
            setUpdating(false);
        }
    };

    if (loading) return <div className="p-20 text-center font-bold text-castelia-dark animate-pulse">Loading property data...</div>;

    return (
        <section className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-castelia-primary mb-10">
            <h2 className="text-2xl font-black text-castelia-dark mb-6 uppercase tracking-tight">Edit Property</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Property Title</label>
                    <input 
                        type="text" value={formData.title} required
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-castelia-primary outline-none transition-all"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Detailed Description</label>
                    <textarea 
                        value={formData.description} required
                        className="w-full p-3 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-castelia-primary outline-none transition-all"
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Price ($)</label>
                        <input 
                            type="number" value={formData.price} required
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-castelia-primary outline-none"
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Status</label>
                        <select 
                            value={formData.status}
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-castelia-primary outline-none bg-white"
                            onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                            <option value="available">Available</option>
                            <option value="sold">Sold</option>
                            <option value="rented">Rented</option>
                        </select>
                    </div>
                </div>

                <div className="bg-castelia-light p-4 rounded-xl border-2 border-dashed border-castelia-primary/30 text-center">
                    <label className="cursor-pointer block">
                        <span className="text-sm text-castelia-dark font-bold">
                            {image ? `New image: ${image.name}` : 'Click here to change photograph'}
                        </span>
                        <input 
                            type="file" accept="image/*" className="hidden"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                    </label>
                </div>

                <div className="flex gap-3 pt-4">
                    <button 
                        type="button" onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" disabled={updating}
                        className="flex-[2] bg-castelia-primary text-white font-black py-3 rounded-xl hover:bg-castelia-accent hover:text-castelia-dark transition-all shadow-lg shadow-castelia-primary/20 disabled:opacity-50"
                    >
                        {updating ? 'Saving changes...' : 'Update Property'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default EditProperty;