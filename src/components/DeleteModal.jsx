import React, { useState } from 'react';
import { Alert, Modal, Box, Typography, Button, Snackbar } from '@mui/material';
import { Delete as DeleteIcon, Check as CheckIcon } from '@mui/icons-material';

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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const appId = 'f63360ab-87b0-44da-9790-63a0d524f9dd';
  const authCode = 'sk_2662b472ec0f4eeebd664238d72b61da';

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const handleDelete = async () => {
    if (!template) return;

    try {
      const response = await fetch(
        `https://partner.gupshup.io/partner/app/${appId}/template/${template.elementName}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: authCode,
          },
        }
      );

      if (response.ok) {
        showSnackbar('✅ Plantilla eliminada exitosamente', 'success');
        onConfirm(template); // Cierra el modal principal
      } else {
        showSnackbar('❌ Error al eliminar la plantilla', 'error');
      }
    } catch (error) {
      console.log('Error en la solicitud:', error);
      showSnackbar('❌ Error al eliminar la plantilla', 'error');
    }
  };

  const handleCloseConfirmationModal = () => {
    setShowConfirmationModal(false);
    onClose();
  };

  if (!template) return null;

  return (
    <>
      <Modal
        open={open}
        onClose={!showConfirmationModal ? onClose : undefined}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={modalStyle}>
          {!showConfirmationModal ? (
            <>
              <Typography id="delete-modal-title" variant="h6" gutterBottom>
                ¿Estás seguro de eliminar esta plantilla?
              </Typography>
              <Typography id="delete-modal-description" sx={{ mb: 2 }}>
                La siguiente plantilla será eliminada permanentemente:
              </Typography>
              <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
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
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDelete}
                >
                  Eliminar
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <CheckIcon
                sx={{
                  fontSize: 60,
                  color: 'success.main',
                  mb: 2,
                }}
              />
              <Typography variant="h6" gutterBottom>
                Plantilla eliminada
              </Typography>
              <Typography sx={{ mb: 3 }}>
                La plantilla se ha eliminado exitosamente.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCloseConfirmationModal}
              >
                Listo
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteModal;