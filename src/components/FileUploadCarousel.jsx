import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Alert, Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, Typography, TextField, Snackbar, } from '@mui/material';

const FileUploadComponent = ({ onUploadSuccess, onImagePreview, onHeaderChange }) => {

  // Recupera el token del localStorage
  const token = localStorage.getItem('authToken');

  // Decodifica el token para obtener appId y authCode
  let appId, authCode, idUsuarioTalkMe, idNombreUsuarioTalkMe, empresaTalkMe;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      appId = decoded.app_id; // Extrae appId del token
      authCode = decoded.auth_code; // Extrae authCode del token
      idUsuarioTalkMe = decoded.id_usuario;
      idNombreUsuarioTalkMe = decoded.nombre_usuario;
      empresaTalkMe = decoded.empresa;
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  const charLimit = 60;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  // Estados
  const [header, setHeader] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [mediaId, setMediaId] = useState('');
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // Estado para la vista previa de la imagen
  const [uploadedUrl, setUploadedUrl] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModalArchivos, setshowErrorModalArchivos] = useState(false);



  // Manejadores de eventos
  const handleHeaderChange = (e) => {
    const newHeader = e.target.value;
    setHeader(newHeader);

    // Añade esta línea para notificar al componente padre
    if (onHeaderChange) onHeaderChange(newHeader);
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Archivo seleccionado:', file);

    if (!file) return;

    // Verificar el tamaño del archivo
    if (file.size > MAX_FILE_SIZE) {
      setshowErrorModalArchivos(true);
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
      console.error('Error: No se ha seleccionado ningún archivo.');
      return;
    }

    setIsUploading(true);

    try {
      console.log('Iniciando proceso de subida de archivo...');

      console.log('Convirtiendo archivo a Base64...');
      const base64Content = await convertToBase64(selectedFile);
      console.log('Archivo convertido a Base64.');

      const payload = {
        idEmpresa: empresaTalkMe,
        idBot: 54,
        idBotRedes: 721,
        idUsuario: idUsuarioTalkMe,
        tipoCarga: 3,
        nombreArchivo: selectedFile.name,
        contenidoArchivo: base64Content.split(',')[1],
      };

      console.log('Preparando solicitud al servicio propio...');
      setUploadStatus('Subiendo archivo al servicio propio...');

      const ownServiceResponse = await axios.post(
        'https://dev.talkme.pro/WsFTP/api/ftp/upload',
        payload,
        {
          headers: {
            'x-api-token': 'TFneZr222V896T9756578476n9J52mK9d95434K573jaKx29jq',
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Request completo al servicio propio:', {
        url: 'https://certificacion.talkme.pro/WsFTP/api/ftp/upload',
        method: 'POST',
        headers: {
          'x-api-token': 'TFneZr222V896T9756578476n9J52mK9d95434K573jaKx29jq',
          'Content-Type': 'application/json',
          'origin': 'https://certificacion.talkme.pro/',
        },
        data: payload,
      });

      console.log('Respuesta del servicio propio recibida:', ownServiceResponse);

      if (ownServiceResponse.status !== 200 || !ownServiceResponse.data) {
        console.error('Error en la respuesta del servicio propio:', {
          status: ownServiceResponse.status,
          statusText: ownServiceResponse.statusText,
          errorDetails: ownServiceResponse.data,
        });
        throw new Error('Error en la respuesta del servicio propio');
      }

      const ownServiceData = ownServiceResponse.data;
      console.log('Datos del servicio propio:', ownServiceData);

      // Notificar al componente padre con el mediaId y la URL
      if (onUploadSuccess) {
        console.log('Notificando al componente padre con el mediaId y la URL...');
        onUploadSuccess(ownServiceData.url); // Pasar ambos valores
        setShowSuccessModal(true);
      }

      console.log('Proceso de subida completado exitosamente.');
      //setUploadStatus('¡Archivo subido exitosamente!');
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      
      console.error('Error en el proceso de subida:', error);

      // Imprimir el request completo en caso de error
      if (error.config) {
        console.error('Request completo que causó el error:', {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          data: error.config.data,
        });
      }

      setIsUploading(false);
      setError(`Error al subir el archivo: ${error.message || 'Por favor, intenta nuevamente.'}`);
      //setUploadStatus('Error al subir el archivo');
    }
  };

  const getAcceptedFileTypes = () => {
    const types = {
      image: '.jpeg, .png',
      video: '.mp4, .3gp',
      document: '.pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt'
    };
    //console.log('Tipos de archivo aceptados:', types[mediaType] || '');
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
      <FormControl fullWidth>
        <FormLabel>
          Carrusel
        </FormLabel>
      </FormControl>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Seleccione la imagen y cargue un archivo.
      </Typography>

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
          {isUploading && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}
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

      <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <DialogTitle>¡Éxito!</DialogTitle>
        <DialogContent>
          <Typography>La imagen fue subida correctamente.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccessModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showErrorModalArchivos} onClose={() => setShowSuccessModal(false)}>
        <DialogTitle>Información</DialogTitle>
        <DialogContent>
          <Typography>El archivo es demasiado grande. El tamaño máximo permitido es 5 MB.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSuccessModal(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUploadComponent;