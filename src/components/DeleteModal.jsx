import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

// Estilo para el modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const DeleteModal = ({ open, onClose, onConfirm, template }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="delete-modal-title" variant="h6" gutterBottom>
          ¿Estás seguro de eliminar esta plantilla?
        </Typography>
        <Typography id="delete-modal-description" sx={{ mb: 2 }}>
          La siguiente plantilla será eliminada permanentemente:
        </Typography>
        {template && (
          <Box>
            <Typography variant="body1" gutterBottom>
              <strong>Nombre:</strong> {template.elementName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Estado:</strong> {template.status}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Categoría:</strong> {template.category}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Tipo:</strong> {template.templateType}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Fecha de creación:</strong>{' '}
              {new Date(template.createdOn).toLocaleString()}
            </Typography>
          </Box>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onConfirm}
          >
            Eliminar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteModal;