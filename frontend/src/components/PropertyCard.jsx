import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col cursor-pointer">
      <div className="relative overflow-hidden h-60">
        {/* Contenedor de imagen con efecto de escala expansible */}
        <img 
          src={property.image || 'https://via.placeholder.com/400x250?text=Image+Not+Available'} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-castelia-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
          {property.status}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-castelia-dark mb-2">{property.title}</h3>
        <p className="text-gray-500 mb-4 flex items-center text-sm">
          <svg className="w-4 h-4 mr-1 text-castelia-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.location}
        </p>
        
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-2xl font-extrabold text-castelia-dark">${property.price}</span>
          
          {/* Integración con la ruta de detalle dinámica */}
          <Link 
            to={`/properties/${property._id}`}
            className="text-castelia-primary font-semibold hover:text-castelia-accent transition-colors py-2 px-4 rounded-lg hover:bg-castelia-primary/5 transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;