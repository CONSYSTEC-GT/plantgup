import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Snackbar,
  Alert
} from '@mui/material';

const FileUploadComponent = ({ templateType = 'media', onUploadSuccess, onImagePreview }) => {
  const charLimit = 60;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const APP_ID = 'f63360ab-87b0-44da-9790-63a0d524f9dd';
  const TOKEN = 'sk_2662b472ec0f4eeebd664238d72b61da';

  // Estados
  const [header, setHeader] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaId, setMediaId] = useState('');
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // Estado para la vista previa de la imagen

  // Manejadores de eventos
  const handleHeaderChange = (event) => {
    setHeader(event.target.value);
  };

  const handleMediaTypeChange = (event) => {
    console.log('Tipo de medio cambiado a:', event.target.value);
    setMediaType(event.target.value);
    setSelectedFile(null);
    setMediaId('');
    // Eliminado: setImagePreview(null); // No limpiar la vista previa aquí
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Archivo seleccionado:', file);

    if (!file) return;

    // Verificar el tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo es demasiado grande. El tamaño máximo permitido es 5 MB.');
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    console.log('Detalles del archivo:', {
      nombre: file.name,
      tipo: file.type,
      tamaño: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    });

    setError('');
    setSelectedFile(file);

    // Crear una vista previa de la imagen
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);

      // Notificar al componente padre con la vista previa
      if (onImagePreview) {
        onImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo.');
      return;
    }
  
    try {
      // Subir archivo a Gupshup
      const gupshupFormData = new FormData();
      gupshupFormData.append('file', selectedFile);
      gupshupFormData.append('file_type', selectedFile.type);
  
      const gupshupRequestConfig = {
        method: 'POST',
        headers: {
          Authorization: TOKEN,
        },
        body: gupshupFormData,
      };
  
      const gupshupUrl = `https://partner.gupshup.io/partner/app/${APP_ID}/upload/media`;
  
      setUploadStatus('Subiendo archivo a Gupshup...');
      const gupshupResponse = await fetch(gupshupUrl, gupshupRequestConfig);
  
      if (!gupshupResponse.ok) {
        const errorText = await gupshupResponse.text();
        console.error('Error en la respuesta de Gupshup:', {
          status: gupshupResponse.status,
          statusText: gupshupResponse.statusText,
          errorDetails: errorText,
        });
        throw new Error(`Error en la respuesta de Gupshup: ${gupshupResponse.status} ${gupshupResponse.statusText}`);
      }
  
      const gupshupData = await gupshupResponse.json();
      if (!gupshupData || !gupshupData.handleId) {
        throw new Error('Respuesta de Gupshup incompleta o no válida');
      }
  
      const mediaId = gupshupData.handleId.message;
      setMediaId(mediaId);
  
      // Subir archivo al servicio propio
      const base64Content = await convertToBase64(selectedFile);
      const payload = {
        idEmpresa: 2,
        idBot: 257,
        idBotRedes: 721,
        idUsuario: 48,
        tipoCarga: 3,
        nombreArchivo: selectedFile.name,
        contenidoArchivo: base64Content.split(',')[1],
      };
  
      setUploadStatus('Subiendo archivo al servicio propio...');
      const ownServiceResponse = await fetch('https://dev.talkme.pro/WsFTP/api/ftp/upload', {
        method: 'POST',
        headers: {
          'x-api-token': 'TFneZr222V896T9756578476n9J52mK9d95434K573jaKx29jq',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!ownServiceResponse.ok) {
        throw new Error('Error en la respuesta del servicio propio');
      }
  
      const ownServiceData = await ownServiceResponse.json();
      setUploadedUrl(ownServiceData.url);
  
      // Notificar al componente padre con el mediaId y la URL
      if (onUploadSuccess) {
        onUploadSuccess(mediaId, ownServiceData.url);
      }
  
      setUploadStatus('¡Archivo subido exitosamente!');
    } catch (error) {
      console.error('Error en el upload:', error);
      setError(`Error al subir el archivo: ${error.message || 'Por favor, intenta nuevamente.'}`);
      setUploadStatus('Error al subir el archivo');
    }
  };

  const getAcceptedFileTypes = () => {
    const types = {
      image: 'image/*',
      video: 'video/*',
      document: '.pdf,.doc,.docx,.txt'
    };
    console.log('Tipos de archivo aceptados:', types[mediaType] || '');
    return types[mediaType] || '';
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  return (
    <Box>
      {templateType === "text" ? (
        <>
          <TextField
            fullWidth
            label="Header"
            value={header}
            onChange={handleHeaderChange}
            helperText={`${header.length} / ${charLimit} caracteres`}
            sx={{ mb: 3 }}
          />
        </>
      ) : (
        <>
          <FormControl fullWidth>
            <FormLabel>
              Archivos
            </FormLabel>
          </FormControl>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Seleccione el tipo de media y cargue un archivo.
          </Typography>

          {templateType !== "text" && (
            <Box sx={{ mt: 2 }}>
              <input
                accept={getAcceptedFileTypes()}
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileChange}
              />
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <label htmlFor="file-upload">
                  <Button variant="contained" component="span">
                    Seleccionar Archivo
                  </Button>
                </label>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={!selectedFile}
                >
                  Subir Archivo
                </Button>
              </Box>

              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Archivo seleccionado: {selectedFile.name}
                </Typography>
              )}

              {imagePreview && mediaType === 'image' && (
                <Box sx={{ mt: 2 }}>
                  <img src={imagePreview} alt="Vista previa" style={{ width: '100%', borderRadius: 2 }} />
                </Box>
              )}

              {mediaId && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Media ID: {mediaId}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <div className="space-y-4">
        {uploadStatus && (
          <div className={`mt-2 p-2 rounded ${uploadStatus.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {uploadStatus}
          </div>
        )}
      </div>
    </Box>
  );
};

export default FileUploadComponent;