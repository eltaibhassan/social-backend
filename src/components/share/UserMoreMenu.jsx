import { useRef, useState } from 'react';
import { Menu, IconButton, Button, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import useLocales from '../../hooks/useLocales';
import { Iconify } from './Iconify';

const UserMoreMenu = (props) => {
  const { translate } = useLocales();
  const ref = useRef(null);
  const { onEdit, onDelete } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 120, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Button sx={{ px: 2 }} onClick={onEdit} startIcon={<EditIcon />}>
          <Typography variant="button" gutterBottom>
            {translate('control.edit')}
          </Typography>
        </Button>
        <Button sx={{ px: 2 }} onClick={onDelete} startIcon={<DeleteIcon />}>
          <Typography variant="button" gutterBottom>
            {translate('control.delete')}
          </Typography>
        </Button>
      </Menu>
    </>
  );
};
export { UserMoreMenu };

const EditOnlyMenu = (props) => {
  const { translate } = useLocales();
  const ref = useRef(null);
  const { onEdit } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 120, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Button sx={{ px: 2 }} onClick={onEdit} startIcon={<EditIcon />}>
          <Typography variant="button" gutterBottom>
            {translate('control.edit')}
          </Typography>
        </Button>
      </Menu>
    </>
  );
};
export { EditOnlyMenu };

const PublishMenu = (props) => {
  const { translate } = useLocales();
  const ref = useRef(null);
  const { onPublish, onUnPublish, onEdit, onDelete } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 120, maxWidth: '100%' },
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Button sx={{ px: 2 }} onClick={onPublish} startIcon={<EditIcon />}>
          <Typography variant="button" gutterBottom>
            {translate('control.publish')}
          </Typography>
        </Button>
        <Button sx={{ px: 2 }} onClick={onUnPublish} startIcon={<EditIcon />}>
          <Typography variant="button" gutterBottom>
            {translate('control.unPublish')}
          </Typography>
        </Button>

        <Button sx={{ px: 2 }} onClick={onEdit} startIcon={<EditIcon />}>
          <Typography variant="button" gutterBottom>
            {translate('control.edit')}
          </Typography>
        </Button>
        <Button sx={{ px: 2 }} onClick={onDelete} startIcon={<DeleteIcon />}>
          <Typography variant="button" gutterBottom>
            {translate('control.delete')}
          </Typography>
        </Button>
      </Menu>
    </>
  );
};
export { PublishMenu };
