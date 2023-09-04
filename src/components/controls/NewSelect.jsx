import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';

const MyNewSelect = (props) => {
  const { control } = useFormContext();
  const { name, options } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <MuiSelect {...field} name={name}>
            {options.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.arName}
              </MenuItem>
            ))}
          </MuiSelect>
          {error && <FormHelperText>{error}</FormHelperText>}
        </>
      )}
    />
  );
};
export { MyNewSelect };
