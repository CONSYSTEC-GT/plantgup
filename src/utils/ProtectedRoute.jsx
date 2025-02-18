import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login-required" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      localStorage.removeItem('authToken');
      return <Navigate to="/login-required" state={{ from: location }} replace />;
    }

    return children;
  } catch (error) {
    localStorage.removeItem('authToken');
    return <Navigate to="/login-required" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;