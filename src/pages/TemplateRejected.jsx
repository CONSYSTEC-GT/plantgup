import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Autocomplete, Box, Button, Card, CardContent, CardActions, Stack, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';


const TemplateAproved = () => {
  //PARA MANEJAR EL STATUS DE LAS PLANTILLAS | VARIABLES
  const { templateId } = useParams();
  const [templates, setTemplates] = useState([]);
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todas');
//FETCH DE LAS PLANTILLAS
const fetchTemplates = async () => {
  try {
    const response = await fetch('https://partner.gupshup.io/partner/app/f63360ab-87b0-44da-9790-63a0d524f9dd/templates', {
      method: 'GET',
      headers: {
        'Authorization': 'sk_2662b472ec0f4eeebd664238d72b61da', // Reemplaza con tu clave de autorización
      },
    });

    const data = await response.json();

    if (data.status === 'success') {
      // Filtrar plantillas con status "APPROVED"
      const approvedTemplates = data.templates.filter(template => template.status === 'REJECTED');
      setTemplates(approvedTemplates);
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

    useEffect(() => {
      fetchTemplates();
    }, []);



  return (
    <Box>
      <Box sx={{ display: 'flex' }}>

        <Box sx={{ flexGrow: 1, p: 3 }}>
          {/*TITULO*/}<Typography variant="h4" gutterBottom>
            Catalogo de Plantillas
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

export default TemplateAproved;