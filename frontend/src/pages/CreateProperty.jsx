import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/propertyService';
import Swal from 'sweetalert2';

const CreateProperty = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        status: 'available'
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validación para asegurar que siempre haya una imagen
        if (!image) {
            Swal.fire({
                title: 'Fotografía Requerida',
                text: 'Por favor, selecciona una imagen para el catálogo.',
                icon: 'warning',
                confirmButtonColor: '#4A7C2A',
                background: '#F6F9F2',
                color: '#1E382B'
            });
            return;
        }

        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('location', formData.location);
        data.append('status', formData.status);
        data.append('image', image);

        try {
            await createProperty(data);
            Swal.fire({
                title: '¡Propiedad Publicada!',
                text: 'El nuevo inmueble ya está visible en el catálogo.',
                icon: 'success',
                confirmButtonColor: '#4A7C2A',
                background: '#F6F9F2',
                color: '#1E382B'
            });
            navigate('/properties');
        } catch (error) {
            Swal.fire({
                title: 'Error de Sistema',
                text: 'No se pudo publicar la propiedad. Intenta nuevamente.',
                icon: 'error',
                confirmButtonColor: '#4A7C2A'
            });
            setLoading(false);
        }
    };

    return (
        <section className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-castelia-primary mb-10">
            <h2 className="text-2xl font-black text-castelia-dark mb-6 uppercase tracking-tight">Agregar Nueva Propiedad</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Título del Inmueble</label>
                    <input 
                        type="text" required
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-castelia-primary outline-none transition-all"
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                    />
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Descripción Detallada</label>
                    <textarea 
                        required
                        className="w-full p-3 border border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-castelia-primary outline-none transition-all"
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Precio ($)</label>
                        <input 
                            type="number" required
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-castelia-primary outline-none"
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Ubicación</label>
                        <input 
                            type="text" required
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-castelia-primary outline-none"
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                        />
                    </div>
                </div>

                <div className="bg-castelia-light p-4 rounded-xl border-2 border-dashed border-castelia-primary/30 text-center">
                    <label className="cursor-pointer block">
                        <span className="text-sm text-castelia-dark font-bold">
                            {image ? `Imagen seleccionada: ${image.name}` : 'Haz clic para subir fotografía (Requerido)'}
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
                        Cancelar
                    </button>
                    <button 
                        type="submit" disabled={loading}
                        className="flex-[2] bg-castelia-primary text-white font-black py-3 rounded-xl hover:bg-castelia-accent hover:text-castelia-dark transition-all shadow-lg shadow-castelia-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'Publicando...' : 'Publicar Propiedad'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default CreateProperty;