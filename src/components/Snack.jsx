import { Alert, Snackbar } from '@mui/material';
import React from 'react';

const Snack = ({open, onClose}) => {
  
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      message="Fill Blanks">
      <Alert severity="error" variant="filled">
        Fill Blanks
      </Alert>
    </Snackbar>
  );
};

export default Snack;
