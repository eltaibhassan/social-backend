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
import { InsertAssociationAPI, UpdateAssociationAPI, myUploadFile } from '../../api';

const AssociationsForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { user } = useAuth();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const [phoneKey, setPhoneKey] = useState('974');
  const [whatsappKey, setWhatsappKey] = useState('974');

  const countryCodeArray = [
    { id: 'SA', arName: 'السعودية' },
    { id: 'AE', arName: 'الامارات' },
    { id: 'QA', arName: 'قطر' },
    { id: 'OM', arName: 'عمان' },
    { id: 'KW', arName: 'الكويت' },
    { id: 'BH', arName: 'البحرين' },
    { id: 'EG', arName: 'مصر' },
    { id: 'US', arName: 'امريكا' },
    { id: 'GB', arName: 'بريطانيا' },
    { id: 'CA', arName: 'كندا' },
  ];

  const ItemSchema = Yup.object().shape({
    featureImage: Yup.mixed(),
    name: Yup.string().required(`${translate('association_page.name')} حقل مطلوب`),
    // arrTitle
    desc: Yup.string().required(`${translate('association_page.desc')} حقل مطلوب`),
    website: Yup.string(),
    facebook: Yup.string(),
    twitter: Yup.string(),
    youtube: Yup.string(),
    phone: Yup.string(),
    whatsapp: Yup.string(),
    createdAt: Yup.number(),
    createdName: Yup.string(),
    createdBy: Yup.string(),
    // status: Yup.string(),
    countryCode: Yup.string(),
  });

  const defaultValues = {
    featureImage: recordForEdit?.featureImage || '',
    name: recordForEdit?.name || '',
    arrName: recordForEdit?.arrName || '',
    desc: recordForEdit?.desc || '',
    website: recordForEdit?.website || '',
    facebook: recordForEdit?.facebook || '',
    twitter: recordForEdit?.twitter || '',
    youtube: recordForEdit?.youtube || '',
    phone: recordForEdit?.phone || '',
    whatsapp: recordForEdit?.whatsapp || '',
    order: recordForEdit?.order || 0,
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
        imageUrl = await myUploadFile(compressedFile, 'association');
      }

      const newItme = {
        featureImage: imageUrl,
        name: data.name,
        arrName: data.name.split(' '),
        desc: data.desc,
        website: data.website,
        facebook: data.facebook,
        twitter: data.twitter,
        youtube: data.youtube,
        phone: data.phone,
        phoneKey,
        whatsapp: data.whatsapp,
        whatsappKey,
        order: 0,
        createdAt: data.createdAt,
        createdName: data.createdName,
        createdBy: data.createdBy,
        status: data.status,
        countryCode: data.countryCode,
      };
      if (recordForEdit === null) {
        console.log('------------------------------');
        console.log('will insert');
        InsertAssociationAPI(newItme);
      } else {
        console.log('------------------------------');
        console.log('will update');
        UpdateAssociationAPI(recordForEdit.id, newItme);
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
            <RHFTextField name="name" size="small" label={translate('association_page.name')} sx={{ pb: 1 }} />
            <RHFTextField
              name="desc"
              multiline
              rows={3}
              size="small"
              label={translate('association_page.desc')}
              sx={{ pb: 1 }}
            />
            <RHFTextField name="website" size="small" label={translate('association_page.website')} sx={{ pb: 1 }} />
            <RHFTextField name="facebook" size="small" label={translate('association_page.facebook')} sx={{ pb: 1 }} />
            <RHFTextField name="twitter" size="small" label={translate('association_page.twitter')} sx={{ pb: 1 }} />
            <RHFTextField name="youtube" size="small" label={translate('association_page.youtube')} sx={{ pb: 1 }} />

            <Box
              sx={{
                display: 'grid',
                columnGap: 3,
                rowGap: 0,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                // pb: 1,
              }}
            >
              <RHFTextField name="phone" size="small" label={translate('association_page.phone')} sx={{ pb: 1 }} />
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
              <RHFTextField
                name="whatsapp"
                size="small"
                label={translate('association_page.whatsapp')}
                sx={{ pb: 1 }}
              />
              <PhoneInput
                sx={{ width: 20, height: 20, color: 'green', mr: 1 }}
                onlyCountries={['qa', 'sa', 'ae', 'kw', 'om', 'bh', 'eg', 'us', 'gb']}
                country={'qa'}
                enableSearch="true"
                value={phoneKey}
                onChange={(code) => setWhatsappKey(code)}
              />
            </Box>

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

export { AssociationsForm };
