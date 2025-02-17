// src/components/ProtectedRoute.jsx
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import { useLocation, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  if (!token) {
    // Si no hay token, redirige a la página de error o inicio de sesión
    return <Navigate to="/login-required" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      // Si el token ha expirado, redirige a la página de error o inicio de sesión
      return <Navigate to="/login-required" replace />;
    }

    // Si el token es válido, renderiza el componente hijo (la ruta protegida)
    return children;
  } catch (error) {
    // Si hay un error al decodificar el token, redirige a la página de error o inicio de sesión
    return <Navigate to="/login-required" replace />;
  }
};

export default ProtectedRoute;