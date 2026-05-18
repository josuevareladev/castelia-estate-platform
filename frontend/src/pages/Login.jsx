import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/authService';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await loginAdmin(email, password);
            Swal.fire({
                title: 'Authenticated Successfully',
                text: 'Welcome back to Castelia Studio Dashboard.',
                icon: 'success',
                confirmButtonColor: '#16a34a'
            });
            navigate('/create');
        } catch (error) {
            Swal.fire({
                title: 'Authentication Failed',
                text: error.response?.data?.error || 'Invalid credentials provided.',
                icon: 'error',
                confirmButtonColor: '#16a34a'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-600 mt-16 mb-10">
            <h2 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight text-center">Admin Access</h2>
            <p className="text-gray-400 text-xs text-center uppercase font-bold mb-6">Castelia Studio Management</p>
            
            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Email Address</label>
                    <input 
                        type="email" required
                        placeholder="admin@castelia.com"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-xs font-black uppercase text-gray-400 mb-1 block">Password</label>
                    <input 
                        type="password" required
                        placeholder="••••••••"
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-600 outline-none transition-all"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button 
                    type="submit" disabled={loading}
                    className="w-full bg-green-600 text-white font-black py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 disabled:opacity-50"
                >
                    {loading ? 'Verifying Identity...' : 'Log In'}
                </button>
            </form>
        </section>
    );
};

export default Login;