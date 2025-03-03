import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importación correcta

import LoginRequired from './LoginRequired';

//componentes
import { alpha, Card, CardContent, Typography, CardActions, Button, Grid, Box, Menu, MenuItem, Stack, TextField, Paper, styled } from '@mui/material';
import { CircularProgress } from '@mui/material';
//iconos
import AddIcon from '@mui/icons-material/Add';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// MODAL PARA ELIMINAR
import DeleteModal from '../components/DeleteModal';

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
  const location = useLocation();
  const { templateId } = useParams();

  // Estados
  const [templates, setTemplates] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenValid, setTokenValid] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const API_GUPSHUP_URL = process.env.API_GUPSHUP;


  // Recupera el token del localStorage
  const token = localStorage.getItem('authToken');

  // Decodifica el token para obtener appId y authCode
  let appId, authCode, appName;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      appId = decoded.app_id; // Extrae appId del token
      authCode = decoded.auth_code; // Extrae authCode del token
      appName = decoded.app_name;
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  //FETCH DE LAS PLANTILLAS
  const fetchTemplates = async (appId, authCode) => {
    try {
      const response = await fetch(`${API_GUPSHUP_URL}/${appId}/templates`, {
        method: 'GET',
        headers: {
          Authorization: authCode,
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setTemplates(data.templates.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  // Llama a fetchTemplates cuando el componente se monta
  useEffect(() => {
    if (appId && authCode) {
      fetchTemplates(appId, authCode);
    } else {
      console.error('No se encontró appId o authCode en el token');
    }
  }, [appId, authCode]);     


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

  const getStatusTextColor = (status) => {
    switch (status) {
      case 'REJECTED':
        return '#d32f2f'; // Rojo oscuro para texto
      case 'FAILED':
        return '#e65100'; // Naranja oscuro para texto
      default:
        return '#616161'; // Gris oscuro para texto
    }
  };

  const handleCreateClick = () => {
    navigate('/CreateTemplatePage'); // Navega a la página para crear plantilla
  };

  const handleVerTemplates = () => {
    navigate('/plantillas/todas/'); // Navega a la página para editar la plantilla con su ID
  };

  const handleEdit = (template) => {
    // Validar el estado del template
    if (template.status === "APPROVED" || template.status === "REJECTED" || template.status === "PAUSED") {
      // Si el estado es válido, navegar a la página de edición
      navigate('/modify-template', { state: { template } });
    } else {
      // Si el estado no es válido, mostrar un mensaje de error
      alert('No se puede editar el template porque su estado no es "APPROVED", "REJECTED" o "PAUSED".');
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event, template) => {
    console.log("Template seleccionado:", template); // Verifica el template seleccionado
    setAnchorEl(event.currentTarget); // Abre el menú
    setSelectedTemplate(template); // Guarda el template seleccionado en el estado
  };

  // Función para manejar el clic en eliminar
  const handleDeleteClick = () => {
    console.log("Template a eliminar:", selectedTemplate); // Verifica el template en el estado
    setDeleteModalOpen(true); // Abre el modal
    handleClose(); // Cierra el menú
  };

  // Función para cancelar la eliminación
  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedTemplate(null);
  };

  // Función para confirmar la eliminación
  const handleDeleteConfirm = async () => {
    try {
      // Aquí iría tu lógica para eliminar la plantilla
      console.log('Eliminando plantilla:', selectedTemplate);

      // Cierra el modal y limpia el estado
      setDeleteModalOpen(false);
      setSelectedTemplate(null);

      // Opcional: Recargar la lista de plantillas
      await fetchTemplates();
    } catch (error) {
      console.error('Error al eliminar la plantilla:', error);
    }
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
              Mira el listado de plantillas que puedes utilizar
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Están aprobadas por WhatsApp para tu aplicación
            </Typography>
          </Box>

          <Button color="primary" variant="contained" size="large" onClick={handleCreateClick} endIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
            Crear plantilla
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
            subtitle="Nombre de la aplicación"
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
          Últimas plantillas creadas
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 3, justifyContent: "center" }}>
          {templates.map((template) => (
            <Card
              key={template.id}
              sx={{
                maxWidth: 300,
                height: 500, // Fija la altura a 480px
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
                overflow: 'visible',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ p: 0 }}>


                {/* Header Template Name */}<Box sx={{ p: 2, pb: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0 }}>
                    {template.elementName}
                  </Typography>


                  {/* Status badge */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: getStatusColor(template.status), // Color de fondo dinámico
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      mb: 1
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: '#EF4444', // Puedes hacer este color dinámico también si lo deseas
                        mr: 0.5
                      }}
                    />

                    <Typography variant="caption" sx={{ color: getStatusTextColor(template.status), fontWeight: 500 }}>
                      {template.status}
                    </Typography>
                  </Box>

                  {/* Categoria badge */}<Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#F3F4F6',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#4B5563', fontWeight: 500 }}>
                      {template.category}
                    </Typography>
                  </Box>


                  {/* Tipo badge */}<Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: '#F3F4F6',
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Typography variant="caption" sx={{ color: '#4B5563', fontWeight: 500 }}>
                      {template.templateType}
                    </Typography>

                  </Box>

                </Box>

                {/* Razón rechazo */}{template.reason && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
                    Razón: {template.reason}
                  </Typography>
                )}

                {/* Content */}<Box
                  sx={{
                    p: 0,
                    backgroundColor: '#FEF9F3', // Fondo amarillo
                    mx: 1,
                    my: 1,
                    borderRadius: 2,
                    height: 302, // Altura fija para el fondo amarillo
                    width: 286,
                    display: 'flex',
                    flexDirection: 'column', // Ajusta la dirección del contenido a columna
                    alignItems: 'center', // Centra horizontalmente
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'white', // Fondo blanco para el contenido
                      p: 2, // Padding para separar el contenido del borde
                      mt: 2,
                      borderRadius: 4, // Bordes redondeados
                      width: '100%', // Ajusta el ancho para que ocupe todo el contenedor
                      overflowY: 'auto', // Permite desplazamiento vertical si el contenido supera la altura
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {template.data}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>

              {/* Acciones */}<CardActions
                sx={{
                  mt: 'auto',           // Empuja el CardActions hacia abajo
                  justifyContent: 'flex-start', // Alinea contenido a la izquierda
                  padding: 2,           // Añade padding consistente
                  position: 'relative', // Necesario para el posicionamiento
                }}
              >
                <Button
                  id="manage-button"
                  aria-controls={anchorEl ? 'manage-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={anchorEl ? 'true' : undefined}
                  variant="outlined"
                  disableElevation
                  onClick={(event) => { console.log("Template seleccionado:", template); handleClick(event, template) }}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    color: '#00C3FF',
                    borderColor: '#E0E7FF',
                    '&:hover': {
                      borderColor: '#C7D2FE',
                      backgroundColor: '#F5F5FF'
                    }
                  }}
                >
                  Administrar
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
                    onClick={() => handleEdit(selectedTemplate)}
                    disableRipple
                  >
                    <EditIcon />
                    Editar
                  </MenuItem>
                  <MenuItem
                    onClick={handleDeleteClick}
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

      {/* Modal de Eliminación */}
      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        template={selectedTemplate}
      />

    </Box>
  );
}
