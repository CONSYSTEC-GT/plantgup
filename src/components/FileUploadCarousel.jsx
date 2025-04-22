import React, { useState, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Alert, Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, Typography, TextField, Snackbar, } from '@mui/material';

import { CustomDialog } from '../utils/CustomDialog';

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
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [fileInputKey, setFileInputKey] = useState(0);


  


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
      setError('El archivo es demasiado grande');
      setSelectedFile(null);
      setImagePreview(null);
      event.target.value = ''; // Resetear input
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

      const base64Content = await convertToBase64(selectedFile);
      
      const payload = {
        idEmpresa: empresaTalkMe, // Asegúrate de que estas variables estén definidas
        idBot: 257,
        idBotRedes: 721,
        idUsuario: idUsuarioTalkMe || 48,
        tipoCarga: 3,
        nombreArchivo: selectedFile.name,
        contenidoArchivo: base64Content.split(',')[1],
      };

      console.log('Preparando solicitud al servicio...');

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

      console.log('Respuesta del servicio recibida:', ownServiceResponse);

      if (ownServiceResponse.status !== 200 || !ownServiceResponse.data) {
        throw new Error('Error en la respuesta del servicio');
      }

      const ownServiceData = ownServiceResponse.data;
      console.log('Datos del servicio:', ownServiceData);

      // Generamos un ID único para el medio si no viene en la respuesta
      const mediaId = ownServiceData.mediaId || ownServiceData.id || `media-${Date.now()}`;

      // Mostrar diálogo de éxito
      setShowSuccessModal(true);
      
      // Notificar al componente padre
      if (onUploadSuccess) {
        console.log('Notificando al componente padre con estructura correcta');
        onUploadSuccess({
          mediaId: mediaId,
          url: ownServiceData.url
        });
      }

      // Limpieza completa después de subida exitosa
      resetComponent();
      
      console.log('Proceso de subida completado exitosamente.');
    } catch (error) {
      console.error('Error en el proceso de subida:', error);
      setShowErrorModal(true); // Mostrar diálogo de error
      setIsUploading(false);
      setError(`Error al subir el archivo: ${error.message || 'Por favor, intenta nuevamente.'}`);
    }
  };

  // Función para resetear completamente el componente
  const resetComponent = () => {
    // Reset del estado
    setSelectedFile(null);
    setImagePreview(null);
    setError('');
    setIsUploading(false);
    
    // Reset del input file (dos métodos para asegurar compatibilidad)
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Forzar re-renderizado del input
    setFileInputKey(prev => prev + 1);
    
    // Notificar al padre que ya no hay vista previa
    if (onImagePreview) {
      onImagePreview(null);
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

  const fileInputRef = useRef(null);

  return (
    <Box>
      
      

      <Box sx={{ mb: 2 }}>
        <input
          accept=".jpg, .jpeg, .png"
          style={{ display: 'none' }}
          id={`file-upload-${fileInputKey}`}
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          key={fileInputKey}
        />
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <label htmlFor={`file-upload-${fileInputKey}`}>
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

      {/* Diálogo de éxito */}
      <CustomDialog
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="¡Éxito!"
        message="La imagen fue subida correctamente."
        severity="success"
        buttonVariant="contained"
      />

      {/* Diálogo de error */}
      <CustomDialog
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Error al cargar archivo"
        message={"El archivo es demasiado grande. El tamaño máximo permitido es 5 MB."}
        severity="error"
        buttonVariant="contained"
      />
      
    </Box>
  );
};

export default FileUploadComponent;