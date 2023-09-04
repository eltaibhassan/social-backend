import { TextField } from '@mui/material';
import React from 'react';

const MyInput = (props) => {
  const { name, label, value, error = null, onChange, ...other } = props;
  return (
    <TextField
      sx={{ marginBottom: '10px', width: '10' }}
      // fullWidth
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
};
export { MyInput };
