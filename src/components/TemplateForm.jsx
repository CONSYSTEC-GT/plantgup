import React, { useState } from 'react';
import { Button, Box, Radio, RadioGroup, FormControlLabel, Typography, Paper, Stack, IconButton, TextField, Tooltip, alpha, Grid} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import InventoryIcon from '@mui/icons-material/Inventory';
import Delete from '@mui/icons-material/Delete';
import PreviewWhatsAppStyle from './PreviewWhatsapp';


const TemplateForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('marketing');
  const [templateName, setTemplateName] = useState('');

  const [message, setMessage] = useState('Please provide feedback for {{}} by clicking on {{}}. Thanks!');
  const [variables, setVariables] = useState([{ key: '{{1}}', value: '' }, { key: '{{2}}', value: '' }]);

  const categories = [
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Send promo offers, product offers and more to increase awareness and engagement.',
      icon: <EmailOutlinedIcon />,
    },
    {
      id: 'utility',
      title: 'Utility',
      description: 'Send account updates, order updates, alerts and more to share important information.',
      icon: <NotificationsNoneOutlinedIcon />,
    },
    {
      id: 'authentication',
      title: 'Authentication',
      description: 'Send codes that allow your customers to access their account.',
      icon: <VpnKeyOutlinedIcon />,
      disabled: true
    },
    {
      id: 'custom',
      title: 'Custom Message',
      description: 'Send promotional offers, announcements and more to increase awareness and engagement.',
      icon: <ImportExportIcon />,
    },
    {
      id: 'product',
      title: 'Product Message',
      description: 'Send messages about your entire catalogue or multiple products from it.',
      icon: <InventoryIcon />,
    }
  ];

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleTemplateNameChange = (event) => {
    setTemplateName(event.target.value);
  };

  // Componente Preview
  const Preview = () => (
    <Box sx={{ p: 3, bgcolor: 'grey.100', height: '100%', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Preview
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Template Name:
        </Typography>
        <Typography variant="body1" mb={2}>
          {templateName || 'No name provided'}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary">
          Category:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          {categories.find(cat => cat.id === selectedCategory)?.icon}
          <Typography variant="body1">
            {categories.find(cat => cat.id === selectedCategory)?.title}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );

  // Componentes para el bodymessage
  const handleVariableChange = (index, field, value) => {
    const updatedVariables = [...variables];
    updatedVariables[index][field] = value;
    setVariables(updatedVariables);
  };

  const renderMessage = () => {
    let renderedMessage = message;
    variables.forEach(({ key, value }) => {
      renderedMessage = renderedMessage.replace(key, value || key);
    });
    return renderedMessage;
  };

  const addVariable = () => {
    setVariables([...variables, { key: `{{${variables.length + 1}}}`, value: '' }]);
  };

  //componentes del footer
  const [footer, setFooter] = useState('');
    const charLimit = 60;
  
    const handleFooterChange = (e) => {
      if (e.target.value.length <= charLimit) {
        setFooter(e.target.value);
      }
    };

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
              Template name*
            </Typography>
            <TextField
              fullWidth
              label="Template name"
              helperText="Template names can only contain small letters, numbers, and underscores."
              value={templateName}
              onChange={handleTemplateNameChange}
            />
          </Box>

          {/*Categoría */}<Box sx={{ maxWidth: '100%', border: "1px solid #ddd", borderRadius: 2, marginTop: 2, p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" component="h2">
                Category*
              </Typography>
              <Tooltip title="Choose what type of message template you want to create">
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
              <Stack spacing={2}>
                {categories.map((category) => (
                  <Paper key={category.id} sx={{p: 2, cursor: category.disabled ? 'default' : 'pointer', opacity: category.disabled ? 0.5 : 1,'&:hover': {bgcolor: category.disabled ? 'transparent' : (theme) => alpha(theme.palette.primary.main, 0.04)}}}>
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
                      sx={{margin: 0, width: '100%'}}
                    />
                  </Paper>
                ))}
              </Stack>
            </RadioGroup>
          </Box>

          {/*Language */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>
              Language*
            </Typography>
            <TextField
              fullWidth
              label="Select"
              helperText="Choose wich languages your message template will be sent in."
              value={templateName}
              onChange={handleTemplateNameChange}
            />
          </Box>

          {/*Label */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h5" mb={2}>
              Template Label*
            </Typography>
            <TextField
              fullWidth
              label="Template Label"
              helperText="Define what use-case does this template serves e.g Account update, OTP, etc."
              value={templateName}
              onChange={handleTemplateNameChange}
            />
          </Box>

          {/* Header */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>

            <Typography variant="h5" mb={2}>
              Header
            </Typography>
            <TextField
              fullWidth
              label="Headers"
              helperText="Define what use-case does this template serves e.g Account update, OTP, etc."
              value={templateName}
              onChange={handleTemplateNameChange}
            />
          </Box>

          {/* BodyMessage */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Dynamic Message Editor
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mb: 3 }}
            />
            {variables.map((variable, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  label={`Variable ${index + 1}`}
                  value={variable.key}
                  onChange={(e) => handleVariableChange(index, 'key', e.target.value)}
                  sx={{ mr: 2, flex: 1 }}
                />
                <TextField
                  label="Sample Value"
                  value={variable.value}
                  onChange={(e) => handleVariableChange(index, 'value', e.target.value)}
                  sx={{ flex: 1 }}
                />
              </Box>
            ))}
            <Button variant="contained" onClick={addVariable} sx={{ mb: 3 }}>
              Add Variable
            </Button>
            <Typography variant="h6">Rendered Message:</Typography>
            <Typography variant="body1" sx={{ backgroundColor: '#f4f4f4', p: 2, borderRadius: 1 }}>
              {renderMessage()}
            </Typography>
          </Box>

          {/* Footer */}<Box sx={{ width: '100%', marginTop: 2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Footer Editor
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Add a 60-character footer to your message. Variables are not supported in the footer.
            </Typography>
            <TextField
              fullWidth
              label="Footer text"
              value={footer}
              onChange={handleFooterChange}
              helperText={`${footer.length} / ${charLimit} characters`}
              sx={{ mb: 3 }}
            />
            <Typography variant="h6">Preview:</Typography>
            <Typography
              variant="body1"
              sx={{ backgroundColor: '#f4f4f4', p: 2, borderRadius: 1 }}
            >
              {footer || 'Sample Footer'}
            </Typography>
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
        <Box sx={{
          position: 'sticky',
          top: 0,
          height: '100vh'
        }}>
          <Preview />
          <PreviewWhatsAppStyle />
        </Box>


      </Grid>
    </Grid>
  );
};

export default TemplateForm;