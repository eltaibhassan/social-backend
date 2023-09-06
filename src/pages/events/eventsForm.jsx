import React, { useState, useCallback } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Alert, Card, Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useAuth } from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import { InsertEventAPI, UpdateEventAPI, myUploadFile } from '../../api';
import { MyDatePicker, MyTimePicker } from '../../components/controls';
// import {  } from '../../api';

const EventsForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { user } = useAuth();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const [phoneKey, setPhoneKey] = useState('+249');
  const [whatsappKey, setWhatsappKey] = useState('+249');
  const [startDate, setStartDate] = useState(Date.now());
  const [startTime, setStartTime] = useState(Date.now());

  // id,
  // featureImage,
  // title,
  // arrTitle,
  // desc,
  // link,
  // linkText,
  // eventType,
  // location,
  // hostedBy,
  // phone,
  // whatsapp,
  // startDate,
  // startTime,
  // latitude,
  // longitude,
  // createdAt,
  // createdName,
  // createdBy,
  // status,
  // countryCode,

  const ItemSchema = Yup.object().shape({
    // id
    featureImage: Yup.mixed(),
    title: Yup.string().required(`${translate('events_page.title')} حقل مطلوب`),
    // arrTitle
    desc: Yup.string().required(`${translate('events_page.desc')} حقل مطلوب`),
    link: Yup.string(),
    linkText: Yup.string(),
    eventType: Yup.string().required(`${translate('events_page.eventType')} حقل مطلوب`),
    location: Yup.string().required(`${translate('events_page.location')} حقل مطلوب`),
    hostedBy: Yup.string().required(`${translate('events_page.hostedBy')} حقل مطلوب`),
    phone: Yup.string(),
    whatsapp: Yup.string(),
    startDate: Yup.number().required(`${translate('events_page.startDate')} حقل مطلوب`),
    startTime: Yup.number().required(`${translate('events_page.startTime')} حقل مطلوب`),
    latitude: Yup.number(),
    longitude: Yup.number(),
    createdAt: Yup.number(),
    createdName: Yup.string(),
    createdBy: Yup.string(),
    // status: Yup.string(),
    countryCode: Yup.string(),
  });

  const defaultValues = {
    // id: recordForEdit?.id || '',
    featureImage: recordForEdit?.featureImage || '',
    title: recordForEdit?.title || '',
    arrTitle: recordForEdit?.arrTitle || '',
    desc: recordForEdit?.desc || '',
    link: recordForEdit?.link || '',
    linkText: recordForEdit?.linkText || '',
    eventType: recordForEdit?.eventType || '',
    location: recordForEdit?.location || '',
    hostedBy: recordForEdit?.hostedBy || '',
    phone: recordForEdit?.phone || '',
    whatsapp: recordForEdit?.whatsapp || '',
    startDate: recordForEdit?.startDate || new Date().getTime(),
    startTime: recordForEdit?.startTime || new Date().getTime(),
    latitude: recordForEdit?.latitude || 1.1,
    longitude: recordForEdit?.longitude || 1.1,
    createdAt: recordForEdit?.createdAt || new Date().getTime(),
    createdName: recordForEdit?.createdName || user.personName,
    createdBy: recordForEdit?.createdBy || user.uid,
    status: recordForEdit?.status || 'Pending',
    countryCode: recordForEdit?.countryCode || '',
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
        imageUrl = await myUploadFile(data.featureImage, 'pubicImg');
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
        phone: `${phoneKey}${data.phone}`,
        whatsapp: `${whatsappKey}${data.whatsapp}`,
        startDate: data.startDate,
        startTime: data.startTime,
        latitude: data.latitude,
        longitude: data.longitude,
        createdAt: data.createdAt,
        createdName: data.createdName,
        createdBy: data.createdBy,
        status: data.status,
        countryCode: data.countryCode,
      };
      if (recordForEdit === null) {
        console.log('------------------------------');
        console.log('will insert');
        console.log(startTime);

        InsertEventAPI(newItme);
      } else {
        console.log('------------------------------');
        console.log('will update');
        UpdateEventAPI(data.id, newItme);
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
            <RHFTextField name="desc" size="small" label={translate('events_page.desc')} sx={{ pb: 1 }} />
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
                pb: 1,
              }}
            >
              <MyDatePicker
                label={translate('events_page.startDate')}
                name="startDate"
                size="small"
                value={startDate}
                onChange={(value) => {
                  setStartDate(value.target.value);
                }}
              />
              <MyTimePicker
                label={translate('events_page.startTime')}
                name="startTime"
                size="small"
                value={startTime}
                onChange={(value) => {
                  setStartTime(value.target.value);
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
                onlyCountries={['sd', 'sa', 'ae', 'qa', 'kw', 'om', 'bh', 'eg', 'us', 'gb']}
                country={'sd'}
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
                onlyCountries={['sd', 'sa', 'ae', 'qa', 'kw', 'om', 'bh', 'eg', 'us', 'gb']}
                country={'sd'}
                enableSearch="true"
                value={phoneKey}
                onChange={(code) => setWhatsappKey(code)}
              />
            </Box>
            <RHFTextField name="latitude" size="small" label={translate('events_page.latitude')} sx={{ pb: 1 }} />
            <RHFTextField name="longitude" size="small" label={translate('events_page.longitude')} sx={{ pb: 1 }} />
            <RHFTextField name="countryCode" size="small" label={translate('events_page.countryCode')} sx={{ pb: 1 }} />
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
