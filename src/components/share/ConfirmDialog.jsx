import React from 'react';
import { Dialog, DialogActions, DialogContent, Stack, Typography } from '@mui/material';
import { MyButton } from '../controls/Button';
import useLocales from '../../hooks/useLocales';
import { Iconify } from './Iconify';

const ConfirmDialog = (props) => {
  const { translate } = useLocales();
  const { confirmDialog, setConfirmDialog } = props;
  return (
    <Dialog open={confirmDialog.isOpen}>
      {/* <DialogTitle className="dialogTitle">
        <IconButton disableRipple className="titleIcon">
          <NotListedLocationIcon />
        </IconButton>
      </DialogTitle> */}
      {/* <Iconify icon="eva:checkmark-fill" /> */}

      <Stack display="container" direction="column" alignItems="center" sx={{ pt: 3 }}>
        <Iconify icon="emojione-v1:warning" sx={{ width: 50, height: 50, color: 'green', mr: 1 }} />
      </Stack>

      <DialogContent className="dialogContent">
        <Typography variant="subtitle1" sx={{ pb: 2 }}>
          {confirmDialog.title}
        </Typography>
        <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
      </DialogContent>
      <DialogActions className="dialogAction">
        <MyButton
          text={translate('message.no')}
          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        />
        <MyButton text={translate('message.yes')} color="secondary" onClick={confirmDialog.onConfirm} />
      </DialogActions>
    </Dialog>
  );
};

export { ConfirmDialog };
