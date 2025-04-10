// components/CustomDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Slide
} from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CustomDialog = ({
  open,
  onClose,
  title,
  message,
  severity = 'success',
  buttonText = 'Entendido',
  buttonVariant = 'contained',
  showIcon = true,
  fullWidthButton = true
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,  
          bgcolor: 'primary.light', 
          color: 'primary.contrastText', 
          py: 1, 
          px: 2,
          fontWeight: 'medium'
        }}
      >
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 4, textAlign: 'center' }}>
        <Alert
          severity={severity}
          sx={{ 
            mb: 2, 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'left'
          }}
          icon={showIcon ? undefined : false}
        >
          {message}
        </Alert>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          variant={buttonVariant}
          color="primary"
          fullWidth={fullWidthButton}
          size="large"
          sx={{
            borderRadius: 1,
            textTransform: 'none',
            fontWeight: 'medium'
          }}
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};