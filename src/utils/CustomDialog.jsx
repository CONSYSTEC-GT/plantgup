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
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        <Alert
          severity={severity}
          sx={{ mb: 2, alignItems: 'center' }}
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
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};