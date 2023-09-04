import React from 'react';
import moment from 'moment';
import { DesktopDatePicker, LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TextField } from '@mui/material';

const MyDatePicker = (props) => {
  const { name, label, value, onChange } = props;

  function convertToDefEventPara(name, value) {
    const momDate = moment(new Date(value)).format('YYYY-MM-DD');
    const unixDate = new Date(momDate).getTime();
    return {
      target: {
        name,
        value: unixDate,
      },
    };
  }

  return (
    // <LocalizationProvider dateAdapter={AdapterMoment}>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label="Basic example"
        value={value}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};
export { MyDatePicker };
