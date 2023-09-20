// import React from 'react';
// import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
// import { TextField } from '@mui/material';

// const MyTimePicker = (props) => {
//   const { name, label, value, onChange, ...other } = props;

//   function convertToDefEventPara(name, value) {
//     return {
//       target: {
//         name,
//         value,
//       },
//     };
//   }

//   return (
//     <LocalizationProvider dateAdapter={AdapterMoment}>
//       <TimePicker
//         label={label}
//         size="small"
//         name={name}
//         value={value}
//         onChange={(date) => onChange(convertToDefEventPara(name, date))}
//         {...other}
//         renderInput={(params) => (
//           <TextField
//             size="small"
//             {...params}
//             sx={
//               {
//                 // width: '100%',
//               }
//             }
//           />
//         )}
//       />
//     </LocalizationProvider>
//   );
// };
// export { MyTimePicker };
