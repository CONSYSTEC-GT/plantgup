// src/pages/LoginRequired.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginRequired = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Sesión expirada o no encontrada
      </Typography>
      <Typography variant="body1" gutterBottom>
        Por favor, inicia sesión para continuar.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/login')} // Redirige a la página de inicio de sesión
      >
        Iniciar sesión
      </Button>
    </Box>
  );
};

export default LoginRequired;