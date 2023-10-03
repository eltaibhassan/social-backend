import React, { useCallback, useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import imageCompression from 'browser-image-compression';
import { Stack, Alert, Card, Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import PhoneInput from 'react-phone-input-2';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { FormProvider, RHFTextField, RHFUploadAvatar, RHFSelect } from '../../components/hook-form';
import { InsertAdvertiseAPI, UpdateAdvertiseAPI, myUploadFile } from '../../api';
import { MyDatePicker } from '../../components/controls';

const AdvertiseForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const [startDate, setStartDate] = useState(recordForEdit?.startDate ?? Date.now());
  const [endDate, setEndDate] = useState(recordForEdit?.endDate ?? Date.now());
  const [phoneKey, setPhoneKey] = useState('974');
  const [whatsappKey, setWhatsappKey] = useState('974');

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
    startDate: Yup.number(),
    endDate: Yup.number(),
    phone: Yup.string(),
    phoneKey: Yup.string(),
    whatsapp: Yup.string(),
    whatsappKey: Yup.string(),
    latitude: Yup.number(),
    longitude: Yup.number(),
    createdAt: Yup.number(),
    countryCode: Yup.string(),
  });

  const defaultValues = {
    title: recordForEdit?.title || '',
    desc: recordForEdit?.desc || '',
    link: recordForEdit?.link || '',
    featureImage: recordForEdit?.featureImage || '',
    comName: recordForEdit?.comName || '',
    startDate: recordForEdit?.startDate || new Date().getTime(),
    endDate: recordForEdit?.endDate || new Date().getTime(),
    phone: recordForEdit?.phone || '',
    phoneKey: recordForEdit?.phoneKey || '',
    whatsapp: recordForEdit?.whatsapp || '',
    whatsappKey: recordForEdit?.whatsappKey || '',
    latitude: recordForEdit?.latitude || 1.1,
    longitude: recordForEdit?.longitude || 1.1,
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
        startDate,
        endDate,
        phone: data.phone,
        phoneKey,
        whatsapp: data.whatsapp,
        whatsappKey,
        latitude: data.latitude,
        longitude: data.longitude,
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
              label={translate('advertise.startDate')}
              name="startDate"
              size="small"
              value={startDate}
              sx={{ pb: 1 }}
              onChange={(value) => {
                setStartDate(value.target.value);
              }}
            />

            <MyDatePicker
              label={translate('advertise.endDate')}
              name="endDate"
              size="small"
              value={endDate}
              sx={{ pb: 1 }}
              onChange={(value) => {
                setEndDate(value.target.value);
              }}
            />
            <Box
              sx={{
                display: 'grid',
                columnGap: 3,
                rowGap: 0,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                // pb: 1,
              }}
            >
              <RHFTextField name="phone" size="small" label={translate('events_page.phone')} sx={{ pb: 1 }} />
              <PhoneInput
                sx={{ width: 20, height: 20, color: 'green', mr: 1 }}
                onlyCountries={['qa', 'sa', 'ae', 'kw', 'om', 'bh', 'eg', 'us', 'gb']}
                country={'qa'}
                enableSearch="true"
                value={phoneKey}
                onChange={(code) => setPhoneKey(code)}
              />
            </Box>
            <Box
              sx={{
                display: 'grid',
                columnGap: 3,
                rowGap: 0,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                // pb: 1,
              }}
            >
              <RHFTextField name="whatsapp" size="small" label={translate('events_page.whatsapp')} sx={{ pb: 1 }} />
              <PhoneInput
                sx={{ width: 20, height: 20, color: 'green', mr: 1 }}
                onlyCountries={['qa', 'sa', 'ae', 'kw', 'om', 'bh', 'eg', 'us', 'gb']}
                country={'qa'}
                enableSearch="true"
                value={phoneKey}
                onChange={(code) => setWhatsappKey(code)}
              />
            </Box>
            <RHFTextField name="latitude" size="small" label={translate('events_page.latitude')} sx={{ pb: 1 }} />
            <RHFTextField name="longitude" size="small" label={translate('events_page.longitude')} sx={{ pb: 1 }} />

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
