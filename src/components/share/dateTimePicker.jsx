import { useFormContext, Controller } from 'react-hook-form';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Stack, TextField } from '@mui/material';
import useLocales from '../../hooks/useLocales';

const MyDateTimePicker = (props) => {
  const { translate } = useLocales();
  const { fieldName, lableName } = props;
  const { control } = useFormContext();

  console.log(fieldName.toString());
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ pt: 1 }}>
      <Controller
        name={fieldName}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateTimePicker
              label={translate(lableName)}
              value={field.value}
              onChange={(newValue) => {
                field.onChange(newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" fullWidth error={!!error} helperText={error?.message} />
              )}
            />
          </LocalizationProvider>
        )}
      />
    </Stack>
  );
};
export { MyDateTimePicker };
