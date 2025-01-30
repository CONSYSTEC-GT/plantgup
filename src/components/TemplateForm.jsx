import React, { useState } from 'react';
import { Alert, Button, Box, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Typography, Paper, Select, Stack, Snackbar, IconButton, TextField, Tooltip, alpha, Grid, Grid2} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Delete from '@mui/icons-material/Delete';


const TemplateForm = () => {

  //CAMPOS DEL FORMULARIO PARA EL REQUEST
const [templateName, setTemplateName] = useState("");
const [selectedCategory, setSelectedCategory] = useState("");
const [templateType, setTemplateType] = useState("text");
const [languageCode, setLanguageCode] = useState("");
const [vertical, setVertical] = useState("");
const [message, setMessage] = useState("");
const [header, setHeader] = useState("");
const [footer, setFooter] = useState("");
const [buttons, setButtons] = useState([]);
const [example, setExample] = useState("");

const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

// CONSTRUYO EL cURL REQUEST
const buildCurlCommand = () => {
  const url = "https://partner.gupshup.io/partner/app/f63360ab-87b0-44da-9790-63a0d524f9dd/templates";
  const headers = {
    Authorization: "sk_2662b472ec0f4eeebd664238d72b61da",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = {
    elementName: templateName,
    category: selectedCategory.toUpperCase(),
    languageCode: languageCode,
    templateType: templateType.toUpperCase(),
    vertical: vertical,
    content: message,
    buttons: JSON.stringify(
      buttons.map((button) => ({
        type: "QUICK_REPLY",
        text: button.title,
      }))
    ),
    example: example,
    enableSample: true,
    allowTemplateCategoryChange: false,
  };

  const curlCommand = `curl --location '${url}' \\
--header 'Authorization: ${headers.Authorization}' \\
--header 'Content-Type: ${headers["Content-Type"]}' \\
${Object.entries(data)
  .map(([key, value]) => `--data-urlencode '${key}=${value}'`)
  .join(" \\\n")}`;

  return curlCommand;
};

// FUNCION PARA ENVIAR LA SOLICITUD
const sendRequest = async () => {
  const url = "https://partner.gupshup.io/partner/app/f63360ab-87b0-44da-9790-63a0d524f9dd/templates";
  const headers = {
    Authorization: "sk_2662b472ec0f4eeebd664238d72b61da",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const data = new URLSearchParams();
  data.append("elementName", templateName);
  data.append("category", selectedCategory.toUpperCase());
  data.append("languageCode", languageCode === "español" ? "es" : languageCode === "inglés" ? "en" : "fr");
  data.append("templateType", templateType.toUpperCase());
  data.append("vertical", vertical);
  data.append("content", message);
  data.append("buttons", JSON.stringify(buttons.map((button) => ({ type: "QUICK_REPLY", text: button.title }))));
  data.append("example", example);
  data.append("enableSample", true);
  data.append("allowTemplateCategoryChange", false);

  console.log("Request enviado:", JSON.stringify(Object.fromEntries(data.entries()), null, 2));

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: data,
    });

    if (!response.ok) {
      // Captura el mensaje de error de la respuesta
      const errorResponse = await response.json(); // O response.text() si no es JSON
      console.error("Error response:", errorResponse);
      showSnackbar(`❌ Error al crear la plantilla: ${errorResponse.message || "Solicitud inválida"}`, "error");
      return; // Detén la ejecución aquí
    }

    const result = await response.json();
    showSnackbar("✅ Plantilla creada exitosamente", "success");
    console.log("Response: ", result);
  } catch (error) {
    console.error("Error en la solicitud:", error);
    showSnackbar("❌ Error al crear la plantilla", "error");
  }
};

  const [variables, setVariables] = useState([{ key: '{{1}}', value: '' }, { key: '{{2}}', value: '' }]);

  // CATEGORIAS
  const categories = [
    {
      id: 'marketing',
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
    setTemplateName(event.target.value);
  };

  //IDIOMA PLANTILLA
  const handleLanguageCodeChange = (event) => {
  setLanguageCode(languageMap[event.target.value] || event.target.value);
  }
  const languageMap = {
    español: "es",
    inglés: "en",
    frances: "fr",
  };
  const reverseLanguageMap = {
    es: "español",
    en: "inglés",
    fr: "frances",
  };

  //VERTICAL PLANTILLA
  const handleVerticalChange = (event) =>{
    setVertical(event.target.value)
  }

  const [mediaType, setMediaType] = useState(""); // Tipo de media (image, video, etc.)
  const [mediaURL, setMediaURL] = useState(""); // URL del media

  //TIPO PLANTILLA
  const handleTemplateTypeChange = (event) => {
    setTemplateType(event.target.value);
    setHeader(""); // Resetear el header al cambiar de tipo
    setMediaType("");
    setMediaURL("");
  };

  //HEADER PLANTILLA
  const handleHeaderChange = (event) => {
    setHeader(event.target.value);
  };

  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
  };

  const handleMediaURLChange = (event) => {
    setMediaURL(event.target.value);
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
      setButtons([...buttons, { id: Date.now(), title: '' }]);
    }
  };

  const removeButton = (id) => {
    setButtons(buttons.filter((button) => button.id !== id));
  };

  const updateButtonTitle = (id, title) => {
    setButtons(
      buttons.map((button) =>
        button.id === id ? { ...button, title } : button
      )
    );
  };


    
  return (
    <Grid container spacing={2} sx={{ height: '100vh' }}>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Formulario (70%) */}<Grid item xs={8}>
        <Box sx={{ height: '100%', overflowY: 'auto', pr: 2 }}>
          {/*Template Name --data-urlenconde-elementName*/}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>
              Nombre de la plantilla*
            </Typography>
            <TextField
              fullWidth
              label="Nombre"
              helperText="El nombre debe hacer referencia al texto de su plantilla."
              value={templateName}
              onChange={handleTemplateNameChange}
            />
          </Box>

          {/*Categoría --data-urlencode 'category*/}<Box sx={{ maxWidth: '100%', border: "1px solid #ddd", borderRadius: 2, marginTop: 2, p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="h2">
                Categoría*
              </Typography>
              <Tooltip title="Tu plantilla debe pertencer a una de estas categorías">
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
              <Stack spacing={2}>
                {categories.map((category) => (
                  <Paper key={category.id} sx={{ p: 2, cursor: category.disabled ? 'default' : 'pointer', opacity: category.disabled ? 0.5 : 1, '&:hover': { bgcolor: category.disabled ? 'transparent' : (theme) => alpha(theme.palette.primary.main, 0.04) } }}>
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
          </Box>

          {/* Tipo de plantilla --data-urlencode templateType*/}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>
              Tipo de plantilla*
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="template-type-label">Selección</InputLabel>
              <Select
                labelId="template-type-label"
                id="template-type"
                value={templateType}
                onChange={handleTemplateTypeChange}
                label="Select"
              >
                <MenuItem value="text">TEXT</MenuItem>
                <MenuItem value="image">IMAGE</MenuItem>
                <MenuItem value="document">DOCUMENT</MenuItem>
                {/* Agrega más opciones según sea necesario */}
              </Select>
              <FormHelperText>
                Escoge el tipo de plantilla que se va a crear
              </FormHelperText>
            </FormControl>
          </Box>

          {/*Idioma --data-urlencode languageCode */}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>Idioma de plantilla*</Typography>
            <FormControl fullWidth>
              <InputLabel id="languageCode">Selección</InputLabel>
              <Select
                labelId="languageCode"
                id="languageCode"
                label="Escoge el idioma"
                value={reverseLanguageMap[languageCode] || ""}
                onChange={handleLanguageCodeChange}
              >
                {Object.keys(languageMap).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Escoge el idioma de plantilla que se va a crear</FormHelperText>
            </FormControl>
          </Box>


          {/*Etiquetas de plantilla --data-urlencode vertical*/}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>
              Etiquetas de plantilla*
            </Typography>
            <TextField
              fullWidth
              label="Escribe"
              helperText="Defina para qué caso de uso, por ejemplo, actualización de cuenta, OTP, etc, en 2 o 3 palabras"
              onChange={handleVerticalChange}
            />
          </Box>

          {/* BodyMessage --data-urlencode content */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Contenido*
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Escribe"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 3 }}
            />
          </Box>

          {/* Header */}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>
              Header
            </Typography>
            {templateType === "text" && (
              <>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Agregue un encabezado de 60 caracteres a su mensaje. Las variables no se admiten en el pie de página.
                </Typography>
                <TextField
                  fullWidth
                  label="Header"
                  value={header}
                  onChange={handleHeaderChange}
                  helperText={`${header.length} / ${charLimit} characters`}
                  sx={{ mb: 3 }}
                />
              </>
            )}

            {templateType !== "text" && (
              <>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Seleccione el tipo de media y proporcione un enlace.
                </Typography>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <RadioGroup
                    row
                    value={mediaType}
                    onChange={handleMediaTypeChange}
                  >
                    <FormControlLabel value="image" control={<Radio />} label="Image" />
                    <FormControlLabel value="video" control={<Radio />} label="Video" />
                    <FormControlLabel value="document" control={<Radio />} label="Document" />
                  </RadioGroup>
                </FormControl>
                {mediaType && (
                  <TextField
                    fullWidth
                    label="Media URL"
                    value={mediaURL}
                    onChange={handleMediaURLChange}
                    helperText="Proporcione un enlace válido al archivo multimedia."
                  />
                )}
              </>
            )}
          </Box>

          {/* Footer */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Footer
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Agregue un pie de página de 60 caracteres a su mensaje. Las variables no se admiten en el pie de página.
            </Typography>
            <TextField
              fullWidth
              label="Footer text"
              value={footer}
              onChange={handleFooterChange}
              helperText={`${footer.length} / ${charLimit} characters`}
              sx={{ mb: 3 }}
            />
          </Box>

          {/* Botones --data-urlencode 'buttons*/}<Box sx={{ width: '100%', marginTop: 2, marginBottom: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Buttons (Optional)
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please choose buttons to be added to the template. You can choose up to {maxButtons} buttons.
            </Typography>

            <Button
              variant="contained"
              onClick={addButton}
              disabled={buttons.length >= maxButtons}
              sx={{ mb: 3 }}
            >
              + Add Button
            </Button>

            <Stack spacing={2}>
              {buttons.map((button, index) => (
                <Box
                  key={button.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    border: '1px solid #ccc',
                    borderRadius: 1,
                    p: 2,
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <TextField
                    label={`Quick Reply Title`}
                    value={button.title}
                    onChange={(e) => updateButtonTitle(button.id, e.target.value)}
                    fullWidth
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeButton(button.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}
            </Stack>

            <Typography
              variant="body2"
              color={buttons.length >= maxButtons ? 'error' : 'text.secondary'}
              sx={{ mt: 2 }}
            >
              {buttons.length} / {maxButtons} buttons added
            </Typography>
          </Box>

          {/* Ejemplo --data-urlencode example */}<Box sx={{ width: '100%', marginTop: 2, marginBottom: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Ejemplo*
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Escribe"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              sx={{ mb: 3 }}
            />
          </Box>

        </Box>
      </Grid>


      {/* Preview (30%) */}<Grid item xs={4}>
        <Box sx={{ position: 'sticky', top: 0, height: '100vh' }}>
          <Box sx={{ p: 3, bgcolor: '#fef9f3', height: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2, }}>

            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>

            <Box sx={{ bgcolor: '#e1ffc7', p: 2, borderRadius: 2, alignSelf: 'flex-end', maxWidth: '70%' }}>
              <Typography variant="body1" color="text.primary">
                {message || 'Plantilla Nueva'}
              </Typography>


              <Stack spacing={2} sx={{ mt: 2 }}>
                {buttons.map((button) => (
                  <Box
                    key={button.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      p: 2,
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <Typography variant="body1">
                      {button.title}
                    </Typography>
                  </Box>
                ))}
              </Stack>

            </Box>

            <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, alignSelf: 'flex-start', maxWidth: '70%', border: '1px solid #ddd', }}>

              <Typography variant="body1">
                {'¡CONSYSTEC TalkMe!'}
              </Typography>


            </Box>

            {/*Boton Guardar Plantilla*/}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
              <Button variant="contained" color="primary" onClick={sendRequest}>
                Enviar solicitud
              </Button>
            </Box>

            <Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>
                Comando cURL
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={buildCurlCommand()}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 3 }}
              />
            </Box>

          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default TemplateForm;