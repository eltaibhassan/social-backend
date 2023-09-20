import React from 'react';
import moment from 'moment';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField } from '@mui/material';

const MyDateTimePicker = (props) => {
  const { name, label, value, onChange, ...other } = props;

  function convertToDefEventPara(name, value) {
    const momDate = moment(new Date(value));
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
      <DateTimePicker
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
export { MyDateTimePicker };
