import React, { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Container, Dialog, DialogTitle, DialogContent, DialogActions, Divider, FormControl, FormControlLabel, FormLabel, FormHelperText, Grid, Grid2, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Snackbar, Stack, TextField, Tooltip, Typography, alpha } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';




import { Smile } from "react-feather"; // Icono para emojis
import EmojiPicker from "emoji-picker-react"; // Selector de emojis

// Import Swiper styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import WhatsAppCarouselPreview from './WhatsappCarouselPreview';
import FileUploadCarousel from './FileUploadCarousel';
import { isValidURL, updateButtonWithValidation } from '../utils/validarUrl';
import { createTemplateCarouselGupshup } from '../api/gupshupApi';
import { saveTemplateToTalkMe } from '../api/templatesGSApi';

import { CustomDialog } from '../utils/CustomDialog';

const TemplateFormCarousel = () => {

  //CAMPOS DEL FORMULARIO PARA EL REQUEST
  const [templateName, setTemplateName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [templateType, setTemplateType] = useState("CAROUSEL");
  const [carouselType, setcarouselType] = useState("");
  const [templateNameHelperText, setTemplateNameHelperText] = useState("El nombre debe hacer referencia al texto de su plantilla.");
  const [templateNameError, setTemplateNameError] = useState(false);
  const [vertical, setVertical] = useState("");
  const [message, setMessage] = useState("");

  //carousel
  const [messageCard, setMessageCard] = useState("");
  const [cantidadBotones, setCantidadBotones] = useState();
  const [tipoBoton, setTipoBoton] = useState("QUICK_REPLY")

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
  const [showEmojiPickerCards, setShowEmojiPickerCards] = useState(false);
  const [variables, setVariables] = useState([]);
  const [variablesCard, setVariablesCard] = useState([]);

  // Estado para almacenar ejemplos de variables
  const [variableExamples, setVariableExamples] = useState({});
  const [variableExamplesError, setvariableExamplesError] = useState(false);
  const [variableExamplesHelperText, setvariableExamplesHelperText] = useState("");
  const [variableErrors, setVariableErrors] = useState({});

  // Estado para almacenar ejemplos de variables
  const [variableExamplesCard, setVariableExamplesCard] = useState({});
  const [variableExamplesErrorCard, setvariableExamplesErrorCard] = useState(false);
  const [variableExamplesHelperTextCard, setvariableExamplesHelperTextCard] = useState("");
  const [variableErrorsCard, setVariableErrorsCard] = useState({});

  // Estado para almacenar descripciones de variables
  const [variableDescriptions, setVariableDescriptions] = useState({});
  const [variableDescriptionsError, setvariableDescriptionsError] = useState(false);
  const [variableDescriptionsHelperText, setvariableDescriptionsHelperText] = useState("");

  const [variableDescriptionsCard, setVariableDescriptionsCard] = useState({});
  const [variableDescriptionsErrorCard, setvariableDescriptionsErrorCard] = useState(false);
  const [variableDescriptionsHelperTextCard, setvariableDescriptionsHelperTextCard] = useState("");

  //ESTE ES PARA EL EXAMPLE MEDIA
  const [mediaId, setMediaId] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const templateNameRef = useRef(null);
  const templateTypeRef = useRef(null);
  const carouselTypeRef = useRef(null);
  const languageCodeRef = useRef(null);
  const verticalRef = useRef(null);
  const messageRef = useRef(null);
  const messageCardRef = useRef(null);
  const exampleRef = useRef(null);
  const exampleCardRef = useRef(null);
  const selectedCategoryRef = useRef(null);
  const exampleRefs = useRef({});
  const exampleCardRefs = useRef({});

  const emojiPickerRef = useRef(null);
  const emojiPickerCardRef = useRef(null);
  const emojiPickerButtonRef = useRef(null); // Para el botón
  const emojiPickerComponentRef = useRef(null); // Para el componente del picker

  const resetForm = () => {
    setTemplateName("");
    setSelectedCategory("");
    setLanguageCode("");
    setVertical("");
    setMessage("");
    setMediaId("");
    setButtons([]);
    setExample("");
    setCards([]);
    setUploadedUrl("");
    setVariables([]);
    setVariableDescriptions([]);
    // Agrega cualquier otro estado relacionado
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessageGupshup, setErrorMessageGupshup] = useState("La plantilla no pudo ser creada.");

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
      //console.log('appId:', appId);
      //console.log('authCode:', authCode);
      //console.log('idUsuarioTalkMe:', idUsuarioTalkMe);
      //console.log('idNombreUsuarioTalkMe:', idNombreUsuarioTalkMe);
      //console.log('empresaTalkMe:', empresaTalkMe);

    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  const iniciarRequest = async () => {
    try {
      // Hacer el primer request a GupShup API

      const formattedCards = formatCardsForGupshup(cards);
    
      // Asegúrate de que todas las cards tengan los datos necesarios
      const isValid = formattedCards.every(card => 
        card.mediaUrl && card.body // Añade aquí más validaciones si son necesarias
      );

      if (!isValid) {
        console.error("Algunas cards no tienen todos los datos requeridos");
        return;
      }

      const result = await createTemplateCarouselGupshup(
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
          example,
          carousel: JSON.stringify(formattedCards) // Enviar como string JSON
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
          variableDescriptions,
          cardsToSendArray
        );

        // Limpia todos los campos si todo fue bien
        resetForm();
        setShowSuccessModal(true);

        // El tercer request se maneja dentro de saveTemplateToTalkMe
      } else {
        console.error("El primer request no fue exitoso o no tiene el formato esperado.");
        setErrorMessageGupshup(result?.message || "La plantilla no pudo ser creada.");
        setShowErrorModal(true);

        console.error("Resultado del primer request:", result);
      }
    } catch (error) {
      console.error("Ocurrió un error:", error);
    }
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

  //CAROUSEL PLANTILLA
  const handleCarouselTypeChange = (event) => {
    setcarouselType(event.target.value)
  }

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
  const maxButtons = 3;

  //BOTONES PLANTILLA
  const addButton = () => {
    if (buttons.length < maxButtons) {
      setButtons([
        ...buttons,
        { id: Date.now(), type: "QUICK_REPLY", title: "", url: "", phoneNumber: "" }
      ]);
    }
  };

  // Función para actualizar botones en todas las cards
  const updateButtonsInAllCards = (newButtons) => {
    setCards(prevCards =>
      prevCards.map(card => ({
        ...card,
        buttons: [...newButtons] // Copia los nuevos botones a todas las cards
      })))
  };

  // Función para actualizar un botón específico
  const updateButton = (id, key, value) => {
    setCards(prevCards => {
      return prevCards.map(card => ({
        ...card,
        buttons: card.buttons.map(button =>
          button.id === id ? { ...button, [key]: value } : button
        ),
      }));
    });
  };



  const removeButton = (id) => {
    setButtons(buttons.filter((button) => button.id !== id));
  };

  // VARIABLES DEL BODY MESSAGE
  const handleBodyMessageChange = (e) => {
    const newText = e.target.value;
    const maxLength = 1024;

    if (newText.length <= maxLength) {
      // Guardar el nuevo texto
      setMessage(newText);

      // Verificar qué variables se han eliminado del texto
      const deletedVariables = [];
      variables.forEach(variable => {
        if (!newText.includes(variable)) {
          deletedVariables.push(variable);
        }
      });

      // Si se eliminaron variables, actualiza el estado
      if (deletedVariables.length > 0) {
        // Filtrar las variables eliminadas
        const remainingVariables = variables.filter(v => !deletedVariables.includes(v));

        // Actualizar el estado de las variables
        setVariables(remainingVariables);

        // Actualizar las descripciones y ejemplos
        const newDescriptions = { ...variableDescriptions };
        const newExamples = { ...variableExamples };
        const newErrors = { ...variableErrors };

        deletedVariables.forEach(v => {
          delete newDescriptions[v];
          delete newExamples[v];
          delete newErrors[v];
        });

        setVariableDescriptions(newDescriptions);
        setVariableExamples(newExamples);
        setVariableErrors(newErrors);
      }
    }
  };

  const handleBodyMessageCardChange = (e, cardId) => {
    console.log('Change triggered', e.target.value, cardId, cards);
    const newText = e.target.value;
    const maxLength = 280; // o 1024 según necesites

    setCards(cards.map(card => {
      if (card.id !== cardId) return card;

      // Verificar variables eliminadas
      const deletedVariables = variables.filter(
        variable => !newText.includes(variable)
      );

      // Actualizar variables, descripciones y ejemplos
      const remainingVariables = variables.filter(
        v => !deletedVariables.includes(v)
      );

      const newDescriptions = { ...card.variableDescriptions };
      const newExamples = { ...card.variableExamples };

      deletedVariables.forEach(v => {
        delete newDescriptions[v];
        delete newExamples[v];
      });

      return {
        ...card,
        messageCard: newText,
        variables: remainingVariables,
        variableDescriptions: newDescriptions,
        variableExamples: newExamples
      };
    }));
  };

  // VARIABLES DEL BODY MESSAGE
  const handleAddVariable = () => {
    const newVariable = `{{${variables.length + 1}}}`;

    // Obtener la posición actual del cursor
    const cursorPosition = messageRef.current.selectionStart;

    // Dividir el texto en dos partes: antes y después del cursor
    const textBeforeCursor = message.substring(0, cursorPosition);
    const textAfterCursor = message.substring(cursorPosition);

    // Insertar la variable en la posición del cursor
    const newMessage = `${textBeforeCursor}${newVariable}${textAfterCursor}`;
    setMessage(newMessage);

    // Actualizar el array de variables
    setVariables([...variables, newVariable]);

    // OPCIONAL: Colocar el cursor después de la variable insertada
    setTimeout(() => {
      const newPosition = cursorPosition + newVariable.length;
      messageRef.current.focus();
      messageRef.current.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleAddVariableCard = (cardId) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id !== cardId) return card;

        const newVariable = `{{${card.variablesCard.length + 1}}}`;
        const cursorPosition = messageCardRef.current?.selectionStart || 0;

        const textBefore = card.messageCard.substring(0, cursorPosition);
        const textAfter = card.messageCard.substring(cursorPosition);

        const newMessageCard = `${textBefore}${newVariable}${textAfter}`;

        // OPCIONAL: Actualizar descripción y ejemplos también
        const updatedDescriptions = { ...card.variableDescriptionsCard, [newVariable]: "" };
        const updatedExamples = { ...card.variableExamples, [newVariable]: "" };

        // Retornar la tarjeta actualizada
        return {
          ...card,
          messageCard: newMessageCard,
          variablesCard: [...card.variablesCard, newVariable],
          variableDescriptionsCard: updatedDescriptions,
          variableExamples: updatedExamples
        };
      })
    );

    // Reenfocar y mover el cursor al final de la variable insertada
    setTimeout(() => {
      const newPosition = (messageCardRef.current?.selectionStart || 0) + `{{${cards.find(c => c.id === cardId)?.variablesCard.length + 1}}}`.length;
      messageCardRef.current?.focus();
      messageCardRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };



  const handleEmojiClick = (emojiObject) => {
    const cursor = messageRef.current.selectionStart;
    const newText = message.slice(0, cursor) + emojiObject.emoji + message.slice(cursor);

    setMessage(newText);
    setShowEmojiPicker(false);

    // Aumenta el tiempo de espera para asegurar que el estado se actualiza
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.focus();
        messageRef.current.setSelectionRange(cursor + emojiObject.emoji.length, cursor + emojiObject.emoji.length);
      }
    }, 100);
  };

  const handleEmojiClickCarousel = (emojiObject) => {
    const cursor = messageCardRef.current.selectionStart;
    const newText = messageCard.slice(0, cursor) + emojiObject.emoji + messageCard.slice(cursor);

    setMessageCard(newText);
    setShowEmojiPickerCards(false);

    // Aumenta el tiempo de espera para asegurar que el estado se actualiza
    setTimeout(() => {
      if (messageCardRef.current) {
        messageCardRef.current.focus();
        messageCardRef.current.setSelectionRange(cursor + emojiObject.emoji.length, cursor + emojiObject.emoji.length);
      }
    }, 100);
  };



  // Función para borrar una variable específica
  const deleteVariable = (variableToDelete) => {
    // Eliminar la variable del texto
    const newMessage = message.replace(variableToDelete, '');
    setMessage(newMessage);

    // Eliminar la variable de la lista de variables
    const updatedVariables = variables.filter(v => v !== variableToDelete);

    // Renumerar las variables restantes para mantener el orden secuencial
    const renumberedVariables = [];
    const variableMapping = {}; // Mapeo de variable antigua a nueva

    updatedVariables.forEach((v, index) => {
      const newVar = `{{${index + 1}}}`;
      renumberedVariables.push(newVar);
      variableMapping[v] = newVar;
    });

    // Actualizar el texto con las variables renumeradas
    let updatedMessage = newMessage;
    Object.entries(variableMapping).forEach(([oldVar, newVar]) => {
      updatedMessage = updatedMessage.replaceAll(oldVar, newVar);
    });

    // Crear nuevos objetos para descripciones y ejemplos de variables
    const newVariableDescriptions = {};
    const newVariableExamples = {};
    const newVariableErrors = { ...variableErrors };

    // Eliminar la variable eliminada de los errores
    delete newVariableErrors[variableToDelete];

    // Copiar las descripciones y ejemplos con las nuevas claves
    Object.entries(variableMapping).forEach(([oldVar, newVar]) => {
      if (variableDescriptions[oldVar]) {
        newVariableDescriptions[newVar] = variableDescriptions[oldVar];
      }
      if (variableExamples[oldVar]) {
        newVariableExamples[newVar] = variableExamples[oldVar];
      }
      if (variableErrors[oldVar]) {
        newVariableErrors[newVar] = variableErrors[oldVar];
        delete newVariableErrors[oldVar];
      }
    });

    // Actualizar todos los estados
    setMessage(updatedMessage);
    setVariables(renumberedVariables);
    setVariableDescriptions(newVariableDescriptions);
    setVariableExamples(newVariableExamples);
    setVariableErrors(newVariableErrors);

    // Actualizar las referencias
    const newExampleRefs = {};
    renumberedVariables.forEach(v => {
      newExampleRefs[v] = exampleRefs.current[variableMapping[v]] || null;
    });
    exampleRefs.current = newExampleRefs;

    messageRef.current?.focus();
  };


  // Función para borrar una variable específica de la tarjeta
  const deleteVariableCard = (cardId, variableToDelete) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id !== cardId) return card;

        // 1. Eliminar la variable del mensaje
        const newMessage = card.messageCard.replace(variableToDelete, '');

        // 2. Filtrar la variable a eliminar
        const updatedVariables = card.variablesCard.filter(v => v !== variableToDelete);

        // 3. Renumerar variables restantes
        const renumberedVariables = [];
        const variableMapping = {};

        updatedVariables.forEach((v, index) => {
          const newVar = `{{${index + 1}}}`;
          renumberedVariables.push(newVar);
          variableMapping[v] = newVar;
        });

        // 4. Actualizar el mensaje con nuevas variables
        let updatedMessage = newMessage;
        Object.entries(variableMapping).forEach(([oldVar, newVar]) => {
          updatedMessage = updatedMessage.replaceAll(oldVar, newVar);
        });

        // 5. Actualizar descripciones, ejemplos y errores
        const newVariableDescriptions = { ...card.variableDescriptions };
        const newVariableExamples = { ...card.variableExamples };
        const newVariableErrors = { ...card.variableErrors };

        // Eliminar la variable que se está borrando
        delete newVariableDescriptions[variableToDelete];
        delete newVariableExamples[variableToDelete];
        delete newVariableErrors[variableToDelete];

        // Actualizar las demás variables con nueva numeración
        Object.entries(variableMapping).forEach(([oldVar, newVar]) => {
          if (newVariableDescriptions[oldVar]) {
            newVariableDescriptions[newVar] = newVariableDescriptions[oldVar];
            delete newVariableDescriptions[oldVar];
          }
          if (newVariableExamples[oldVar]) {
            newVariableExamples[newVar] = newVariableExamples[oldVar];
            delete newVariableExamples[oldVar];
          }
          if (newVariableErrors[oldVar]) {
            newVariableErrors[newVar] = newVariableErrors[oldVar];
            delete newVariableErrors[oldVar];
          }
        });

        return {
          ...card,
          messageCard: updatedMessage,
          variablesCard: renumberedVariables,
          variableDescriptions: newVariableDescriptions,
          variableExamples: newVariableExamples,
          variableErrors: newVariableErrors
        };
      })
    );
  };


  // Función para borrar todas las variables
  const deleteAllVariables = () => {
    let newMessage = message;
    variables.forEach(variable => {
      newMessage = newMessage.replaceAll(variable, '');
    });
    setMessage(newMessage);
    setVariables([]);

    // Limpiar todos los estados relacionados con variables
    setVariableDescriptions({});
    setVariableExamples({});
    setVariableErrors({});
    exampleRefs.current = {};

    messageRef.current?.focus();
  };

  // Nueva función para borrar todas las variables
  const deleteAllVariablesCard = (cardId) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id !== cardId) return card;

        let newMessage = card.messageCard;
        card.variablesCard.forEach(variable => {
          newMessage = newMessage.replaceAll(variable, '');
        });

        return {
          ...card,
          messageCard: newMessage,
          variablesCard: [],
          variableDescriptionsCard: {},
          variableExamples: {}
        };
      })
    );

    messageCardRef.current?.focus();
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

  const handleUpdateDescriptionsCard = (cardId, variable, value) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id !== cardId) return card;

        return {
          ...card,
          variableDescriptions: {
            ...card.variableDescriptions,
            [variable]: value
          }
        };
      })
    );
  };

  const handleUpdateExampleCard = (cardId, variable, value) => {
    setCards(prevCards =>
      prevCards.map(card => {
        if (card.id !== cardId) return card;

        return {
          ...card,
          variableExamples: {
            ...card.variableExamples,
            [variable]: value
          }
        };
      })
    );
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

  // Generar IDs únicos para los botones
  const generateId = () => Math.random().toString(36).substr(2, 9);



  // Actualizar el campo "example" y "message" cuando cambie el mensaje o los ejemplos de las variables
  useEffect(() => {
    console.log("Mensaje original:", message);
    console.log("Variables y ejemplos:", variableExamples);

    const newExample = replaceVariables(message, variableExamples);

    console.log("Mensaje después de reemplazo:", newExample);

    setExample(newExample);
  }, [message, variableExamples]);

  useEffect(() => {
    // Función que maneja los clics fuera del componente
    const handleClickOutside = (event) => {
      // Verificar si el clic fue fuera tanto del botón como del picker
      if (
        showEmojiPicker &&
        emojiPickerButtonRef.current &&
        emojiPickerComponentRef.current &&
        !emojiPickerButtonRef.current.contains(event.target) &&
        !emojiPickerComponentRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }

      if (
        showEmojiPickerCards &&
        emojiPickerCardRef.current &&
        !emojiPickerCardRef.current.contains(event.target)
      ) {
        setShowEmojiPickerCards(false);
      }
    }
  }
  )

  // Inicializar botones basado en la cantidad seleccionada
  // Efecto para inicializar botones
  useEffect(() => {
    const count = parseInt(cantidadBotones, 10);

    setCards(prevCards =>
      prevCards.map(card => {
        // Crear nuevos botones específicos para esta card
        const newButtons = [];
        for (let i = 0; i < count; i++) {
          newButtons.push({
            id: generateId(), // Asegúrate de que generateId() produzca IDs únicos
            title: `Botón ${i + 1}`,
            type: tipoBoton,
            ...(tipoBoton === 'URL' && { url: '' }),
            ...(tipoBoton === 'PHONE_NUMBER' && { phoneNumber: '' })
          });
        }

        return {
          ...card,
          buttons: newButtons
        };
      })
    );
  }, [cantidadBotones, tipoBoton]);

  // Validación para URLs
  const updateButtonWithValidation = (id, field, value, setButtons, setValidationErrors) => {
    // Validación simple de URL
    const isValid = value === '' || /^(ftp|http|https):\/\/[^ "]+$/.test(value);

    setButtons(prevButtons =>
      prevButtons.map(button =>
        button.id === id ? { ...button, [field]: value } : button
      )
    );

    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [id]: isValid ? undefined : 'URL no válida'
    }));
  };


  const formatCardsForGupshup = (cards) => {
    return cards.map(card => {
      // Transformar botones al formato requerido por Gupshup
      const transformedButtons = card.buttons.map(button => {
        if (button.type === "URL") {
          return {
            type: "URL",
            text: button.title,
            url: button.url,
            buttonValue: button.url.split("{{")[0] || button.url,
            suffix: "",
            example: [button.url]
          };
        } else if (button.type === "QUICK_REPLY") {
          return {
            type: "QUICK_REPLY",
            text: button.title
          };
        } else if (button.type === "PHONE_NUMBER") {
          return {
            type: "PHONE_NUMBER",
            text: button.title,
            phoneNumber: button.phoneNumber
          };
        }
        return null;
      }).filter(button => button !== null);
  
      // Crear el formato requerido por Gupshup
      return {
        headerType: "<IMAGE>",
        mediaUrl: card.file?.url || "", // Asumiendo que tienes la URL en este campo
        mediaId: card.file?.id || "",
        exampleMedia: card.file?.handle || "",
        body: card.messageCard || "",
        sampleText: card.variableExamples?.messageCard || card.messageCard || "",
        buttons: transformedButtons
      };
    });
  };
  
  // Uso de la función
  const formattedCardsForGupshup = formatCardsForGupshup(cards);
  console.log("Formato para Gupshup:", JSON.stringify(formattedCardsForGupshup, null, 2));


  // Estado para los acordeones - solo guardamos el ID único y el contenido del formulario
  const [accordions, setAccordions] = useState([
  ]);

  // Estado para controlar qué acordeón está expandido
  const [expanded, setExpanded] = useState(false);

  // Manejar cambios en la expansión del acordeón
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Manejar cambios en los formularios
  const handleFormChange = (id, field, value) => {
    setAccordions(accordions.map(accordion =>
      accordion.id === id ? { ...accordion, [field]: value } : accordion
    ));
  };

  // Agregar nueva tarjeta
  const addAccordion = () => {
    setCards([...cards, {
      ...initialCardState,
      id: uuidv4()
    }]);
  };

  // Eliminar tarjeta
  const deleteAccordion = (id, e) => {
    e.stopPropagation();
    setCards(cards.filter(card => card.id !== id));
  };

  // Actualizar cualquier campo de una tarjeta
  const updateCardField = (cardId, field, value) => {
    setCards(cards.map(card =>
      card.id === cardId ? { ...card, [field]: value } : card
    ));
  };



  // Manejar el fin del arrastre
  const onDragEnd = (result) => {
    // Si no hay destino válido, no hacer nada
    if (!result.destination) return;

    const items = Array.from(accordions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAccordions(items);
  };

  // Estado inicial para cada tarjeta del carrusel
  const initialCardState = {
    id: uuidv4(), // o algún otro método para generar IDs únicos
    carouselType: "IMAGEN",
    messageCard: "",
    variablesCard: [],
    variableDescriptionsCard: {},
    variableExamples: {},
    buttons: [],
    file: null, // para almacenar el archivo subido
    // otros campos que necesites
  };

  // Estado principal que contiene todas las tarjetas
  const [cards, setCards] = useState([initialCardState]);
  console.log("Cards data:", cards);
  const currentCardId = cards[0].id;



  // Función para manejar la subida de archivos para una card específica
const handleFileUpload = (cardId, uploadResponse) => {
  if (uploadResponse.estado === "OK" && uploadResponse.url) {
    // Actualiza el array de cards con la nueva URL
    setCardsData(prevCards => 
      prevCards.map(card => 
        card.id === cardId 
          ? { ...card, file: uploadResponse.url } 
          : card
      )
    );
  }
};

  return (
    <Grid container sx={{ height: '100vh' }}>

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

      {/* Formulario (70%) */}
      <Grid item xs={8} sx={{ height: '100%' }}>
        <Box sx={{ height: '100%', overflowY: 'auto', pr: 2, px: 2, py: 2 }}>

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
                <MenuItem value="CAROUSEL">CARRUSEL</MenuItem>
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

          {/* BodyMessage --data-urlencode content */}<Box
            sx={{
              width: "100%",
              marginTop: 2,
              p: 4,
              border: "1px solid #ddd",
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",

            }}
          >
            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: "1.1rem", fontWeight: "500", color: "#333" }}>
                *Contenido
              </FormLabel>
            </FormControl>

            {/* Campo de texto con soporte para emojis y variables */}
            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                multiline
                aria-required="true"
                error={contenidoPlantillaTypeError}
                rows={4}
                label="Escribe"
                placeholder="Ingresa el contenido de tu mensaje aquí..."
                value={message}
                onChange={handleBodyMessageChange}
                sx={{
                  mb: 3,
                  mt: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    }
                  }
                }}
                inputRef={messageRef}
                inputProps={{
                  maxLength: 280, // Esto limita físicamente la entrada
                }}
                helperText={`${message.length}/280 caracteres`} // Muestra el contador
                FormHelperTextProps={{
                  sx: {
                    textAlign: 'right', // Alinea el contador a la derecha
                    color: message.length === 280 ? 'error.main' : 'text.secondary' // Cambia color si llega al límite
                  }
                }}
              />

              {/* Botones de emojis y acciones en una barra de herramientas mejor diseñada */}
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mb: 2,
                  p: 1,
                  borderRadius: 1,
                  backgroundColor: "rgba(0,0,0,0.02)"
                }}
              >
                <Tooltip title="Agregar emojis">
                  <IconButton
                    color="primary"
                    ref={emojiPickerButtonRef}
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    sx={{ borderRadius: 1 }}
                  >
                    <Smile size={20} />
                  </IconButton>
                </Tooltip>

                <Divider orientation="vertical" flexItem />

                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleAddVariable}
                  sx={{ borderRadius: 1 }}
                >
                  Agregar Variable
                </Button>

                {variables.length > 0 && (
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={deleteAllVariables}
                    sx={{ ml: "auto", borderRadius: 1 }}
                  >
                    Borrar todas
                  </Button>
                )}
              </Stack>

              {/* Selector de emojis */}
              {showEmojiPicker && (
                <Paper
                  elevation={3}
                  sx={{
                    position: "absolute",
                    zIndex: 1000,
                    mt: 1
                  }}
                >
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </Paper>
              )}

              {/* Variables disponibles como chips con campos de texto para ejemplos y descripción */}
              {variables.length > 0 && (
                <Paper
                  sx={{
                    my: 2,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #ddd",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                    Agrega una descripción y un ejemplo a tu variable:
                  </Typography>

                  {variables.map((variable, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: 2,
                        mb: 2,
                        p: 1.5,
                        backgroundColor: "#fff",
                        borderRadius: 1,
                        border: "1px solid #e0e0e0"
                      }}
                    >
                      <Chip
                        label={variable}
                        color="primary"
                        sx={{ fontWeight: "500" }}
                        deleteIcon={
                          <Tooltip title="Borrar variable">
                            <DeleteIcon />
                          </Tooltip>
                        }
                        onDelete={() => deleteVariable(variable)}
                      />

                      <Stack sx={{ flexGrow: 1, gap: 1 }}>
                        <TextField
                          size="small"
                          label="Descripción"
                          placeholder="¿Para qué sirve esta variable?"
                          value={variableDescriptions[variable] || ''}
                          onChange={(e) => handleUpdateDescriptions(variable, e.target.value)}
                          sx={{ flexGrow: 1 }}
                        />

                        <TextField
                          size="small"
                          label="Texto de ejemplo"
                          value={variableExamples[variable] || ''}
                          onChange={(e) => handleUpdateExample(variable, e.target.value)}
                          sx={{ flexGrow: 1 }}
                          inputRef={(el) => (exampleRefs.current[variable] = el)}
                          error={!!variableErrors[variable]}
                          helperText={variableErrors[variable]}
                        />

                      </Stack>
                    </Box>
                  ))}
                </Paper>
              )}
            </Box>
          </Box>

          {/* Carrusel - with improvements */}
          <Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Box>
              <FormControl fullWidth>
                <FormLabel sx={{ fontSize: "1.1rem", fontWeight: "500", color: "#333", mb: 2 }}>
                  *Carrusel
                </FormLabel>

                <FormLabel sx={{ mb: 2 }}>
                  Agregue medios, botones y descripciones de tarjetas para sus tarjetas de carrusel.
                </FormLabel>

                <TextField
                  id="carousel-type"
                  select
                  label="Tipo de carrusel"
                  value={carouselType}
                  onChange={handleCarouselTypeChange}
                  inputRef={carouselTypeRef}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="IMAGEN">Imagen</MenuItem>
                  <MenuItem value="VIDEO">Video</MenuItem>
                  {/* Agrega más opciones si quieres */}

                </TextField>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>


              {/* Segundo Select Cantidad de botones */}
              <TextField
                id="carousel-style"
                select
                label="Cantidad de botones"
                fullWidth
                onChange={(e) => setCantidadBotones(e.target.value)}
                value={cantidadBotones}
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
              </TextField>

              {/* Tercer Select TIPO DE BOTONES */}
              <TextField
                id="carousel-animation"
                select
                label="Tipo de botones"
                fullWidth
                value={tipoBoton}
                onChange={(e) => setTipoBoton(e.target.value)}
              >
                <MenuItem value="QUICK_REPLY">Respuesta rápida</MenuItem>
                <MenuItem value="URL">Link</MenuItem>
                <MenuItem value="PHONE_NUMBER">Teléfono</MenuItem>
              </TextField>


            </Box>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="cards">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {cards.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <Accordion expanded={expanded === card.id} onChange={handleChange(card.id)}
                              sx={{
                                mb: 2,
                                transition: 'all 0.3s ease'

                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`${card.id}-content`}
                                id={`${card.id}-header`}
                                sx={{
                                  '& .MuiAccordionSummary-content': {
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: '100%',
                                    backgroundColor: '#f4fdff', // Color de fondo del encabezado
                                    borderTop: '3px solid #f4fdff', // Ejemplo de borde superior con el mismo color

                                  },
                                  cursor: 'default'
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    cursor: 'grab',
                                    '&:active': {
                                      cursor: 'grabbing'
                                    }
                                  }}
                                  {...provided.dragHandleProps}
                                >
                                  <DragIndicatorIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                  {/* Usamos el índice + 1 para mostrar el número correcto en el título */}
                                  <Typography>Tarjeta {index + 1}</Typography>
                                </Box>
                                <IconButton
                                  size="small"
                                  onClick={(e) => deleteAccordion(card.id, e)}
                                  sx={{ ml: 2 }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2, width: '100%' } }}>
                                  <FileUploadCarousel onUploadComplete={(response) => handleFileUpload(card.id, response)} />


                                  <Box sx={{ position: "relative" }}>
                                    <TextField
                                      fullWidth
                                      multiline
                                      aria-required="true"
                                      error={contenidoPlantillaTypeError}
                                      rows={4}
                                      label="Escribe"
                                      placeholder="Ingresa el contenido de tu mensaje aquí..."
                                      value={card.messageCard}
                                      onChange={(e) => handleBodyMessageCardChange(e, card.id)}
                                      sx={{
                                        mb: 3,
                                        mt: 4,
                                        "& .MuiOutlinedInput-root": {
                                          borderRadius: 1.5,
                                          "&:hover fieldset": {
                                            borderColor: "primary.main",
                                          }
                                        }
                                      }}
                                      inputRef={messageCardRef}
                                      inputProps={{
                                        maxLength: 280, // Esto limita físicamente la entrada
                                      }}
                                      helperText={`${messageCard.length}/280 caracteres`} // Muestra el contador
                                      FormHelperTextProps={{
                                        sx: {
                                          textAlign: 'right', // Alinea el contador a la derecha
                                          color: messageCard.length === 280 ? 'error.main' : 'text.secondary' // Cambia color si llega al límite
                                        }
                                      }}
                                    />

                                    {/* Botones de emojis y acciones en una barra de herramientas mejor diseñada */}
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      sx={{
                                        mb: 2,
                                        p: 1,
                                        borderRadius: 1,
                                        backgroundColor: "rgba(0,0,0,0.02)"
                                      }}
                                    >
                                      <Tooltip title="Agregar emojis">
                                        <IconButton
                                          color="primary"
                                          ref={emojiPickerButtonRef}
                                          onClick={() => setShowEmojiPickerCards(!showEmojiPickerCards)}
                                          sx={{ borderRadius: 1 }}
                                        >
                                          <Smile size={20} />
                                        </IconButton>
                                      </Tooltip>

                                      <Divider orientation="vertical" flexItem />

                                      <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() => handleAddVariableCard(card.id)}
                                        sx={{ borderRadius: 1 }}
                                      >
                                        Agregar Variable
                                      </Button>

                                      {card.variablesCard.length > 0 && (
                                        <Button
                                          color="error"
                                          variant="outlined"
                                          size="small"
                                          startIcon={<ClearIcon />}
                                          onClick={() => deleteAllVariablesCard(card.id)}
                                          sx={{ ml: "auto", borderRadius: 1 }}
                                        >
                                          Borrar todas
                                        </Button>
                                      )}
                                    </Stack>

                                    {/* Selector de emojis */}
                                    {showEmojiPickerCards && (
                                      <Paper
                                        elevation={3}
                                        sx={{
                                          position: "absolute",
                                          zIndex: 1000,
                                          mt: 1
                                        }}
                                      >
                                        <EmojiPicker onEmojiClick={handleEmojiClickCarousel} />
                                      </Paper>
                                    )}

                                    {/* Variables disponibles como chips con campos de texto para ejemplos y descripción */}
                                    {card.variablesCard.length > 0 && (
                                      <Paper
                                        sx={{
                                          my: 2,
                                          p: 2,
                                          borderRadius: 2,
                                          border: "1px solid #ddd",
                                        }}
                                      >
                                        <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                                          Agrega una descripción y un ejemplo a tu variable:
                                        </Typography>

                                        {card.variablesCard.map((variableCard, index) => (
                                          <Box
                                            key={index}
                                            sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              flexWrap: 'wrap',
                                              gap: 2,
                                              mb: 2,
                                              p: 1.5,
                                              backgroundColor: "#fff",
                                              borderRadius: 1,
                                              border: "1px solid #e0e0e0"
                                            }}
                                          >
                                            <Chip
                                              label={variableCard}
                                              color="primary"
                                              sx={{ fontWeight: "500" }}
                                              deleteIcon={
                                                <Tooltip title="Borrar variable">
                                                  <DeleteIcon />
                                                </Tooltip>
                                              }
                                              onDelete={() => deleteVariableCard(card.id, variableCard)}
                                            />

                                            <Stack sx={{ flexGrow: 1, gap: 1 }}>
                                              <TextField
                                                size="small"
                                                label="Descripción"
                                                placeholder="¿Para qué sirve esta variable?"
                                                value={card.variableDescriptions?.[variableCard] || ''}
                                                onChange={(e) => handleUpdateDescriptionsCard(card.id, variableCard, e.target.value)}
                                                sx={{ flexGrow: 1 }}
                                              />

                                              <TextField
                                                size="small"
                                                label="Texto de ejemplo"
                                                value={card.variableExamples?.[variableCard] || ''}
                                                onChange={(e) => handleUpdateExampleCard(card.id, variableCard, e.target.value)}
                                                sx={{ flexGrow: 1 }}
                                                inputRef={(el) => (exampleCardRefs.current[variableCard] = el)}
                                                error={!!variableErrorsCard[variableCard]}
                                                helperText={variableErrorsCard[variableCard]}
                                              />

                                            </Stack>
                                          </Box>
                                        ))}
                                      </Paper>
                                    )}
                                  </Box>

                                </Box>
                                <Stack spacing={2}>
                                  {card.buttons.map((button, index) => (
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
                                      {/* Campo de texto para el título del botón */}
                                      <TextField
                                        label="Titulo del botón"
                                        value={button.title}
                                        onChange={(e) => updateButton(button.id, "title", e.target.value)}
                                        fullWidth
                                      />

                                      {/* Selector de tipo de botón */}
                                      <Select
                                        value={button.type}
                                        onChange={(e) => updateButton(button.id, "type", e.target.value)}
                                        sx={{ minWidth: 150 }}
                                        disabled
                                      >
                                        <MenuItem value="QUICK_REPLY">Respuesta rápida</MenuItem>
                                        <MenuItem value="URL">URL</MenuItem>
                                        <MenuItem value="PHONE_NUMBER">Número de teléfono</MenuItem>
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
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addAccordion}
              sx={{ mt: 2 }}

            >
              Añadir tarjeta
            </Button>
          </Box>

          {/*Boton Guardar Plantilla*/}<Box sx={{ display: "flex", justifyContent: "flex-end", p: 2, mb: 20 }}>
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

          {/* Diálogo de éxito */}
          <CustomDialog
            open={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title="¡Éxito!"
            message="La plantilla fue creada correctamente."
            severity="success"
            buttonVariant="contained"
          />

          {/* Diálogo de error */}
          <CustomDialog
            open={showErrorModal}
            onClose={() => setShowErrorModal(false)}
            title="Error al crear plantilla"
            message={errorMessageGupshup}
            severity="error"
            buttonVariant="contained"
          />
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

            {/* Mensaje de WhatsApp */}
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
            >
              <Typography variant="body1" color="text.primary" sx={{ fontFamily: "Helvetica Neue, Arial, sans-serif", whiteSpace: "pre-line" }}>
                {message}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ alignSelf: "flex-end" }}>
                {new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: true })}
              </Typography>

             </Box>

            <Swiper
              modules={[Pagination]}
              effect={'coverflow'}
              spaceBetween={10}
              slidesPerView={2}
              centeredSlides={false}
              pagination={{ clickable: true }}
              style={{ width: '100%' }}
            >
              {cards.map((card) => (
                <SwiperSlide key={card.id}>
                  <Card sx={{
                    Width: '350px',
                    height: '450px',
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
                      {(card.file || card.imagePreview) ? (
                        <CardMedia
                          component="img"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          image={card.file || card.imagePreview}
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
                      <Typography variant="body2" color="text.secondary" sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {card.messageCard || "Descripción de la tarjeta"}
                      </Typography>
                    </CardContent>

                    {/* Contenedor de botones con altura fija - MODIFICADO */}
                    <Box sx={{
                      mt: 'auto', // Empuja los botones hacia abajo
                      width: '100%', // Asegura que ocupe todo el ancho
                      display: 'flex',
                      flexDirection: 'column',
                      px: 0 // Quita el padding horizontal
                    }}>
                      <Stack spacing={0} sx={{ width: '100%' }}>
                        {card.buttons.map((button, index) => (
                          <Box
                            key={button.id}
                            sx={{
                              width: '100%',
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              position: "relative",
                              borderTop: index === 0 ? "1px solid #e0e0e0" : "none",
                              borderBottom: "1px solid #e0e0e0",
                              p: 1.5,
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                              },
                              borderRadius: 0,
                            }}
                          >
                            <Box sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1
                            }}>
                              {button.type === "QUICK_REPLY" && (
                                <ArrowForward sx={{ fontSize: "16px", color: "#075e54" }} />
                              )}
                              {button.type === "URL" && (
                                <Link sx={{ fontSize: "16px", color: "#075e54" }} />
                              )}
                              {button.type === "PHONE_NUMBER" && (
                                <Phone sx={{ fontSize: "16px", color: "#075e54" }} />
                              )}
                              <Typography variant="body1" sx={{ fontWeight: "medium", color: "#075e54", fontSize: "14px", textAlign: "center" }}>
                                {button.title || button.text}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
            </Box>


          </Box>

      </Grid>
    </Grid>


  );
};

export default TemplateFormCarousel;