import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TemplateForm from '../components/TemplateForm';

const ModifyTemplatePage = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate('/'); // Navega a la página Home
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/*Titulo*/}<Typography variant="h4" component="h1" gutterBottom>
        Modificar Template
      </Typography>

      {/*Boton Regresar*/}<Tooltip title="Volver al Dashboard">
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleHome}
          sx={{ marginBottom: 2 }}
        >
          Regresar
        </Button>
      </Tooltip>


      <TemplateForm />
    </Box>
  );
};

export default ModifyTemplatePage;
