import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Autocomplete, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions, 
  Stack, 
  TextField, 
  Typography 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const EditTemplatePage = () => {
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
            setTemplates(data.templates);
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

  return (
    <Box>
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%', mb: 4 }}>
            <TextField 
              label="Search by template name" 
              sx={{ flexGrow: 1 }}
            />
            <TextField 
              label="Category" 
              sx={{ width: '200px' }}
            />
            <Button 
              color="primary" 
              variant="outlined" 
              size="large"
            >
              Compare
            </Button>
            <Button 
              color="primary" 
              variant="contained" 
              size="large" 
              endIcon={<AddIcon />}
            >
              Crear Template
            </Button>
          </Stack>

          <Typography variant="h4" gutterBottom>
            Editar Plantilla
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {templates.map((template) => (
              <Card 
                key={template.id} 
                sx={{ 
                  width: 300,
                  backgroundColor: getStatusColor(template.status)
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
                  <Button size="small">Manage</Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default EditTemplatePage;