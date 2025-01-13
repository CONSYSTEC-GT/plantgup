import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const EditTemplatePage = () => {
  const { templateId } = useParams();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Editar Plantilla
      </Typography>
      <Typography variant="body1">
        Estás editando la plantilla con ID: {templateId}.
      </Typography>
      {/* Aquí puedes agregar tu formulario o lógica para editar la plantilla */}
    </Box>
  );
};

export default EditTemplatePage;
