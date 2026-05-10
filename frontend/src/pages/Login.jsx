import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const responseData = await loginAdmin(email, password);
      
      // Armamos el objeto de usuario con la respuesta plana que vimos en la red
      const userData = {
        _id: responseData._id,
        name: responseData.name,
        email: responseData.email
      };

      // Guardamos la sesión y cruzamos la puerta hacia /properties
      login(userData, responseData.token); 
      navigate('/properties'); 
    } catch (err) {
      setError('Invalid credentials. Please check your email and password.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full border-t-4 border-castelia-primary">
        <h2 className="text-2xl font-bold text-castelia-dark mb-2">Admin Portal Access</h2>
        <p className="text-gray-600 mb-6 text-sm">Enter your credentials to manage Prime Estate Platform.</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-castelia-dark mb-1">Email Address</label>
            <input 
              type="email" 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-castelia-primary focus:border-transparent transition-all"
              placeholder="admin@prime.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-castelia-dark mb-1">Password</label>
            <input 
              type="password" 
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-castelia-primary focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-castelia-primary hover:bg-castelia-accent hover:text-castelia-dark text-white font-bold py-2 px-4 rounded transition-all mt-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;