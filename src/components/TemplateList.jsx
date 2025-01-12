import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';


// Componente reutilizable para las tarjetas
const TemplateCard = ({ title, subtitle, description, onEdit }) => (
  <Card sx={{ minWidth: 275, border: '1px solid', borderColor: 'grey.200'}}>
    <CardContent>
      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        {subtitle}
      </Typography>
      <Typography variant="h5" component="div">
        {title}
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>{description}</Typography>
      <Typography variant="body2">{description}</Typography>
    </CardContent>
    <CardActions>
      <Button color="primary" variant="contained" size="small" onClick={onEdit}>
        Editar Plantilla
      </Button>
    </CardActions>
  </Card>
);

export default function BasicCard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create-template-page'); // Navega a la ruta /create-template
  };

  return (
    <Box>
      <h2>Sandbox Templates</h2>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <p>Mira el listado de plantillas que puedes utilizar.</p>
          <p>Están aprobadas por WhatsApp para tu aplicación.</p>
        </Box>
        <Button color="primary" variant="contained" size="large"  onClick={handleClick} endIcon={<AddIcon />}>
          Crear Template
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TemplateCard
            title="App name"
            subtitle="onboarding"
            description="namespace"
            onEdit={() => console.log('Editando Tarjeta Única')}
          />
        </Grid>
        </Grid>
        
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        {[
          { title: 'Template 1', subtitle: 'GUPSHUP', description: 'Descripción del Template 1' },
          { title: 'Template 2', subtitle: 'GUPSHUP', description: 'Descripción del Template 2' },
          { title: 'Template 3', subtitle: 'GUPSHUP', description: 'Descripción del Template 3' },
        ].map((template, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <TemplateCard
              title={template.title}
              subtitle={template.subtitle}
              description={template.description}
              onEdit={() => console.log(`Editando ${template.title}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
