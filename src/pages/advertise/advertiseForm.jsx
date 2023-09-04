import React, { useCallback, useState } from 'react';
import moment from 'moment';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Alert, Card, Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import { AddAdvertiseAPI, UpdateAdvertiseAPI } from '../../api/advertiseAPI';
import { MyDatePicker } from './DatePicker';

const AdvertiseForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const ItemSchema = Yup.object().shape({
    title: Yup.string().required(translate('validation.catArTitle')),
    desc: Yup.string().required(translate('validation.catArTitle')),
    link: Yup.string(),
    imgUrl: Yup.mixed(),
    comName: Yup.string(),
    // startDate: Yup.date(),
    // endDate: Yup.date(),
    createdAt: Yup.number(),
  });
  // const current = new Date();
  // const enddate = current.setDate(current.getDate() + 30);

  const defaultValues = {
    id: recordForEdit?.id || 0,
    title: recordForEdit?.title || '',
    desc: recordForEdit?.desc || '',
    link: recordForEdit?.link || '',
    imgUrl: recordForEdit?.imgUrl || '',
    comName: recordForEdit?.comName || 'no name',
    // startDate: recordForEdit?.startDate || new Date(),
    // endDate: recordForEdit?.endDate || new Date(),
    createdAt: recordForEdit?.createdAt || new Date().getTime(),
  };

  const methods = useForm({
    resolver: yupResolver(ItemSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    // watch,
    // control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // const values = watch();

  const onSubmit = async (data) => {
    try {
      const newItem = {
        id: data.id,
        title: data.title,
        desc: data.desc,
        link: data.link,
        imgUrl: data.imgUrl,
        comName: data.comName,
        startDate: startTime,
        endDate: endTime,
        createdAt: data.createdAt,
      };
      console.log(data.title);

      console.log(data.imgUrl);
      if (recordForEdit === null) {
        await AddAdvertiseAPI(newItem);
      } else {
        UpdateAdvertiseAPI(newItem);
      }
      reset();
      AfterAddOrEdit();
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar(recordForEdit === null ? 'Create success!' : 'Update success!');
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setValue(
          'imgUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              maxWidth: 700,
              display: 'row',
              columnGap: 2,
              rowGap: 3,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
            }}
          >
            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
            <RHFTextField name="title" size="small" label={translate('advertise.title')} sx={{ pb: 1 }} />
            <RHFTextField name="desc" size="small" label={translate('advertise.desc')} sx={{ pb: 1 }} />
            <RHFTextField name="link" size="small" label={translate('advertise.link')} rows={2} sx={{ pb: 1 }} />
            <RHFTextField name="comName" size="small" label={translate('advertise.comName')} rows={2} sx={{ pb: 1 }} />
            <MyDatePicker
              fieldName="startTime"
              value={startTime}
              lableName="field.startTime"
              onChange={(newValue) => {
                const momDate = moment(new Date(newValue._d)).format('YYYY-MM-DD');
                setStartTime(momDate);
              }}
            />
            <MyDatePicker
              fieldName="endTime"
              value={endTime}
              lableName="field.endTime"
              onChange={(newValue) => {
                const momDate = moment(new Date(newValue._d)).format('YYYY-MM-DD');
                setEndTime(momDate);
              }}
            />
            {/* <MyDatePicker fieldName="endTime" lableName="field.endTime" /> */}
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="imgUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                sx={{ mt: 2 }}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of 500 mb
                  </Typography>
                }
              />
            </Box>
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              {translate('control.save')}
            </LoadingButton>
          </Stack>
        </Card>
      </Grid>
    </FormProvider>
  );
};

export { AdvertiseForm };
