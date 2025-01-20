import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, CardActions, Button, Grid, Box, Stack, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CreateTemplatePage from './CreateTemplatePage';
import Sidebar from '../components/Sidebar';

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

  useEffect(() => {
    fetchTemplates();
  }, []);

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
          // Limitar a 3 o 4 plantillas
          setTemplates(data.templates.slice(0, 4)); // Aquí cambias el número según lo que quieras mostrar
            //setTemplates(data.templates);
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
    navigate('/edit-template/'); // Navega a la página para editar la plantilla con su ID
};


  const handleDeleteClick = (templateId) => {
    // Aquí puedes implementar la lógica para eliminar la plantilla
    console.log(`Eliminando plantilla con ID: ${templateId}`);
    alert(`Plantilla ${templateId} eliminada.`);
  };

  return (
    <Box>
      <h2>Plantillas TalkMe</h2>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <p>Mira el listado de plantillas que puedes utilizar.</p>
          <p>Están aprobadas por WhatsApp para tu aplicación.</p>
        </Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={handleCreateClick}
          endIcon={<AddIcon />}
        >
          Crear Template
        </Button>
      </Box>

      {/* Tarjeta única */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TemplateCard
            title="App name"
            subtitle="onboarding"
            description="namespace"
            onEdit={() => handleEditClick('unique-template-id')}
            onDelete={() => handleDeleteClick('unique-template-id')}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" sx={{marginTop: 2}}>
        <Button color='primary' variant='contained' onClick={handleVerTemplates}>
          Ver Todas
          
        </Button>
      </Box>

      {/* Lista de tarjetas */}
      

      <Box>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {templates.map((template) => (
                <Card
                  key={template.id}
                  sx={{ width: 300, backgroundColor: getStatusColor(template.status) }}
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
                    <Button size="small">Manage</Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

    </Box>
  );
}
