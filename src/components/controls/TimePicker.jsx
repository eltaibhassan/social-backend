import React from 'react';
import moment from 'moment';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField } from '@mui/material';

const MyTimePicker = (props) => {
  const { name, label, value, onChange, ...other } = props;

  function convertToDefEventPara(name, value) {
    const momDate = moment(new Date(value)).moment().format('LT');
    const unixDate = new Date(momDate).getTime();
    return {
      target: {
        name,
        value: unixDate,
      },
    };
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <TimePicker
        label={label}
        // inputFormat="h:mm"
        name={name}
        value={value}
        onChange={(date) => onChange(convertToDefEventPara(name, date))}
        {...other}
        renderInput={(params) => (
          <TextField
            size="small"
            {...params}
            sx={{
              pb: 1,
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
export { MyTimePicker };
