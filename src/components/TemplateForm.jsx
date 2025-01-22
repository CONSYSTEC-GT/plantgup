import React, { useState } from 'react';
import { Button, Box, Radio, RadioGroup, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Typography, Paper, Select, Stack, IconButton, TextField, Tooltip, alpha, Grid} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import InventoryIcon from '@mui/icons-material/Inventory';
import Delete from '@mui/icons-material/Delete';

const TemplateForm = () => {

  const [selectedCategory, setSelectedCategory] = useState('marketing');
  const [templateName, setTemplateName] = useState('');
  const [message, setMessage] = useState('');
  const [variables, setVariables] = useState([{ key: '{{1}}', value: '' }, { key: '{{2}}', value: '' }]);

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
  // CATEGORIAS
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleTemplateNameChange = (event) => {
    setTemplateName(event.target.value);
  };

  const renderMessage = () => {
    return message || 'No message provided';
  };

  //componentes del header
  const [templateType, setTemplateType] = useState("text"); // Tipo de plantilla
  const [header, setHeader] = useState('');
  const [mediaType, setMediaType] = useState(""); // Tipo de media (image, video, etc.)
  const [mediaURL, setMediaURL] = useState(""); // URL del media

  const handleTemplateTypeChange = (event) => {
    setTemplateType(event.target.value);
    setHeader(""); // Resetear el header al cambiar de tipo
    setMediaType("");
    setMediaURL("");
  };

  const handleHeaderChange = (event) => {
    setHeader(event.target.value);
  };

  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
  };

  const handleMediaURLChange = (event) => {
    setMediaURL(event.target.value);
  };

  //componentes del footer
  const [footer, setFooter] = useState('');

  const handleFooterChange = (e) => {
    if (e.target.value.length <= charLimit) {
      setFooter(e.target.value);
    }
  };

  const charLimit = 60;

  //componentes de los botones quickreply
  const [buttons, setButtons] = useState([]);
  const maxButtons = 10;

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
      {/* Formulario (70%) */}
      <Grid item xs={8}>
        <Box sx={{ height: '100%', overflowY: 'auto', pr: 2 }}>
          {/*Template Name */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
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

          {/*Categoría */}<Box sx={{ maxWidth: '100%', border: "1px solid #ddd", borderRadius: 2, marginTop: 2, p: 3 }}>
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

          {/* Tipo de plantilla */}<Box sx={{ width: "100%", marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
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

          {/*Idioma */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
          <Typography variant="h5" mb={2}>
              Idioma de plantilla*
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="template-idioma">Selección</InputLabel>
              <Select
                labelId="template-idioma"
                id="template-idioma"
                label="Escoge el idioma"
              >
                <MenuItem value="español">ESPAÑOL</MenuItem>
                <MenuItem value="inglés">INGLES</MenuItem>
                <MenuItem value="frances">FRANCES</MenuItem>
                {/* Agrega más opciones según sea necesario */}
              </Select>
              <FormHelperText>
                Escoge el idioma de plantilla que se va a crear
              </FormHelperText>
            </FormControl>
          </Box>          

          {/*Etiquetas de plantilla */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>
              Etiquetas de plantilla*
            </Typography>
            <TextField
              fullWidth
              label="Escribe"
              helperText="Defina para qué caso de uso, por ejemplo, actualización de cuenta, OTP, etc, en 2 o 3 palabras"
            />
          </Box>

          {/* BodyMessage */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
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

          {/* Botones QuickReply */}<Box sx={{ width: '100%', marginTop: 2, marginBottom: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
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
        </Box>
      </Grid>

      {/* Preview (30%) */}
      <Grid item xs={4}>
        <Box sx={{ position: 'sticky', top: 0, height: '100vh' }}>          
          <Box sx={{ p: 3, bgcolor: '#fef9f3', height: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2, }}>

            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>

            <Box sx={{ bgcolor: '#e1ffc7', p: 2, borderRadius: 2, alignSelf: 'flex-end', maxWidth: '70%' }}>
              <Typography variant="body1" color="text.primary">
                {message || 'Plantilla Nueva'}
              </Typography>
            </Box>

            <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, alignSelf: 'flex-start', maxWidth: '70%', border: '1px solid #ddd', }}>

              <Typography variant="body1">
                {'¡CONSYSTEC TalkMe!'}
              </Typography>

            </Box>

          </Box>
        </Box>


      </Grid>
    </Grid>
  );
};

export default TemplateForm;