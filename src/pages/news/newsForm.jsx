import React, { useState, useCallback } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import imageCompression from 'browser-image-compression';
import { Stack, Alert, Card, Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { FormProvider, RHFTextField, RHFUploadAvatar, RHFSelect } from '../../components/hook-form';
import { InsertNewsAPI, UpdateNewsAPI, myUploadFile } from '../../api';
import { MyDatePicker } from '../../components/controls';
// import {  } from '../../api';

const NewsForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { user } = useAuth();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const [newsDate, setNewsDate] = useState(recordForEdit?.newsDate ?? Date.now());

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

  const newsCatArray = [
    { id: 'joys', arName: 'افراح' },
    { id: 'condolences', arName: 'تعازي' },
    { id: 'congratulation', arName: 'تهنئة' },
    { id: 'news', arName: 'خبر' },
    { id: 'other', arName: 'اخرى' },
  ];

  const ItemSchema = Yup.object().shape({
    featureImage: Yup.mixed(),
    title: Yup.string().required(`${translate('news_page.title')} حقل مطلوب`),
    // arrTitle
    desc: Yup.string().required(`${translate('news_page.desc')} حقل مطلوب`),
    link: Yup.string(),
    newsCat: Yup.string().required(`${translate('news_page.newsCat')} حقل مطلوب`),
    newsDate: Yup.number().required(`${translate('news_page.newsDate')} حقل مطلوب`),
    createdAt: Yup.number(),
    createdName: Yup.string(),
    createdBy: Yup.string(),
    // status: Yup.string(),
    countryCode: Yup.string(),
  });

  const defaultValues = {
    featureImage: recordForEdit?.featureImage || '',
    title: recordForEdit?.title || '',
    arrTitle: recordForEdit?.arrTitle || '',
    desc: recordForEdit?.desc || '',
    link: recordForEdit?.link || '',
    newsCat: recordForEdit?.newsCat || '',
    newsDate: recordForEdit?.newsDate || new Date().getTime(),
    createdAt: recordForEdit?.createdAt || new Date().getTime(),
    createdName: recordForEdit?.createdName || user.personName,
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
          maxSizeMB: 0.2,
          maxWidthOrHeight: 700,
        };
        const compressedFile = await imageCompression(data.featureImage, options);
        imageUrl = await myUploadFile(compressedFile, 'news');
        // imageUrl = await myUploadFile(data.featureImage, 'news');
      }

      const newItme = {
        featureImage: imageUrl,
        title: data.title,
        arrTitle: data.title.split(' '),
        desc: data.desc,
        link: data.link,
        newsCat: data.newsCat,
        newsDate,
        createdAt: data.createdAt,
        createdName: data.createdName,
        createdBy: data.createdBy,
        status: data.status,
        countryCode: data.countryCode,
      };
      if (recordForEdit === null) {
        InsertNewsAPI(newItme);
      } else {
        UpdateNewsAPI(recordForEdit.id, newItme);
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
            <RHFTextField name="title" size="small" label={translate('news_page.title')} sx={{ pb: 1 }} />
            <RHFTextField name="desc" multiline rows={3} size="small" label={translate('share.desc')} sx={{ pb: 1 }} />
            <RHFTextField name="link" size="small" label={translate('news_page.link')} sx={{ pb: 1 }} />

            <RHFSelect name="newsCat" label={translate('news_page.newsCat')} sx={{ mb: 1 }}>
              {/* <option value="" /> */}
              {newsCatArray.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect>

            <MyDatePicker
              label={translate('news_page.newsDate')}
              name="newsDate"
              size="small"
              value={newsDate}
              sx={{ pb: 1 }}
              onChange={(value) => {
                setNewsDate(value.target.value);
              }}
            />

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

export { NewsForm };
