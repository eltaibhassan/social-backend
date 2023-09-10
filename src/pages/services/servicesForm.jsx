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
import { FormProvider, RHFTextField, RHFUploadAvatar, RHFSelect } from '../../components/hook-form';
import { InsertServiceAPI, UpdateServiceAPI, myUploadFile } from '../../api';

const ServicesForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { user } = useAuth();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const [phoneKey, setPhoneKey] = useState('+249');
  const [whatsappKey, setWhatsappKey] = useState('+249');

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

  const serviceCatArray = [
    { id: 'productiveFamilies', arName: 'الاسر المنتجة' },
    { id: 'vacancyJob', arName: 'وظائف شاغرة' },
    { id: 'properties', arName: 'عقارات' },
    { id: 'Other', arName: 'اخرى' },
  ];

  const ItemSchema = Yup.object().shape({
    serviceCat: Yup.string(),
    title: Yup.string().required(`${translate('services_page.title')} حقل مطلوب`),
    // arrProName: Yup.string(),
    desc: Yup.string(),
    featureImage: Yup.mixed(),
    images: Yup.array(),
    phone: Yup.string(),
    whatsapp: Yup.string(),
    unitBy: Yup.string().required(`${translate('services_page.unitBy')} حقل مطلوب`),
    unitPrice: Yup.number().required(`${translate('services_page.unitPrice')} حقل مطلوب`),
    address: Yup.string(),
    longitude: Yup.number(),
    conmmentList: Yup.array(),
    isFeatured: Yup.boolean(),
    createdName: Yup.string(),
    createdBy: Yup.string(),
    createdAt: Yup.number(),
    // status: Yup.string(),
    countryCode: Yup.string(),
  });

  const defaultValues = {
    serviceCat: recordForEdit?.serviceCat || '',
    title: recordForEdit?.title || '',
    arrProName: recordForEdit?.title.split(' '),
    desc: recordForEdit?.desc || '',
    featureImage: recordForEdit?.featureImage || '',
    images: recordForEdit?.images || [],
    phone: recordForEdit?.phone || '',
    whatsapp: recordForEdit?.whatsapp || '',
    unitBy: recordForEdit?.unitBy || '',
    unitPrice: recordForEdit?.unitPrice || 0,
    address: recordForEdit?.address || '',
    latitude: recordForEdit?.latitude || 0,
    longitude: recordForEdit?.longitude || 0,
    conmmentList: recordForEdit?.conmmentList || [],
    isFeatured: recordForEdit?.isFeatured || false,
    createdName: recordForEdit?.createdName || user.personName,
    createdBy: recordForEdit?.createdBy || user.uid,
    createdAt: recordForEdit?.createdAt || new Date().getTime(),
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

  // const onSelectProCats = (val) => {
  //   setSelectedProCat(val);
  //   setValue('cityid', val);
  // };

  const onSubmit = async (data) => {
    try {
      let imageUrl = 'Nil';
      if (data.featureImage.type === undefined) {
        imageUrl = data.featureImage;
      } else {
        imageUrl = await myUploadFile(data.featureImage, 'pubicImg');
      }

      const newItme = {
        serviceCat: data.serviceCat,
        title: data.title,
        arrProName: data.title.split(' '),
        desc: data.desc,
        featureImage: imageUrl,
        images: data.images,
        phone: `${phoneKey}${data.phone}`,
        whatsapp: `${whatsappKey}${data.whatsapp}`,
        unitBy: data.unitBy,
        unitPrice: data.unitPrice,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        conmmentList: data.conmmentList,
        isFeatured: data.isFeatured,
        createdName: data.createdName,
        createdBy: data.createdBy,
        createdAt: data.createdAt,
        status: data.status,
        countryCode: data.countryCode,
      };
      if (recordForEdit === null) {
        console.log('------------------------------');
        console.log('will insert');

        InsertServiceAPI(newItme);
      } else {
        console.log('------------------------------');
        console.log('will update');
        UpdateServiceAPI(data.id, newItme);
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
            {/* <ProCatsSelector onSelectProCats={onSelectProCats} selectedValue={selectedProCat} /> */}

            <RHFSelect name="serviceCat" label={translate('services_page.serviceCat')} sx={{ mb: 1 }}>
              {/* <option value="" /> */}
              {serviceCatArray.map((option) => (
                <option key={option.id} value={option.arName}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect>

            <RHFTextField name="title" size="small" label={translate('services_page.title')} sx={{ pb: 1 }} />
            <RHFTextField
              name="desc"
              multiline
              rows={3}
              size="small"
              label={translate('services_page.desc')}
              sx={{ pb: 1 }}
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
              <RHFTextField name="phone" size="small" label={translate('services_page.phone')} sx={{ pb: 1 }} />
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
              <RHFTextField name="whatsapp" size="small" label={translate('services_page.whatsapp')} sx={{ pb: 1 }} />
              <PhoneInput
                sx={{ width: 20, height: 20, color: 'green', mr: 1 }}
                onlyCountries={['sd', 'sa', 'ae', 'qa', 'kw', 'om', 'bh', 'eg', 'us', 'gb']}
                country={'sd'}
                enableSearch="true"
                value={whatsappKey}
                onChange={(code) => setWhatsappKey(code)}
              />
            </Box>

            <RHFTextField name="unitBy" size="small" label={translate('services_page.unitBy')} sx={{ pb: 1 }} />
            <RHFTextField name="unitPrice" size="small" label={translate('services_page.unitPrice')} sx={{ pb: 1 }} />
            <RHFTextField name="address" size="small" label={translate('services_page.address')} sx={{ pb: 1 }} />
            <RHFTextField name="latitude" size="small" label={translate('services_page.latitude')} sx={{ pb: 1 }} />
            <RHFTextField name="longitude" size="small" label={translate('services_page.longitude')} sx={{ pb: 1 }} />

            <RHFSelect name="countryCode" label={translate('share.countryCode')} sx={{ mb: 1 }}>
              {/* <option value=" " /> */}
              {countryCodeArray.map((option) => (
                <option key={option.id} value={option.arName}>
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

export { ServicesForm };
