import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const MySnackbar = (props) => {
  const { notify, setNotify } = props;
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotify({
      ...notify,
      isOpen: false,
    });
  };
  return (
    <Snackbar
      // className="root"
      open={notify.isOpen}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={handleClose}
    >
      <Alert severity={notify.type} sx={{ width: '100%' }} onClose={handleClose}>
        {notify.message}
      </Alert>
    </Snackbar>
  );
};

export { MySnackbar };
