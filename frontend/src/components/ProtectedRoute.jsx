import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Restricts access to authenticated users only
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-8 text-center">Loading session...</div>;

  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;