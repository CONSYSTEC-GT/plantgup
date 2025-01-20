import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

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

  const handleCreateClick = () => {
    navigate('/create-template-page}'); // Navega a la página para crear plantilla
  };

  const handleVerTemplates = () => {
    navigate(`/edit-template/}`); // Navega a la página para editar la plantilla con su ID
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
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
  {[
    { id: '1', title: 'Template 1', subtitle: 'GUPSHUP', description: 'Descripción del Template 1' },
    { id: '2', title: 'Template 2', subtitle: 'GUPSHUP', description: 'Descripción del Template 2' },
    { id: '3', title: 'Template 3', subtitle: 'GUPSHUP', description: 'Descripción del Template 3' },
  ].map((template) => (
    <Grid item xs={12} sm={6} md={4} key={template.id}>
      <TemplateCard
        title={template.title}
        subtitle={template.subtitle}
        description={template.description}
        whatsappStyle={true} // Aplica el estilo de WhatsApp
        onEdit={() => handleEditClick(template.id)}
        onDelete={() => handleDeleteClick(template.id)}
      />
    </Grid>
  ))}
</Grid>

    </Box>
  );
}
