import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Alert, Box, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormLabel, Typography, TextField, Snackbar, } from '@mui/material';

import { CustomDialog } from '../utils/CustomDialog';

const FileUploadComponent = ({ onUploadSuccess, onImagePreview, onHeaderChange, initialFile = null }) => {

  // Recupera el token del localStorage
  const token = localStorage.getItem('authToken');

  // Decodifica el token para obtener appId y authCode
  let appId, authCode, idUsuarioTalkMe, idNombreUsuarioTalkMe, empresaTalkMe, idBotRedes, idBot, urlTemplatesGS, urlWsFTP, apiToken;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      appId = decoded.app_id; // Extrae appId del token
      authCode = decoded.auth_code; // Extrae authCode del token
      idUsuarioTalkMe = decoded.id_usuario;
      idNombreUsuarioTalkMe = decoded.nombre_usuario;
      empresaTalkMe = decoded.empresa;
      idBotRedes = decoded.id_bot_redes;
      idBot = decoded.id_bot;
      urlTemplatesGS = decoded.urlTemplatesGS;
      urlWsFTP = decoded.urlWsFTP;
      apiToken = decoded.apiToken;
      console.log('idBot:', idBot);
      console.log('idBotRedes:', idBotRedes);
      console.log('urlTemplatesGS', urlTemplatesGS);
      console.log('apiToken', apiToken);
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

  // Efecto para cargar el archivo inicial si existe
  useEffect(() => {
    if (initialFile && initialFile.url) {
      setImagePreview(initialFile.url);
    }
  }, [initialFile]);


  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Archivo seleccionado:', file);

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo es demasiado grande');
      setSelectedFile(null);
      setImagePreview(initialFile?.url || null);  // Mantener preview anterior si existe
      event.target.value = '';
      return;
    }

    setError('');
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      onImagePreview?.(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo.');
      return;
    }

    setIsUploading(true);

    try {
      const base64Content = await convertToBase64(selectedFile);
      
      const payload = {
        idEmpresa: empresaTalkMe,
        idBot: 54,
        idBotRedes: 149,
        idUsuario: idUsuarioTalkMe || 48,
        tipoCarga: 3,
        nombreArchivo: selectedFile.name,
        contenidoArchivo: base64Content.split(',')[1],
      };

      const response = await axios.post(
        urlWsFTP,
        payload,
        {
          headers: {
            'x-api-token': apiToken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status !== 200 || !response.data) {
        throw new Error('Error en la respuesta del servicio');
      }

      const mediaId = response.data.mediaId || response.data.id || `media-${Date.now()}`;
      
      onUploadSuccess({
        mediaId: mediaId,
        url: response.data.url,
        type: selectedFile.type.includes('image') ? 'image' : 'video'
      });

      // Limpieza parcial - mantener el preview del nuevo archivo subido
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFileInputKey(prev => prev + 1);
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Error en el proceso de subida:', error);
      setShowErrorModal(true);
      setError(`Error al subir el archivo: ${error.message || 'Por favor, intenta nuevamente.'}`);
    } finally {
      setIsUploading(false);
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