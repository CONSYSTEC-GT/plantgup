import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//componentes
import { alpha, Card, CardContent, Typography, CardActions, Button, Grid, Box, Menu, MenuItem, Stack, TextField, Paper, styled } from '@mui/material';
//iconos
import AddIcon from '@mui/icons-material/Add';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Componente reutilizable para las tarjetas
const TemplateCard = ({ title, subtitle, description, onEdit, onDelete, whatsappStyle }) => (
  <Card
    sx={{
      minWidth: 275,
      border: '1px solid',
      borderColor: whatsappStyle ? '#25D366' : 'grey.200',
      backgroundColor: whatsappStyle ? '#ECE5DD' : 'white',
      borderRadius: whatsappStyle ? '16px' : '4px',
      boxShadow: whatsappStyle ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
    }}
  >
    <CardContent>
      <Typography
        gutterBottom
        sx={{
          color: whatsappStyle ? '#075E54' : 'text.secondary',
          fontSize: 14,
          fontWeight: whatsappStyle ? 'bold' : 'normal',
        }}
      >
        {subtitle}
      </Typography>
      <Typography variant="h5" component="div" sx={{ color: whatsappStyle ? '#075E54' : 'inherit' }}>
        {title}
      </Typography>
      <Typography
        sx={{
          color: whatsappStyle ? '#4F4F4F' : 'text.secondary',
          mb: 1.5,
          fontSize: whatsappStyle ? '14px' : 'inherit',
        }}
      >
        {description}
      </Typography>
    </CardContent>

  </Card>
);

export default function BasicCard() {

  const navigate = useNavigate();
  const { templateId } = useParams();
  const [templates, setTemplates] = useState([]);
  const [appName, setAppName] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const appId = searchParams.get('app_id');
    const authCode = searchParams.get('auth_code');
    const appName = searchParams.get('app_name');
    const appNameFromParams = searchParams.get('app_name');

    if (appId && authCode) {
      // Use these parameters as needed
      console.log('App ID:', appId);
      console.log('Auth Code:', authCode);
      setAppName(appNameFromParams || '')

      // Example: You might want to store these in state or make an API call
      fetchTemplates(appId, authCode);
    }
  }, [location]);
  //fetchTemplates();

  const fetchTemplates = async (appId, authCode) => {
    try {
      const response = await fetch(`https://partner.gupshup.io/partner/app/${appId}/templates`, {
        method: 'GET',
        headers: {
          'Authorization': authCode,
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setTemplates(data.templates.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'REJECTED':
        return '#ffebee';
      case 'FAILED':
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  };

  const handleCreateClick = () => {
    navigate('/CreateTemplatePage'); // Navega a la página para crear plantilla
  };

  const handleVerTemplates = () => {
    navigate('/plantillas/todas/'); // Navega a la página para editar la plantilla con su ID
  };

  const handleEdit = (template) => {
    navigate('/modify-template', { state: { template } });
  };

  // Función para manejar el clic en eliminar
  const handleDeleteClick = () => {
    console.log("Template a eliminar:", selectedTemplate); // Verifica el template en el estado
    setDeleteModalOpen(true); // Abre el modal
    handleClose(); // Cierra el menú
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event, template) => {
    console.log("Template seleccionado:", template); // Verifica el template seleccionado
    setAnchorEl(event.currentTarget); // Abre el menú
    setSelectedTemplate(template); // Guarda el template seleccionado en el estado
  };

  // Estilo personalizado para el menú
  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color: 'rgb(55, 65, 81)',
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

  return (
    <Box sx={{ marginLeft: 2, marginRight: 2, marginTop: 3 }}>
      {/*TITULO PRIMER BLOQUE */}<Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Plantillas TalkMe
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box sx={{ maxWidth: "60%" }}>
            <Typography variant="body1" color="textSecondary">
              Mira el listado de plantillas que puedes utilizar.
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Están aprobadas por WhatsApp para tu aplicación.
            </Typography>
          </Box>

          <Button color="primary" variant="contained" size="large" onClick={handleCreateClick} endIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
            Crear Template
          </Button>
        </Box>
      </Paper>

      {/*APP NAME TARJTA UNICA*/}<Box sx={{ padding: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Lista de Plantillas
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 3,
            justifyContent: "center",
          }}
        >
          <TemplateCard
            title={appName}
            subtitle="App Name"
            onEdit={() => handleEditClick('unique-template-id')}
            onDelete={() => handleDeleteClick('unique-template-id')}
          />
        </Box>
      </Box>

      {/*BOTON VER PLANTILLAS*/}<Box display="flex" justifyContent="flex-end" sx={{ marginTop: 2, marginRight: 2 }}>
        <Button color="primary" variant="contained" size="large" onClick={handleVerTemplates} endIcon={<FindInPageIcon />} sx={{ borderRadius: 2 }}>
          Ver Todas
        </Button>
      </Box>


      {/* Lista de tarjetas */}<Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Lista de Plantillas
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3, justifyContent: "center" }}>
          {templates.map((template) => (
            <Card
              key={template.id}
              sx={{
                width: 300,
                backgroundColor: getStatusColor(template.status),
                borderRadius: 3,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.02)" },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {template.elementName}
                </Typography>
                <Typography color="textSecondary">Status: {template.status}</Typography>
                <Typography variant="body2">Category: {template.category}</Typography>
                <Typography variant="body2">Type: {template.templateType}</Typography>
                <Typography variant="body2">{template.data}</Typography>

                {template.reason && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                    Reason: {template.reason}
                  </Typography>
                )}

                <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                  Created: {new Date(template.createdOn).toLocaleString()}
                </Typography>
              </CardContent>

              {/* Botón fijo en la parte inferior izquierda */}
              <CardActions sx={{ padding: 2 }}>
                <Button
                    id="manage-button"
                    aria-controls={anchorEl ? 'manage-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorEl ? 'true' : undefined}
                    variant="contained"
                    disableElevation
                    onClick={(event) => {console.log("Template seleccionado:", template); handleClick(event, template)}}  // Pasamos el template correcto
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{ borderRadius: 2, marginLeft: "auto" }}
                  >
                    Manage
                  </Button>

                <StyledMenu
                    id="manage-menu"
                    MenuListProps={{
                      'aria-labelledby': 'manage-button',
                    }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={() => handleEdit(selectedTemplate)} // Pasamos el selectedTemplate
                      disableRipple
                    >
                      <EditIcon />
                      Editar
                    </MenuItem>
                    <MenuItem
                      onClick={handleDeleteClick} // No necesitas pasar el template aquí
                      disableRipple
                    >
                      <DeleteIcon />
                      Eliminar
                    </MenuItem>
                  </StyledMenu>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Box>

    </Box>
  );
}
