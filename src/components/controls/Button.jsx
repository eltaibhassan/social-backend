import React from 'react';
import { Button } from '@mui/material';

const MyButton = (props) => {
  const { text, size, color, variant, onClick, ...other } = props;
  return (
    <Button
      sx={{ marginRight: '10px' }}
      variant={variant || 'contained'}
      size={size || 'large'}
      color={color || 'primary'}
      onClick={onClick}
      {...other}
    >
      {text}
    </Button>
  );
};
export { MyButton };
