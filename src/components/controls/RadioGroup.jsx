import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const MyRadioGroup = (props) => {
  const { name, label, value, onChange, items } = props;
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <RadioGroup row name={name} value={value} onChange={onChange}>
        {items.map((item) => (
          <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.title} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
export { MyRadioGroup };
