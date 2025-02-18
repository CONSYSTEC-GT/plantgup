// src/components/ProtectedRoute.jsx
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('authToken'); // Recupera el token

  if (!token) {
    return <Navigate to="/login-required" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem('authToken'); // Remueve el token expirado
      return <Navigate to="/login-required" state={{ from: location }} replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem('authToken'); // Si hay error, limpia el token
    return <Navigate to="/login-required" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
