import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import imageCompression from 'browser-image-compression';
import { Stack, Alert, Card, Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { FormProvider, RHFTextField, RHFUploadAvatar, RHFSelect } from '../../components/hook-form';
import { InsertAdvertiseAPI, UpdateAdvertiseAPI, myUploadFile } from '../../api';
import { MyDatePicker } from '../../components/controls';

const AdvertiseForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  // const [startTime, setStartTime] = useState(new Date());
  // const [endTime, setEndTime] = useState(new Date());

  const [startTime, setStartTime] = useState(recordForEdit?.startTime ?? Date.now());
  const [endTime, setEndTime] = useState(recordForEdit?.endTime ?? Date.now());

  const countryCodeArray = [
    { id: 'SA', arName: 'SA' },
    { id: 'AE', arName: 'AE' },
    { id: 'QA', arName: 'QA' },
    { id: 'OM', arName: 'OM' },
    { id: 'KW', arName: 'KW' },
    { id: 'BH', arName: 'BH' },
    { id: 'EG', arName: 'EG' },
    { id: 'US', arName: 'US' },
    { id: 'GB', arName: 'GB' },
    { id: 'CA', arName: 'CA' },
  ];

  const ItemSchema = Yup.object().shape({
    title: Yup.string().required(translate('advertise.title')),
    desc: Yup.string().required(translate('advertise.desc')),
    link: Yup.string(),
    featureImage: Yup.mixed().required(translate('advertise.featureImage')),
    comName: Yup.string(),
    // startDate: Yup.date(),
    // endDate: Yup.date(),
    phone: Yup.string(),
    phoneKey: Yup.string(),
    whatsapp: Yup.string(),
    whatsappKey: Yup.string(),
    latitude: Yup.string(),
    longitude: Yup.string(),
    createdAt: Yup.number(),
    countryCode: Yup.string(),
  });
  // const current = new Date();
  // const enddate = current.setDate(current.getDate() + 30);

  const defaultValues = {
    title: recordForEdit?.title || '',
    desc: recordForEdit?.desc || '',
    link: recordForEdit?.link || '',
    featureImage: recordForEdit?.featureImage || '',
    comName: recordForEdit?.comName || '',
    // startDate: recordForEdit?.startDate || new Date(),
    // endDate: recordForEdit?.endDate || new Date(),
    createdAt: recordForEdit?.createdAt || new Date().getTime(),
    countryCode: recordForEdit?.countryCode || 'QA',
  };

  const methods = useForm({
    resolver: yupResolver(ItemSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // const values = watch();

  const onSubmit = async (data) => {
    try {
      let imageUrl = 'Nil';
      if (data.featureImage.type === undefined) {
        imageUrl = data.featureImage;
      } else {
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 500,
        };
        const compressedFile = await imageCompression(data.featureImage, options);
        imageUrl = await myUploadFile(compressedFile, 'advertise');
      }

      const newItem = {
        title: data.title,
        desc: data.desc,
        link: data.link,
        featureImage: imageUrl,
        comName: data.comName,
        startDate: startTime,
        endDate: endTime,
        createdAt: data.createdAt,
        countryCode: data.countryCode,
      };

      if (recordForEdit === null) {
        await InsertAdvertiseAPI(newItem);
      } else {
        UpdateAdvertiseAPI(recordForEdit.id, newItem);
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
          'featureImage',
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
              label={translate('advertise.startTime')}
              name="startTime"
              size="small"
              value={startTime}
              sx={{ pb: 1 }}
              onChange={(value) => {
                setStartTime(value.target.value);
              }}
            />

            {/* <MyDatePicker
              fieldName="startTime"
              value={startTime}
              lableName="field.startTime"
              onChange={(newValue) => {
                const momDate = moment(new Date(newValue._d)).format('YYYY-MM-DD');
                setStartTime(momDate);
              }}
            /> */}
            <MyDatePicker
              label={translate('advertise.endTime')}
              name="endTime"
              size="small"
              value={endTime}
              sx={{ pb: 1 }}
              onChange={(value) => {
                setEndTime(value.target.value);
              }}
            />
            {/* <MyDatePicker
              fieldName="endTime"
              value={endTime}
              lableName="field.endTime"
              onChange={(newValue) => {
                const momDate = moment(new Date(newValue._d)).format('YYYY-MM-DD');
                setEndTime(momDate);
              }}
            /> */}
            <RHFSelect name="countryCode" label={translate('share.countryCode')} sx={{ mb: 1 }}>
              <option value="" />
              {countryCodeArray.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect>

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="featureImage"
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
