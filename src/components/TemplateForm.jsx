import React, { useState } from "react";
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const TemplateForm = () => {
  const [templateName, setTemplateName] = useState("");
  const [category, setCategory] = useState("");

  const handleTemplateNameChange = (event) => {
    setTemplateName(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <Box sx={{ maxWidth: 600, marginTop:2, p: 4, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h5" mb={2}>
        Template name*
      </Typography>
      <TextField
        fullWidth
        label="Template name"
        value={templateName}
        onChange={handleTemplateNameChange}
        helperText="Template names can only contain small letters, numbers, and underscores."
      />
      
      <Box mt={4}>
        <Typography variant="h6" mb={2}>
          Category*
        </Typography>
        <FormControl>
          <FormLabel>Choose what type of message template you want to create:</FormLabel>
          <RadioGroup value={category} onChange={handleCategoryChange}>
            <FormControlLabel
              value="marketing"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center">
                  <Typography>Marketing</Typography>
                  <Tooltip title="Send promo offers, product offers, and more to increase awareness and engagement.">
                    <IconButton>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
            <FormControlLabel
              value="utility"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center">
                  <Typography>Utility</Typography>
                  <Tooltip title="Send account updates, order updates, alerts, and more.">
                    <IconButton>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
            <FormControlLabel
              value="authentication"
              control={<Radio />}
              label={
                <Box display="flex" alignItems="center">
                  <Typography>Authentication</Typography>
                  <Tooltip title="Send codes that allow your customers to access their accounts.">
                    <IconButton>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
};

export default TemplateForm;
