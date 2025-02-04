import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { alpha, Box, Button, Card, CardActions, CardContent, Menu, MenuItem, styled, Typography } from '@mui/material';

// ICONOS
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// MODAL PARA
import DeleteModal from '../components/DeleteModal';


const EditTemplatePage = () => {

  //PARA MANEJAR EL STATUS DE LAS PLANTILLAS | VARIABLES
  const { templateId } = useParams();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todas');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  //FETCH DE LAS PLANTILLAS
  const fetchTemplates = async () => {
    try {
      const response = await fetch('https://partner.gupshup.io/partner/app/f63360ab-87b0-44da-9790-63a0d524f9dd/templates', {
        method: 'GET', // Método de la solicitud
        headers: {
          'Authorization': 'sk_2662b472ec0f4eeebd664238d72b61da', // Reemplaza con tu clave de autorización
        }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

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
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleClick = (event, template) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTemplate(null);
  };

  const handleEdit = () => {
    console.log('Editar:', selectedTemplate);
    handleClose();
  };

  const handleDelete = () => {
    console.log('Eliminar:', selectedTemplate);
    handleClose();
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

  const handleDuplicate = () => {
    console.log('Duplicar:', selectedTemplate);
    handleClose();
  };

  const handleArchive = () => {
    console.log('Archivar:', selectedTemplate);
    handleClose();
  };

  const handleMore = () => {
    console.log('Más opciones:', selectedTemplate);
    handleClose();
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
    handleClose();
  };

  const handleDeleteConfirm = () => {
    console.log('Eliminar:', selectedTemplate);
    setDeleteModalOpen(false);
    // Aquí puedes agregar la lógica para eliminar la plantilla
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          
          {/* Título */}<Typography variant="h4" gutterBottom>
            Catalogo de Plantillas
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {templates.map((template) => (
              <Card
                key={template.id}
                sx={{
                  width: 300,
                  backgroundColor: getStatusColor(template.status),
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
                    onClick={(event) => handleClick(event, template)}
                    endIcon={<KeyboardArrowDownIcon />}
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
                    <MenuItem onClick={handleEdit} disableRipple>
                      <EditIcon />
                      Editar
                    </MenuItem>
                    <MenuItem onClick={handleDeleteClick} disableRipple>
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

export default EditTemplatePage;