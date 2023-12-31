import React, { useState, useCallback } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import imageCompression from 'browser-image-compression';
import { Stack, Alert, Card, Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAuth } from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { FormProvider, RHFTextField, RHFUploadAvatar, RHFSelect } from '../../components/hook-form';
import { InsertEventAPI, UpdateEventAPI, myUploadFile } from '../../api';
import { MyDateTimePicker } from '../../components/controls';

const EventsForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { user } = useAuth();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const [phoneKey, setPhoneKey] = useState('974');
  const [whatsappKey, setWhatsappKey] = useState('974');

  const [startDate, setStartDate] = useState(recordForEdit?.startDate ?? Date.now());

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
    // id
    featureImage: Yup.mixed(),
    title: Yup.string().required(`${translate('events_page.title')} حقل مطلوب`),
    // phoneKey whatsappKey
    desc: Yup.string().required(`${translate('events_page.desc')} حقل مطلوب`),
    link: Yup.string(),
    linkText: Yup.string(),
    eventType: Yup.string().required(`${translate('events_page.eventType')} حقل مطلوب`),
    location: Yup.string().required(`${translate('events_page.location')} حقل مطلوب`),
    hostedBy: Yup.string().required(`${translate('events_page.hostedBy')} حقل مطلوب`),
    phone: Yup.string(),
    phoneKey: Yup.string(),
    whatsapp: Yup.string(),
    whatsappKey: Yup.string(),
    startDate: Yup.string().required(`${translate('events_page.startDate')} حقل مطلوب`),
    latitude: Yup.number(),
    longitude: Yup.number(),
    createdAt: Yup.number(),
    createdName: Yup.string(),
    createdBy: Yup.string(),
    // status: Yup.string(),
    countryCode: Yup.string(),
  });

  const defaultValues = {
    featureImage: recordForEdit?.featureImage || '',
    title: recordForEdit?.title || '',
    arrTitle: recordForEdit?.arrTitle || [],
    desc: recordForEdit?.desc || '',
    link: recordForEdit?.link || '',
    linkText: recordForEdit?.linkText || '',
    eventType: recordForEdit?.eventType || '',
    location: recordForEdit?.location || '',
    hostedBy: recordForEdit?.hostedBy || '',
    phone: recordForEdit?.phone || '',
    phoneKey: recordForEdit?.phoneKey || '',
    whatsapp: recordForEdit?.whatsapp || '',
    whatsappKey: recordForEdit?.whatsappKey || '',
    startDate: recordForEdit?.startDate || new Date().getTime(),
    latitude: recordForEdit?.latitude || 1.1,
    longitude: recordForEdit?.longitude || 1.1,
    createdAt: recordForEdit?.createdAt || new Date().getTime(),
    createdName: recordForEdit?.createdName || user.fullName,
    createdBy: recordForEdit?.createdBy || user.uid,
    status: recordForEdit?.status || 'Pending',
    countryCode: recordForEdit?.countryCode || 'QA',
  };

  const methods = useForm({
    resolver: yupResolver(ItemSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

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
        imageUrl = await myUploadFile(compressedFile, 'events');
      }

      const newItme = {
        // id: data.id,
        featureImage: imageUrl,
        title: data.title,
        arrTitle: data.title.split(' '),
        desc: data.desc,
        link: data.link,
        linkText: data.linkText,
        eventType: data.eventType,
        location: data.location,
        hostedBy: data.hostedBy,
        phone: data.phone,
        phoneKey,
        whatsapp: data.whatsapp,
        whatsappKey,
        startDate,
        latitude: data.latitude,
        longitude: data.longitude,
        createdAt: data.createdAt,
        createdName: data.createdName,
        createdBy: data.createdBy,
        status: data.status,
        countryCode: data.countryCode,
      };
      console.log(startDate);
      if (recordForEdit === null) {
        InsertEventAPI(newItme);
      } else {
        UpdateEventAPI(recordForEdit.id, newItme);
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
            <RHFTextField name="title" size="small" label={translate('events_page.title')} sx={{ pb: 1 }} />
            <RHFTextField name="desc" multiline rows={3} size="small" label={translate('share.desc')} sx={{ pb: 1 }} />
            <RHFTextField name="link" size="small" label={translate('events_page.link')} sx={{ pb: 1 }} />
            <RHFTextField name="linkText" size="small" label={translate('events_page.linkText')} sx={{ pb: 1 }} />
            <RHFTextField name="eventType" size="small" label={translate('events_page.eventType')} sx={{ pb: 1 }} />
            <RHFTextField name="location" size="small" label={translate('events_page.location')} sx={{ pb: 1 }} />
            <RHFTextField name="hostedBy" size="small" label={translate('events_page.hostedBy')} sx={{ pb: 1 }} />
            <Box
              sx={{
                display: 'grid',
                columnGap: 3,
                rowGap: 0,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <MyDateTimePicker
                label={translate('events_page.startDate')}
                name="startDate"
                size="small"
                value={startDate}
                onChange={(value) => {
                  setStartDate(value.target.value);
                }}
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
            {/* <RHFTextField name="countryCode" size="small" label={translate('events_page.countryCode')} sx={{ pb: 1 }} /> */}

            <RHFSelect name="countryCode" label={translate('share.countryCode')} sx={{ mb: 1 }}>
              <option value="" />
              {countryCodeArray.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect>
          </Box>

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
                  Allowed (jpeg,jpg,png, )
                  <br /> max size of 500 mb
                </Typography>
              }
            />
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

export { EventsForm };
