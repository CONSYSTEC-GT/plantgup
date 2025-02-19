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
    setImagePreview(null); // Limpiar la vista previa al cambiar el tipo de medio
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
  
    // Generar vista previa local antes de subir
    const previewURL = URL.createObjectURL(selectedFile);
    setImagePreview(previewURL); // Guarda la vista previa en el estado
  
    // Enviar la vista previa al componente padre
    if (onImagePreview) {
      onImagePreview(previewURL);
    }
  
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('file_type', selectedFile.type);
  
    const requestConfig = {
      method: 'POST',
      headers: {
        Authorization: TOKEN,
      },
      body: formData,
    };
  
    const url = `https://partner.gupshup.io/partner/app/${APP_ID}/upload/media`;
  
    try {
      setUploadStatus('Subiendo archivo...');
      const response = await fetch(url, requestConfig);
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta:', {
          status: response.status,
          statusText: response.statusText,
          errorDetails: errorText
        });
        setUploadStatus('Error al subir el archivo');
        throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('=== Respuesta exitosa ===', data);
  
      // Extraer el mediaId
      const mediaId = data.handleId.message;
      setMediaId(mediaId);
      setUploadStatus('¡Archivo subido exitosamente!');
  
      // Notificar al componente padre con el mediaId
      if (onUploadSuccess) {
        onUploadSuccess(mediaId);
      }
    } catch (error) {
      console.error('=== Error en el upload ===', error);
      setError('Error al subir el archivo. Por favor, intenta nuevamente.');
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
          <FormControl fullWidth sx={{ mb: 3 }}>
            <RadioGroup
              row
              value={mediaType}
              onChange={handleMediaTypeChange}
            >
              <FormControlLabel value="image" control={<Radio />} label="Imagen" />
              <FormControlLabel value="video" control={<Radio />} label="Video" />
              <FormControlLabel value="document" control={<Radio />} label="Documento" />
            </RadioGroup>
          </FormControl>

          {mediaType && (
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