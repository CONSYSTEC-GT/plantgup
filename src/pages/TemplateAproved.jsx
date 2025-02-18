import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { alpha, Autocomplete, Box, Button, Card, CardContent, CardActions, Menu, MenuItem, Stack, TextField, Typography,  styled } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalar jwt-decode

// ICONOS
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// MODAL PARA ELIMINAR
import DeleteModal from '../components/DeleteModal';

const TemplateAproved = () => {
//PARA MANEJAR EL STATUS DE LAS PLANTILLAS | VARIABLES
const { templateId } = useParams();
const [templates, setTemplates] = useState([]);
const [filteredTemplates, setFilteredTemplates] = useState([]);
const [activeFilter, setActiveFilter] = useState('todas');
const [selectedTemplate, setSelectedTemplate] = useState(null);
const [deleteModalOpen, setDeleteModalOpen] = useState(false);

const navigate = useNavigate(); // Inicializa useNavigate

  // Recupera el token del localStorage
  const token = localStorage.getItem('authToken');

  // Decodifica el token para obtener appId y authCode
  let appId, authCode;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      appId = decoded.app_id; // Extrae appId del token
      authCode = decoded.auth_code; // Extrae authCode del token
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  //FETCH DE LAS PLANTILLAS
const fetchTemplates = async (appId, authCode) => {
  try {
    const response = await fetch(`https://partner.gupshup.io/partner/app/${appId}/templates`, {
      method: 'GET',
      headers: {
        Authorization: authCode,
      },
    });
    const data = await response.json();
    if (data.status === 'success') {
      const aprovedTemplates = data.templates.filter(template => template.status === 'APROVED');
       setTemplates(aprovedTemplates);
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

//MODIFICAR EL COLOR DEPENDIENDO DEL STATUS DE LAS PLANTILLAS
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

const [anchorEl, setAnchorEl] = useState(null);

const handleClick = (event, template) => {
  console.log("Template seleccionado:", template); // Verifica el template seleccionado
  setAnchorEl(event.currentTarget); // Abre el menú
  setSelectedTemplate(template); // Guarda el template seleccionado en el estado
};

const handleClose = () => {
  setAnchorEl(null);
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

useEffect(() => {
  fetchTemplates();
}, []);

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
    <Box>
      <Box sx={{ display: 'flex' }}>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {/*TITULO*/}<Typography variant="h4" gutterBottom>
            Catálogo de Plantillas Aprovadas
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
                  <Typography variant="h6" gutterBottom>
                    {template.elementName}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Status: {template.status}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Category: {template.category}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Type: {template.templateType}
                  </Typography>
                  <Typography variant="body2">
                    {template.data}
                  </Typography>
                  {template.reason && (
                    <Typography
                      color="error"
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Reason: {template.reason}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    Created: {new Date(template.createdOn).toLocaleString()}
                  </Typography>
                </CardContent>
                <CardActions>
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

      {/* Modal de Eliminación */}
      <DeleteModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        template={selectedTemplate}
      />
    </Box>
  );
};

export default TemplateAproved;