import React from 'react';
import { FormControl, FormControlLabel, Checkbox } from '@mui/material';

const MyCheckbox = (props) => {
  const { name, label, value, onChange, ...other } = props;
  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value,
    },
  });
  return (
    <FormControl>
      <FormControlLabel
        control={
          <Checkbox
            name={name}
            color="primary"
            checked={value}
            onChange={(e) => onChange(convertToDefEventPara(name, e.target.checked))}
            // sx={{ width: '100%' }}
            {...other}
          />
        }
        label={label}
      />
    </FormControl>
  );
};
export { MyCheckbox };
