import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/propertyService';
import Swal from 'sweetalert2';

const CreateProperty = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        region: 'center', 
        features: '' 
    });
    
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length > 5) {
            Swal.fire({
                title: 'Limit Exceeded',
                text: 'You can upload a maximum of 5 images.',
                icon: 'warning',
                confirmButtonColor: '#16a34a'
            });
            return;
        }

        setImages(files);

        const filePreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(filePreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (images.length === 0) {
            Swal.fire({
                title: 'Images Required',
                text: 'Please select at least one image for the property listing.',
                icon: 'warning',
                confirmButtonColor: '#16a34a'
            });
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('region', formData.region);

        const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');
        featuresArray.forEach(feature => {
            data.append('features', feature);
        });

        images.forEach((image) => {
            data.append('images', image);
        });

        try {
            await createProperty(data);
            Swal.fire({
                title: 'Property Published!',
                text: 'The new listing is now visible in the catalog with its images.',
                icon: 'success',
                confirmButtonColor: '#16a34a'
            });
            navigate('/');
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'System Error',
                text: error.response?.data?.error || 'Failed to publish the property. Please check the logs.',
                icon: 'error',
                confirmButtonColor: '#16a34a'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-600 mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-6 uppercase tracking-tight">Add New Property</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Property Title</label>
                    <input 
                        type="text" required
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Detailed Description</label>
                    <textarea 
                        required
                        className="w-full p-3 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Price ($)</label>
                        <input 
                            type="number" required
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Region (Zone)</label>
                        <select 
                            required
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 outline-none"
                            onChange={(e) => setFormData({...formData, region: e.target.value})}
                            value={formData.region}
                        >
                            <option value="north">North</option>
                            <option value="south">South</option>
                            <option value="east">East</option>
                            <option value="west">West</option>
                            <option value="center">Center</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Features (Comma separated)</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Pool, 3 Bedrooms, Garage..."
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        onChange={(e) => setFormData({...formData, features: e.target.value})}
                    />
                </div>

                <div className="bg-green-50 p-4 rounded-xl border-2 border-dashed border-green-600/30 text-center">
                    <label className="cursor-pointer block">
                        <span className="text-sm text-green-800 font-bold mb-2 block">
                            Click to upload images (Max 5)
                        </span>
                        <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                    
                    {previews.length > 0 && (
                        <div className="mt-4 grid grid-cols-5 gap-2">
                            {previews.map((preview, index) => (
                                <img 
                                    key={index} 
                                    src={preview} 
                                    alt={`preview-${index}`} 
                                    className="h-16 w-full object-cover rounded-md border border-gray-200"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-4">
                    <button 
                        type="button" onClick={() => navigate(-1)}
                        className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" disabled={loading}
                        className="flex-[2] bg-green-600 text-white font-black py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Uploading & Processing...' : 'Publish Property'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CreateProperty;