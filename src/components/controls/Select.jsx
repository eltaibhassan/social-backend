import React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';

const MySelect = (props) => {
  const { name, label, value, error = null, onChange, options, ...other } = props;
  return (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }} {...(error && { error: true })} {...other}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {/* <MenuItem value="">None</MenuItem> */}
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.arName}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export { MySelect };

const MySelectProCats = (props) => {
  const { name, label, value, error = null, onChange, options, ...other } = props;
  return (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }} {...(error && { error: true })} {...other}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.arName}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export { MySelectProCats };

const MySelectCategory = (props) => {
  const { name, label, value, error = null, onChange, options, ...other } = props;
  return (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }} {...(error && { error: true })} {...other}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export { MySelectCategory };

const MySelectPurpose = (props) => {
  const { name, label, value, error = null, onChange, options, ...other } = props;
  return (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }} {...(error && { error: true })} {...other}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.arName}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export { MySelectPurpose };

// const MySelectPurpose = (props) => {
//   const { name, label, value, error = null, onChange, options, ...other } = props;
//   return (
//     <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }} {...(error && { error: true })} {...other}>
//       <InputLabel>{label}</InputLabel>
//       <MuiSelect label={label} name={name} value={value} onChange={onChange}>
//         {options.map((item) => (
//           <MenuItem key={item.id} value={item.id}>
//             {item.name}
//           </MenuItem>
//         ))}
//       </MuiSelect>
//       {error && <FormHelperText>{error}</FormHelperText>}
//     </FormControl>
//   );
// };
// export { MySelectPurpose };

const MySelectHelpType = (props) => {
  const { name, label, value, error = null, onChange, options, ...other } = props;
  return (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }} {...(error && { error: true })} {...other}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.arName}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export { MySelectHelpType };

const MySelectState = (props) => {
  const { name, label, value, error = null, onChange, options, ...other } = props;
  return (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }} {...(error && { error: true })} {...other}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.arName}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export { MySelectState };

const MySelectLocality = (props) => {
  const { name, label, value, error = null, onChange, options, ...other } = props;
  return (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }} {...(error && { error: true })} {...other}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.arName}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export { MySelectLocality };

const MySelectPublishStatus = (props) => {
  const { name, label, value, error = null, onChange, options, ...other } = props;
  return (
    <FormControl variant="outlined" fullWidth sx={{ marginBottom: '10px' }} {...(error && { error: true })} {...other}>
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.arName}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
export { MySelectPublishStatus };
