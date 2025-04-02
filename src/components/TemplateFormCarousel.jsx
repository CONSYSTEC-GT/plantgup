import React, { useState, useRef, useEffect } from 'react';
import { Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Container, Dialog, DialogTitle, DialogContent, Divider, FormControl, FormControlLabel, FormLabel, FormHelperText, Grid, Grid2, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Snackbar, Stack, TextField, Tooltip, Typography, alpha } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

import { Smile } from "react-feather"; // Icono para emojis
import EmojiPicker from "emoji-picker-react"; // Selector de emojis

// Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Delete from '@mui/icons-material/Delete';
import ArrowForward from "@mui/icons-material/ArrowForward";
import Link from "@mui/icons-material/Link";
import Phone from "@mui/icons-material/Phone";
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import FileUploadComponent from './FileUploadComponent';
import { isValidURL, updateButtonWithValidation } from '../utils/validarUrl';
import { createTemplateGupshup } from '../api/gupshupApi';
import { saveTemplateToTalkMe } from '../api/templatesGSApi';

const TemplateFormCarousel = () => {

  //CAMPOS DEL FORMULARIO PARA EL REQUEST
  const [templateName, setTemplateName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [templateType, setTemplateType] = useState("text");
  const [templateNameHelperText, setTemplateNameHelperText] = useState("El nombre debe hacer referencia al texto de su plantilla.");
  const [templateNameError, setTemplateNameError] = useState(false);
  const [vertical, setVertical] = useState("");
  const [message, setMessage] = useState("");
  const [header, setHeader] = useState("");
  const [footer, setFooter] = useState("");
  const [buttons, setButtons] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [example, setExample] = useState("");
  const [exampleMedia, setExampleMedia] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [languageCode, setLanguageCode] = useState("es"); // Valor predeterminado: español
  const [languageTypeError, setLanguageTypeError] = useState(false);
  const [languageTypeHelperText, setLanguageTypeHelperText] = useState("");

  const [categoriaPlantilla, setcategoriaPlantilla] = useState("");
  const [categoriaPlantillaError, setcategoriaPlantillaError] = useState(false);
  const [categoriaPlantillaHelperText, setcategoriaPlantillaHelperText] = useState("");

  const [etiquetaPlantilla, setetiquetaPlantilla] = useState("");
  const [etiquetaPlantillaError, setetiquetaPlantillaError] = useState(false);
  const [etiquetaPlantillaHelperText, setetiquetaPlantillaHelperText] = useState("");

  const [contenidoPlantilla, setcontenidoPlantilla] = useState("");
  const [contenidoPlantillaTypeError, setcontenidoPlantillaTypeError] = useState(false);
  const [contenidoPlantillaTypeHelperText, setcontenidoPlantillaTypeHelperText] = useState("");

  const [ejemploPlantilla, setejemploPlantilla] = useState("");
  const [ejemploPlantillaError, setejemploPlantillaError] = useState(false);
  const [ejemploPlantillaHelperText, setejemploPlantillaHelperText] = useState("");

  //const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [variables, setVariables] = useState([]);

  // Estado para almacenar ejemplos de variables
  const [variableExamples, setVariableExamples] = useState({});
  const [variableExamplesError, setvariableExamplesError] = useState(false);
  const [variableExamplesHelperText, setvariableExamplesHelperText] = useState("");
  const [variableErrors, setVariableErrors] = useState({});

  // Estado para almacenar descripciones de variables
  const [variableDescriptions, setVariableDescriptions] = useState({});
  const [variableDescriptionsError, setvariableDescriptionsError] = useState(false);
  const [variableDescriptionsHelperText, setvariableDescriptionsHelperText] = useState("");

  //ESTE ES PARA EL EXAMPLE MEDIA
  const [mediaId, setMediaId] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const templateNameRef = useRef(null);
  const templateTypeRef = useRef(null);
  const languageCodeRef = useRef(null);
  const verticalRef = useRef(null);
  const messageRef = useRef(null);
  const exampleRef = useRef(null);
  const selectedCategoryRef = useRef(null);
  const exampleRefs = useRef({});

  // Función para mostrar Snackbar
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  // Función para cerrar Snackbar
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const validateFields = () => {
    let isValid = true;

    console.log("Iniciando validación de campos...");

    if (!templateName || templateName.trim() === "") {
      console.log("Error: templateName está vacío o no es válido.");
      setTemplateNameError(true);
      setTemplateNameHelperText("Este campo es requerido");
      isValid = false;
      if (templateNameRef.current) templateNameRef.current.focus();
      console.log("Estado de isValid después de validar templateName:", isValid);
      // No retornar aquí, continuar con la validación de otros campos
    } else {
      console.log("templateName es válido.");
    }

    if (!templateType || templateType.trim() === "") {
      console.log("Error: templateType está vacío o no es válido.");
      setTemplateTypeError(true);
      setTemplateTypeHelperText("Este campo es requerido");
      isValid = false;
      if (templateTypeRef.current) templateTypeRef.current.focus();
      console.log("Estado de isValid después de validar templateType:", isValid);
      // No retornar aquí, continuar con la validación de otros campos
    } else {
      console.log("templateType es válido.");
    }

    if (!languageCode || languageCode.trim() === "") {
      console.log("Error: languageCode está vacío o no es válido.");
      setLanguageTypeError(true);
      setLanguageTypeHelperText("Este campo es requerido");
      isValid = false;
      if (languageCodeRef.current) languageCodeRef.current.focus();
      console.log("Estado de isValid después de validar languageCode:", isValid);
      // No retornar aquí, continuar con la validación de otros campos
    } else {
      console.log("languageCode es válido.");
    }

    if (!vertical || vertical.trim() === "") {
      console.log("Error: vertical está vacío o no es válido.");
      setetiquetaPlantillaError(true);
      isValid = false;
      if (verticalRef.current) verticalRef.current.focus();
      console.log("Estado de isValid después de validar vertical:", isValid);
      // No retornar aquí, continuar con la validación de otros campos
    } else {
      console.log("vertical es válido.");
    }

    if (!message || message.trim() === "") {
      console.log("Error: message está vacío o no es válido.");
      setcontenidoPlantillaTypeError(true);
      setcontenidoPlantillaTypeHelperText("Este campo es requerido");
      isValid = false;
      if (messageRef.current) messageRef.current.focus();
      console.log("Estado de isValid después de validar message:", isValid);
      // No retornar aquí, continuar con la validación de otros campos
    } else {
      console.log("message es válido.");
    }

    if (!example || example.trim() === "") {
      console.log("Error: example está vacío o no es válido.");
      setejemploPlantillaError(true);
      setejemploPlantillaHelperText("Este campo es requerido");
      isValid = false;
      if (exampleRef.current) exampleRef.current.focus();
      console.log("Estado de isValid después de validar example:", isValid);
      // No retornar aquí, continuar con la validación de otros campos
    } else {
      console.log("example es válido.");
    }

    if (!selectedCategory || selectedCategory.trim() === "") {
      console.log("Error: selectedCategory está vacío o no es válido.");
      setcategoriaPlantillaError(true);
      setcategoriaPlantillaHelperText("Este campo es requerido");
      isValid = false;
      if (selectedCategoryRef.current) selectedCategoryRef.current.focus();
      console.log("Estado de isValid después de validar selectedCategory:", isValid);
      // No retornar aquí, continuar con la validación de otros campos
    } else {
      console.log("selectedCategory es válido.");
    }

    // Validar que todas las variables tengan un texto de ejemplo
    if (variables.length > 0) {
      console.log("Validando variables...");
      const newErrors = {}; // Objeto para almacenar los errores

      for (const variable of variables) {
        if (!variableExamples[variable] || variableExamples[variable].trim() === "") {
          console.log(`Error: La variable ${variable} no tiene un ejemplo válido.`);
          isValid = false;
          newErrors[variable] = "Este campo es requerido"; // Asignar mensaje de error

          // Colocar el foco en el campo de texto de ejemplo vacío
          if (exampleRefs.current[variable]) {
            exampleRefs.current[variable].focus();
          }
        } else {
          console.log(`La variable ${variable} es válida.`);
          newErrors[variable] = ""; // Sin error
        }
      }

      // Actualizar el estado de errores
      setVariableErrors(newErrors);

      // Si hay errores, no retornar aquí, continuar con el flujo
      if (!isValid) {
        console.log("Errores encontrados en las variables. isValid:", isValid);
      } else {
        console.log("Todas las variables son válidas.");
      }
    } else {
      console.log("No hay variables para validar.");
    }

    console.log("Validación completada. isValid:", isValid);
    return isValid; // Retornar el valor final de isValid
  };

  // Función para determinar el tipo de archivo basado en la extensión
  const getMediaType = (url) => {
    // Extraer la extensión del archivo de la URL
    const extension = url.split('.').pop().toLowerCase();

    // Determinar el tipo de archivo basado en la extensión
    if (['png', 'jpeg', 'jpg', 'gif'].includes(extension)) {
      return 'IMAGE';
    } else if (['mp4', '3gp', 'mov', 'avi'].includes(extension)) {
      return 'VIDEO';
    } else if (['txt', 'xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf'].includes(extension)) {
      return 'DOCUMENT';
    } else {
      return 'null'; // En caso de que la extensión no sea reconocida
    }
  };

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
      console.log('appId:', appId);
      console.log('authCode:', authCode);
      console.log('idUsuarioTalkMe:', idUsuarioTalkMe);
      console.log('idNombreUsuarioTalkMe:', idNombreUsuarioTalkMe);
      console.log('empresaTalkMe:', empresaTalkMe);

    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  const iniciarRequest = async () => {
    try {
      // Hacer el primer request a GupShup API
      const result = await createTemplateGupshup(
        appId,
        authCode,
        {
          templateName,
          selectedCategory,
          languageCode,
          templateType,
          vertical,
          message,
          header,
          footer,
          mediaId,
          buttons,
          example
        },
        validateFields
      );

      // Verificar si el primer request fue exitoso
      if (result && result.status === "success") {
        // Extraer el valor de `id` del objeto `template`
        const templateId = result.template.id;

        // Hacer el segundo request a TalkMe API
        const result2 = await saveTemplateToTalkMe(
          templateId,
          {
            templateName,
            selectedCategory,
            message,
            uploadedUrl
          },
          idNombreUsuarioTalkMe || "Sistema.TalkMe",
          variables,
          variableDescriptions
        );

        // El tercer request se maneja dentro de saveTemplateToTalkMe
      } else {
        console.error("El primer request no fue exitoso o no tiene el formato esperado.");
        console.error("Resultado del primer request:", result);
      }
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }
  };

  //MEDIA
  const handleUploadSuccess = (uploadedMediaId) => {
    console.log('Media subida exitosamente, ID:', uploadedMediaId);
    setMediaId(uploadedMediaId);
    // Mostrar mensaje de éxito
    showSnackbar("✅ Archivo subido exitosamente", "success");
  };

  // CATEGORIAS
  const categories = [
    {
      id: 'MARKETING',
      title: 'Marketing',
      description: 'Envía ofertas promocionales, ofertas de productos y más para aumentar la conciencia y el compromiso.',
      icon: <EmailOutlinedIcon />,
    },
    {
      id: 'utility',
      title: 'Utilidad',
      description: 'Envía actualizaciones de cuenta, actualizaciones de pedidos, alertas y más para compartir información importante.',
      icon: <NotificationsNoneOutlinedIcon />,
    },
    {
      id: 'authentication',
      title: 'Autenticación',
      description: 'Envía códigos que permiten a tus clientes acceder a su cuenta.',
      icon: <VpnKeyOutlinedIcon />,
      disabled: true
    }
  ];
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  //NOMBRE PLANTILLA
  const handleTemplateNameChange = (event) => {
    // Reemplazar espacios con guiones bajos
    const newValue = event.target.value.replace(/\s+/g, '_');

    // Actualizar el estado con el nuevo valor
    setTemplateName(newValue);

    // Validar si el campo está vacío
    if (newValue.trim() === "") {
      setTemplateNameError(true);
      setTemplateNameHelperText("Este campo es requerido");
    } else {
      setTemplateNameError(false);
      setTemplateNameHelperText("");
    }
  };

  //IDIOMA PLANTILLA
  const handleLanguageCodeChange = (event) => {
    const selectedLanguage = event.target.value; // Esto ya es el código de idioma ("es", "en", "fr")
    setLanguageCode(selectedLanguage); // Actualiza el estado directamente con el código

    if (selectedLanguage.trim() === "") {
      setLanguageTypeError(true);
      setLanguageTypeHelperText("Este campo es requerido");
    } else {
      setLanguageTypeError(false);
      setLanguageTypeHelperText("");
    }
  };

  // Mapeo de idiomas (código -> nombre)
  const languageMap = {
    es: "Español",
    en: "Inglés",
    fr: "Francés",
  };

  const reverseLanguageMap = {
    es: "español",
    en: "inglés",
    fr: "frances",
  };

  //VERTICAL PLANTILLA
  const handleVerticalChange = (event) => {
    setVertical(event.target.value)
  }

  //TIPO PLANTILLA
  const handleTemplateTypeChange = (event) => {
    const newType = event.target.value;
    setTemplateType(newType);

    // Solo limpiar header si el nuevo tipo NO es "TEXT"
    if (newType !== "TEXT") {
      setHeader("");
    }

    setMediaType("");
    setMediaURL("");

    if (newType.trim() === "") {
      setTemplateTypeError(true);
      setTemplateTypeHelperText("Este campo es requerido");
    } else {
      setTemplateTypeError(false);
      setTemplateTypeHelperText("");
    }
  };


  const handleHeaderTemplateTypeChange = (event) => {
    setTemplateType(event.target.value);
    setHeader(''); // Resetear el header al cambiar el tipo
  };

  const handleHeaderTypeChange = (event) => {
    const value = event.target.value;
    if (value.length <= charLimit) {
      setHeader(value);
    }
  };

  //HEADER PLANTILLA
  const [mediaType, setMediaType] = useState(""); // Tipo de media (image, video, etc.)
  const [mediaURL, setMediaURL] = useState(""); // URL del media
  const [selectedFile, setSelectedFile] = useState(null);
  const MAX_IMG_SIZE = 5 * 1024 * 1024; // 5 MB en bytes
  const [error, setError] = useState(''); // Estado para manejar errores



  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
  };

  const handleCloseError = () => {
    setError(''); // Cerrar el mensaje de error
  };

  const handleMediaURLChange = (event) => {
    setMediaURL(event.target.value);
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > MAX_IMG_SIZE) {
      setError('El archivo es demasiado grande. El tamaño máximo permitido es 5 MB.');
      setSelectedFile(null);//Limpiar el archivo seleccionado
    } else {
      setError(''); //Limpio el mensaje de error
      setSelectedFile(selectedFile);
      console.log('Archivo seleccionado:', selectedFile);
    }
  };

  const handleHeaderChange = (e) => {
    if (e.target.value.length <= charLimit) {
      setHeader(e.target.value)
    }
    console.log("Nuevo valor de header:", event.target.value);
  };

  //FOOTER PLANTILLA
  const handleFooterChange = (e) => {
    if (e.target.value.length <= charLimit) {
      setFooter(e.target.value);
    }
  };

  const charLimit = 60;
  const maxButtons = 10;

  //BOTONES PLANTILLA
  const addButton = () => {
    if (buttons.length < maxButtons) {
      setButtons([
        ...buttons,
        { id: Date.now(), type: "QUICK_REPLY", title: "", url: "", phoneNumber: "" }
      ]);
    }
  };

  const updateButton = (id, key, value) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id ? { ...button, [key]: value } : button
      )
    );
  };

  const removeButton = (id) => {
    setButtons(buttons.filter((button) => button.id !== id));
  };

  // VARIABLES DEL BODY MESSAGE
  const handleAddVariable = () => {
    const newVariable = `{{${variables.length + 1}}}`;
    setMessage((prev) => `${prev} ${newVariable}`);
    setVariables([...variables, newVariable]);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => `${prev} ${emojiObject.emoji}`);
    setShowEmojiPicker(false);
  };

  // Nueva función para borrar una variable específica
  const deleteVariable = (variableToDelete) => {
    // Eliminar la variable del texto
    const newMessage = message.replace(variableToDelete, '');
    setMessage(newMessage);

    // Eliminar la variable de la lista de variables
    const updatedVariables = variables.filter(v => v !== variableToDelete);
    setVariables(updatedVariables);

    messageRef.current?.focus();
  };

  // Nueva función para borrar todas las variables
  const deleteAllVariables = () => {
    let newMessage = message;
    variables.forEach(variable => {
      newMessage = newMessage.replaceAll(variable, '');
    });
    setMessage(newMessage);
    setVariables([]);
    messageRef.current?.focus();
  };

  // Función para previsualizar el mensaje con ejemplos aplicados
  const previewMessage = () => {
    let previewHeader = header;
    let previewFooter = footer;
    let previewText = message;
    Object.entries(variableExamples).forEach(([variable, example]) => {
      previewHeader = previewHeader.replaceAll(variable, example);
      previewFooter = previewFooter.replaceAll(variable, example);
      previewText = previewText.replaceAll(variable, example);
    });
  }

  const handleUpdateExample = (variable, value) => {
    setVariableExamples(prevExamples => {
      const updatedExamples = { ...prevExamples, [variable]: value };
      console.log("Ejemplo actualizado:", updatedExamples);
      return updatedExamples;
    });
  };

  const handleUpdateDescriptions = (variable, value) => {
    setVariableDescriptions(prevDescriptions => ({
      ...prevDescriptions,
      [variable]: value
    }));
  };

  // Función para generar el ejemplo combinando el mensaje y los valores de las variables
  const generateExample = () => {
    let generatedExample = message;
    Object.keys(variableExamples).forEach(variable => {
      generatedExample = generatedExample.replace(new RegExp(variable, 'g'), variableExamples[variable]);
    });
    return generatedExample;
  };

  // Función para reemplazar las variables en el mensaje con sus ejemplos
  const replaceVariables = (text, variables) => {
    let result = text;
    console.log("Texto antes de reemplazar:", text);

    Object.keys(variables).forEach(variable => {
      const regex = new RegExp(`\\{\\{${variable}\\}\\}`, 'g'); // 🔥 Búsqueda exacta de {{variable}}
      console.log(`Reemplazando: {{${variable}}} por ${variables[variable]}`);
      result = result.replace(regex, variables[variable]);
    });

    console.log("Texto después de reemplazar:", result);
    return result;
  };

  // Actualizar el campo "example" y "message" cuando cambie el mensaje o los ejemplos de las variables
  useEffect(() => {
    console.log("Mensaje original:", message);
    console.log("Variables y ejemplos:", variableExamples);

    const newExample = replaceVariables(message, variableExamples);

    console.log("Mensaje después de reemplazo:", newExample);

    setExample(newExample);
  }, [message, variableExamples]);

  //PARA LAS TARJETAS DEL CARRUSEL
  const [cards, setCards] = useState([]);

  const [openCardDialog, setOpenCardDialog] = useState(false);
  const [currentCard, setCurrentCard] = useState({
    title: '',
    description: '',
    buttons: []
  });

  const handleAddCard = () => {
    setOpenCardDialog(true);
  };

  const handleCloseCardDialog = () => {
    setOpenCardDialog(false);
    // Reset card and upload states
    setCurrentCard({
      title: '',
      description: '',
      buttons: []
    });
    setMediaId(null);
    setUploadedUrl(null);
    setImagePreview(null);
  };

  const handleSaveCard = () => {
    if (currentCard.title && currentCard.description) {
      const newCard = {
        id: Date.now().toString(),
        title: currentCard.title,
        description: currentCard.description,
        mediaId: mediaId,
        imageUrl: uploadedUrl,
        imagePreview: imagePreview,
        buttons: currentCard.buttons
      };
      setCards([...cards, newCard]);
      handleCloseCardDialog();
    }
  };

  const handleAddButton = () => {
    const newButton = {
      id: Date.now().toString(),
      title: '',
      type: 'QUICK_REPLY',
      value: ''
    };
    setCurrentCard({
      ...currentCard,
      buttons: [...(currentCard.buttons || []), newButton]
    });
  };

  const handleRemoveCard = (cardId) => {
    // Prevent removing the initial card
    if (cardId === 'initial-card') return;
    setCards(cards.filter(card => card.id !== cardId));
  };

  const updateButtonCard = (buttonId, field, value) => {
    const updatedButtons = (currentCard.buttons || []).map(button =>
      button.id === buttonId ? { ...button, [field]: value } : button
    );
    setCurrentCard({ ...currentCard, buttons: updatedButtons });
  };


  return (
    <Grid container spacing={2} sx={{ height: '100vh' }}>

      {/* Notificaciones */}<Snackbar
        open={openSnackbar}
        autoHideDuration={10000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Formulario (70%) */}<Grid item xs={8}><Box sx={{ height: '100%', overflowY: 'auto', pr: 2 }}>

        {/* Template Name */}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <FormControl fullWidth>
            <FormLabel htmlFor="template-name-input">
              *Nombre de la plantilla
            </FormLabel>
            <TextField
              id="template-name-input"
              aria-required="true"
              helperText={templateNameHelperText}
              error={templateNameError}
              value={templateName}
              onChange={handleTemplateNameChange}
              fullWidth
              inputRef={templateNameRef}
            />
          </FormControl>
        </Box>

        {/*Categoría --data-urlencode 'category*/}<Box sx={{ maxWidth: '100%', border: "1px solid #ddd", borderRadius: 2, marginTop: 2, p: 3 }}>
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl fullWidth>
              <FormLabel>
                *Categoría
              </FormLabel>
            </FormControl>
            <Tooltip title="Tu plantilla debe pertencer a una de estas categorías">
              <IconButton size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
            <Stack spacing={2}>
              {categories.map((category) => (
                <Paper key={category.id} sx={{
                  p: 2,
                  cursor: category.disabled ? "default" : "pointer",
                  opacity: category.disabled ? 0.5 : 1,
                  border: categoriaPlantillaError && !selectedCategory ? "1px solid red" : "none", // Resaltar en rojo si hay error
                  "&:hover": {
                    bgcolor: category.disabled
                      ? "transparent"
                      : (theme) => alpha(theme.palette.primary.main, 0.04),
                  },
                }}>
                  <FormControlLabel
                    value={category.id}
                    disabled={category.disabled}
                    control={<Radio />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          {category.icon}
                          <Typography variant="subtitle1" component="span">
                            {category.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {category.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ margin: 0, width: '100%' }}
                  />
                </Paper>
              ))}
            </Stack>
          </RadioGroup>
          {/* Mensaje de error */}
          {categoriaPlantillaError && (
            <FormHelperText error={categoriaPlantillaError}>
              {categoriaPlantillaHelperText}
            </FormHelperText>
          )}
        </Box>

        {/* Tipo de plantilla --data-urlencode templateType*/}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <FormControl fullWidth>
            <FormLabel>
              *Tipo de plantilla
            </FormLabel>
          </FormControl>

          <FormControl fullWidth>
            <Select labelId="template-type-label" id="template-type" value={templateType} onChange={handleTemplateTypeChange} label="Select" ref={templateTypeRef}>
              <MenuItem value="text">TEXTO</MenuItem>
              <MenuItem value="image">IMAGEN</MenuItem>
              <MenuItem value="document">DOCUMENTO</MenuItem>
            </Select>
            <FormHelperText>
              Escoge el tipo de plantilla que se va a crear
            </FormHelperText>
          </FormControl>
        </Box>

        {/*Idioma --data-urlencodeo languageCode */}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <FormControl fullWidth>
            <FormLabel>*Idioma de plantilla</FormLabel>
          </FormControl>

          <FormControl fullWidth error={languageTypeError}>
            <InputLabel id="languageCode">Selección</InputLabel>
            <Select
              labelId="languageCode"
              id="languageCode"
              label="Escoge el idioma"
              aria-required="true"
              value={languageCode} // Usamos directamente el código de idioma
              onChange={handleLanguageCodeChange}
              ref={languageCodeRef}
            >
              {Object.entries(languageMap).map(([code, name]) => (
                <MenuItem key={code} value={code}>
                  {name} ({code.toUpperCase()})
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {languageTypeError ? languageTypeHelperText : "Escoge el idioma de plantilla que se va a crear"}
            </FormHelperText>
          </FormControl>
        </Box>

        {/*Etiquetas de plantilla --data-urlencode vertical*/}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <FormControl fullWidth>
            <FormLabel>
              *Etiquetas de plantilla
            </FormLabel>
          </FormControl>
          <TextField
            fullWidth
            aria-required="true"
            error={etiquetaPlantillaError}
            value={vertical}
            helperText="Defina para qué caso de uso, por ejemplo, actualización de cuenta, OTP, etc, en 2 o 3 palabras"
            onChange={handleVerticalChange}
            inputRef={verticalRef}
          />
        </Box>

        {/* Carrusel - with improvements */}
        <Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="h6">
              {cards.length}/10 Tarjetas
            </Typography>
          </Box>

          <FormControl fullWidth>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {/* File Upload Component */}
              <FileUploadComponent
                templateType="carousel"
                onUploadSuccess={(mediaId, uploadedUrl) => {
                  setMediaId(mediaId);
                  setUploadedUrl(uploadedUrl);
                }}
                onImagePreview={(preview) => setImagePreview(preview)}
              />

              {/* Image Preview */}
              {(uploadedUrl || imagePreview) && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <img
                    src={uploadedUrl || imagePreview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: 200 }}
                  />
                </Box>
              )}

              <TextField
                label="Título"
                value={currentCard.title}
                onChange={(e) => setCurrentCard({
                  ...currentCard,
                  title: e.target.value
                })}
                fullWidth
              />
              <TextField
                label="Descripción"
                value={currentCard.description}
                onChange={(e) => setCurrentCard({
                  ...currentCard,
                  description: e.target.value
                })}
                multiline
                rows={3}
                fullWidth
              />

              {/* Buttons Section with improved styling */}
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Botones ({currentCard.buttons?.length || 0}/3)
              </Typography>

              <Button
                startIcon={<AddIcon />}
                onClick={handleAddButton}
                variant="contained"
                disabled={(currentCard.buttons?.length || 0) >= 3}
                sx={{ alignSelf: 'flex-start', mb: 1 }}
              >
                Agregar Botón
              </Button>

              <FormHelperText>
                Elija los botones que se agregarán a la plantilla. Puede elegir hasta 10 botones.
              </FormHelperText>

              {currentCard.buttons?.map((button) => (
                <Box
                  key={button.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      const updatedButtons = currentCard.buttons.filter(b => b.id !== button.id);
                      setCurrentCard({ ...currentCard, buttons: updatedButtons });
                    }}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>

                  <TextField
                    label="Título del Botón"
                    value={button.title}
                    onChange={(e) => updateButtonCard(button.id, 'title', e.target.value)}
                    fullWidth
                  />

                  {/* Selector de tipo de botón */}
                  <Select
                    value={button.type}
                    label="Tipo de Botón"
                    onChange={(e) => updateButtonCard(button.id, 'type', e.target.value)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="QUICK_REPLY">Respuesta Rápida</MenuItem>
                    <MenuItem value="URL">URL</MenuItem>
                    <MenuItem value="PHONE_NUMBER">Número de Teléfono</MenuItem>
                  </Select>



                  {/* Campo adicional según el tipo de botón */}
                  {button.type === "URL" && (
                    <TextField
                      label="URL"
                      value={button.url || ''}
                      onChange={(e) => updateButtonWithValidation(
                        button.id,
                        "url",
                        e.target.value,
                        setButtons,
                        setValidationErrors
                      )}
                      fullWidth
                      error={validationErrors[button.id] !== undefined}
                      helperText={validationErrors[button.id]}
                    />
                  )}

                  {button.type === "PHONE_NUMBER" && (
                    <TextField
                      label="Phone Number"
                      value={button.phoneNumber}
                      onChange={(e) => updateButton(button.id, "phoneNumber", e.target.value)}
                      fullWidth
                    />
                  )}

                  {/* Icono según el tipo de botón */}
                  {button.type === "QUICK_REPLY" && <ArrowForward />}
                  {button.type === "URL" && <Link />}
                  {button.type === "PHONE_NUMBER" && <Phone />}

                  {/* Botón para eliminar */}
                  <IconButton color="error" onClick={() => removeButton(button.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleCloseCardDialog} variant="contained" color="secondary">
                Cancelar
              </Button>
              <Button
                onClick={handleSaveCard}
                variant="contained"
                color="primary"
                disabled={!currentCard.title || !currentCard.description}
              >
                Guardar Tarjeta
              </Button>
            </Box>
          </FormControl>
        </Box>



        {/*Boton Guardar Plantilla*/}<Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={iniciarRequest}
            sx={{ mt: 3, mb: 3 }}
          >
            Enviar solicitud
          </Button>
        </Box>

      </Box>
      </Grid>

      {/* Preview (30%) */}
      <Grid item xs={4}>
        <Box sx={{ position: "sticky", top: 0, height: "100vh", mt: 2, borderRadius: 2 }}>
          <Box
            sx={{
              p: 3,
              bgcolor: "#fef9f3",
              height: "100%",
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Vista previa
            </Typography>

            {/* Mensaje de WhatsApp 
            <Box
              sx={{
                bgcolor: "#ffffff",
                p: 1,
                borderRadius: 2,
                alignSelf: "flex",
                maxWidth: "100%",
                display: "block",
                flexDirection: "column",
                gap: 0.5,
                boxShadow: 1,
              }}
            >*/}
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                style={{ width: '320px' }}  // Ancho fijo para el carrusel
              >
                {cards.map((card) => (
                  <SwiperSlide key={card.id}>
                    <Card sx={{
                      width: '350px',       // Ancho fijo para cada tarjeta
                      height: '430px',      // Altura fija para cada tarjeta
                      margin: 'auto',
                      my: 2,
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      {/* Delete button positioned top right */}
                      {card.id !== 'initial-card' && (
                        <IconButton
                          color="error"
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            zIndex: 2,
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            }
                          }}
                          onClick={() => handleRemoveCard(card.id)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}

                      {/* Contenedor de imagen con altura fija */}
                      <Box sx={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                        {(card.imageUrl || card.imagePreview) ? (
                          <CardMedia
                            component="img"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                            image={card.imageUrl || card.imagePreview}
                            alt={card.title}
                          />
                        ) : (
                          <Box sx={{ height: '100%', width: '100%', bgcolor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Sin imagen</Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Contenedor de texto con altura fija */}
                      <CardContent sx={{ pt: 2, pb: 1, height: '120px', overflow: 'auto' }}>
                        <Typography variant="h6" component="div" gutterBottom noWrap sx={{ fontWeight: 'bold' }}>
                          {card.title || "Título"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {card.description || "Descripción de la tarjeta"}
                        </Typography>
                      </CardContent>

                      {/* Contenedor de botones con altura fija */}
                      <Box sx={{ p: 2, pt: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                        <Stack spacing={1} sx={{ mt: 0, maxHeight: 'auto', overflow: 'auto' }}>
                          {card.buttons.map((button) => (
                            <Box
                              key={button.id}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-start",
                                gap: 1,
                                border: "1px solid #ccc",
                                borderRadius: "20px",
                                p: 1,
                                backgroundColor: "#ffffff",
                                boxShadow: 1,
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: "#f5f5f5",
                                },
                              }}
                            >
                              {button.type === "QUICK_REPLY" && (
                                <ArrowForward sx={{ fontSize: "16px", color: "#075e54" }} />
                              )}
                              {button.type === "URL" && (
                                <Link sx={{ fontSize: "16px", color: "#075e54" }} />
                              )}
                              {button.type === "PHONE_NUMBER" && (
                                <Phone sx={{ fontSize: "16px", color: "#075e54" }} />
                              )}
                              <Typography variant="body1" sx={{ fontWeight: "medium", color: "#075e54", fontSize: "14px" }}>
                                {button.title}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>

              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "flex-end", mt: 1 }}>
                {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </Typography>
            
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TemplateFormCarousel;