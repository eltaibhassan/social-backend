import React from 'react';
import { IconButton } from '@mui/material';

const MyActionButton = (props) => {
  const { color, children, onClick } = props;
  return (
    <IconButton
      size="small"
      sx={{
        bgcolor: '#fff',
        boxShadow: '0 1px 4px 0 rgba(0,0,0,0.12)',
        '&:hover': {
          bgcolor: '#fff',
          color: '#000',
        },
        padding: '5px',
        marginLeft: '5px',
      }}
      color={color || 'primary'}
      component="label"
      onClick={onClick}
    >
      {children}
    </IconButton>

    // <Button
    //     size="small"
    //     sx={{ width: 30, height:40, padding: 0, margin: 2,ontSize: 24 }}
    //     variant='outlined'
    //     className=""
    //     color = {color || "primary"}
    //     onClick={onClick}>
    //     {children}
    // </Button>
  );
};
export { MyActionButton };
