import React, { useState, useRef, useEffect } from 'react';
import { Alert, Box, Button, Card, CardActions, CardContent, CardMedia, Chip, Container, Dialog, DialogTitle, DialogContent, Divider, FormControl, FormControlLabel, FormLabel, FormHelperText, Grid, Grid2, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Snackbar, Stack, TextField, Tooltip, Typography, alpha } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

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

import FileUploadCarousel from './FileUploadCarousel';
import { isValidURL, updateButtonWithValidation } from '../utils/validarUrl';
import { createTemplateCarouselGupshup } from '../api/gupshupApi';
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
  const [variablesTarjeta, setVariablesTarjeta] = useState([]);

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

      const cardsToSendArray = [...cards]; // Esto es un array de objetos
      const cardsToSend = JSON.stringify([...cards]); // Convertir a JSON string // Creo una copia para no modificar el estado original

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
          carousel: cardsToSend // Enviar como string JSON
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

  const handleAddVariableCard = () => {
    const newVariableTarjeta = `{{${variablesTarjeta.length + 1}}}`;
    setCurrentCard((prev) => ({
      ...prev,
      description: prev.description + " " + newVariableTarjeta
    }));
    setVariablesTarjeta([...variablesTarjeta, newVariableTarjeta]);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prev) => `${prev} ${emojiObject.emoji}`);
    setShowEmojiPicker(false);
  };

  const handleEmojiClickCarousel = (emojiObject) => {
    setCurrentCard((prev) => ({
      ...prev,
      description: prev.description + emojiObject.emoji
    }));
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

  // Función para borrar una variable específica de la tarjeta
  const deleteVariableCard = (variableToDelete) => {
    // Eliminar la variable del texto de la descripción
    const newDescription = currentCard.description.replace(variableToDelete, '');

    // Actualizar la tarjeta con la nueva descripción
    setCurrentCard(prev => ({
      ...prev,
      description: newDescription
    }));

    // Eliminar la variable de la lista de variables de tarjeta
    const updatedVariablesTarjeta = variablesTarjeta.filter(v => v !== variableToDelete);
    setVariablesTarjeta(updatedVariablesTarjeta);

    // Si tienes una referencia al campo de descripción
    // descriptionRef.current?.focus();
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

  // Nueva función para borrar todas las variables
  const deleteAllVariablesCard = () => {
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

  const handleUpdateDescriptionsCard = (variable, value) => {
    setVariableDescriptionsTarjeta(prevDescriptions => ({
      ...prevDescriptions,
      [variable]: value
    }));
  };

  const handleUpdateExampleCard = (variable, value) => {
    setVariableExamplesTarjeta(prevExamples => {
      const updatedExamples = { ...prevExamples, [variable]: value };
      console.log("Ejemplo de tarjeta actualizado:", updatedExamples);
      return updatedExamples;
    });
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

  const [currentCard, setCurrentCard] = useState({
    title: '',
    description: '',
    buttons: []
  });

  // Función para guardar la tarjeta
  const handleSaveCard = () => {
    console.log("Valor de uploadedUrl:", uploadedUrl); // <-- ¿Viene vacío aquí?
    if (currentCard.title && currentCard.description) {
      // Transformar botones al formato requerido
      const transformedButtons = buttons.map(button => {
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

      // Crear la tarjeta con el formato requerido
      const formattedCard = {
        headerType: "IMAGE",
        title: currentCard.title,
        mediaUrl: uploadedUrl || "",
        mediaId: null,
        exampleMedia: null,
        body: currentCard.description,
        sampleText: `${currentCard.description}`,
        buttons: transformedButtons
      };

      // Agregar la tarjeta al array
      const updatedCards = [...cards, formattedCard];

      // Log para verificar el formato de las tarjetas
      console.log("Tarjetas guardadas:", JSON.stringify(updatedCards, null, 2));

      setCards(updatedCards);

      // Limpiar los campos
      setCurrentCard({
        title: "",
        description: "",
        buttons: []
      });
      setButtons([]);
      setUploadedUrl("");
      setImagePreview("");
      setMediaId(null);
    }
  };

  const handleRemoveCard = (cardId) => {
    // Prevent removing the initial card
    if (cardId === 'initial-card') return;
    setCards(cards.filter(card => card.id !== cardId));
  };

  // Función para transformar el formato de botones
  const transformButtons = (buttons) => {
    return buttons.map(button => {
      if (button.type === "URL") {
        return {
          type: "URL",
          text: button.title,
          url: button.url,
          buttonValue: button.url.split("{{")[0] || button.url,
          suffix: "",  // Puedes ajustar esto según tus necesidades
          example: [button.url]  // Aquí podrías incluir ejemplos de URLs completas
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
  };


  // Guardar el array completo en un estado o variable global
  // Este es el array que utilizarás para tu request
  //const requestFormat = JSON.stringify(updatedCards);

  // También puedes guardarlo en localStorage si necesitas persistencia
  //localStorage.setItem('formattedCards', requestFormat);


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
              onChange={(e) => setMessage(e.target.value)}
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
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="h6">
              {cards.length}/10 Tarjetas
            </Typography>
          </Box>

          <FormControl fullWidth>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {/* File Upload Component */}
              <FileUploadCarousel
                onUploadSuccess={(uploadedUrl) => {
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
                label="Contenido de tarjeta"
                multiline
                value={currentCard.description}
                onChange={(e) => setCurrentCard({
                  ...currentCard,
                  description: e.target.value
                })}
                rows={3}
                fullWidth
              />

              {/* Carrusel Botones de emojis y variables */}
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
                  onClick={handleAddVariableCard}
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
                    onClick={deleteAllVariablesCard}
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
                  <EmojiPicker onEmojiClick={handleEmojiClickCarousel} />
                </Paper>
              )}

              {/* Carrusel Variables disponibles como chips con campos de texto para ejemplos y descripción */}
              {variablesTarjeta.length > 0 && (
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

                  {variablesTarjeta.map((variable, index) => (
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
                        onDelete={() => deleteVariableCard(variable)}
                      />

                      <Stack sx={{ flexGrow: 1, gap: 1 }}>
                        <TextField
                          size="small"
                          label="Descripción"
                          placeholder="¿Para qué sirve esta variable?"
                          value={variableDescriptions[variable] || ''}
                          onChange={(e) => handleUpdateDescriptionsCard(variable, e.target.value)}
                          sx={{ flexGrow: 1 }}
                        />

                        <TextField
                          size="small"
                          label="Texto de ejemplo"
                          value={variableExamples[variable] || ''}
                          onChange={(e) => handleUpdateExampleCard(variable, e.target.value)}
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

              {/* Buttons Section with improved styling */}
              <Typography variant="subtitle1" sx={{ mt: 1 }}>
                Botones ({buttons?.length || 0}/3)
              </Typography>

              <Button
                variant="contained"
                size="sm"
                startIcon={<AddIcon />}
                onClick={addButton}
                disabled={buttons.length >= maxButtons || Object.keys(validationErrors).length > 0}
                sx={{ mt: 3, mb: 3 }}
              >
                Agregar botón
              </Button>

              <Stack spacing={2}>
                {buttons.map((button, index) => (
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

              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="contained" color="secondary">
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
              modules={[EffectCoverflow, Pagination]}
              effect={'coverflow'}
              spaceBetween={30}
              slidesPerView={'auto'}
              centeredSlides={true}
              pagination={{ clickable: true }}
              style={{ width: '360px' }}  // Ancho fijo para el carrusel
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
            >
              {cards.map((card) => (
                <SwiperSlide key={card.id}>
                  <Card sx={{
                    width: '350px',       // Ancho fijo para cada tarjeta
                    height: '450px',      // Altura fija para cada tarjeta
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
                      {(card.mediaUrl || card.imagePreview) ? (
                        <CardMedia
                          component="img"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          image={card.mediaUrl || card.imagePreview}
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
                        {card.body || "Descripción de la tarjeta"}
                      </Typography>
                    </CardContent>

                    {/* Contenedor de botones con altura fija */}
                    <Box sx={{
                      p: 2,
                      pt: 0,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end'
                    }}>
                      <Stack spacing={0} sx={{ width: '100%' }}> {/* Cambia spacing a 0 */}
                        {card.buttons.map((button, index) => (
                          <Box
                            key={button.id}
                            sx={{
                              width: '100%',
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: 1,
                              borderTop: index === 0 ? "1px solid #e0e0e0" : "none", // Borde solo arriba para el primer botón
                              borderBottom: "1px solid #e0e0e0", // Borde abajo para todos los botones
                              p: 1.5, // Ajusta el padding para mejor aspecto
                              backgroundColor: "#ffffff",
                              cursor: "pointer",
                              "&:hover": {
                                backgroundColor: "#f5f5f5",
                              },
                              borderRadius: 0, // Elimina el borderRadius para que queden cuadrados
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
                              {button.title || button.text} {/* Soporta ambos formatos */}
                            </Typography>
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