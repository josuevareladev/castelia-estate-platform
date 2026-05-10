import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Breadcrumb from './components/Breadcrumb';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';


const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-castelia-light text-castelia-dark font-sans flex flex-col">
        
        {/* Navegación fija en la parte superior (Sticky Header) */}
        <Navbar />

        {/* Contenedor principal con espaciado profesional de Castelia Studio */}
        <main className="flex-grow max-w-7xl mx-auto w-full p-6 mt-4">
          
          {/* Indicador de ruta dinámico (Organic Breadcrumb) */}
          <Breadcrumb />
          
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rutas Protegidas (Requieren autenticación JWT) */}
            <Route 
              path="/properties" 
              element={
                <ProtectedRoute>
                  <Properties />
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta Dinámica para Detalle de Propiedad */}
            <Route 
              path="/properties/:id" 
              element={
                <ProtectedRoute>
                  <PropertyDetail />
                </ProtectedRoute>
              } 
            />

            {/* Ruta para Crear Nueva Propiedad */}
            <Route 
              path="/create-property" 
              element={
                <ProtectedRoute>
                  <CreateProperty />
                </ProtectedRoute>
              } 
            />

            {/* Ruta Dinámica para Editar Propiedad Existente */}
            <Route 
              path="/edit-property/:id" 
              element={
                <ProtectedRoute>
                  <EditProperty />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        
        {/* Footer institucional de Castelia Studio */}
        <footer className="py-6 text-center text-gray-400 text-xs tracking-widest uppercase">
          © 2026 Prime Estate Platform | Castelia Studio Development
        </footer>
      </div>
    </Router>
  );
};

export default App;