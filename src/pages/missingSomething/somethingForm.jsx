import React, { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Alert, Card, Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import PhoneInput from 'react-phone-input-2';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { FormProvider, RHFTextField, RHFSelect, RHFUploadAvatar } from '../../components/hook-form';
import { AddHelpAPI, UpdateHelpAPI } from '../../api/helpsAPI';
import { getMissingPurposesAPI } from '../../api/purpose';
import { usePurposeState, usePurposeDispatch } from '../../context/purposeContext';
import { PURPOSE_FETCHING, PURPOSE_SUCCESS, PURPOSE_FAILED } from '../../context/type';

const MissingForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const purposeDispatch = usePurposeDispatch();
  const purposeState = usePurposeState();
  const [phoneKey, setPhoneKey] = useState('+249');
  const locPurpose = 'qDhEla3LX7PaDDfmrH4W';

  const ItemSchema = Yup.object().shape({
    featureImage: Yup.mixed(), // .test('required', 'Avatar is required', (value) => value !== ''),
    title: Yup.string(),
    purpose: Yup.string().required(translate('validation.catArTitle')),
    helpType: Yup.string(),
    cityid: Yup.string(),
    areaid: Yup.string(),
    carNo: Yup.string(),
    shasNo: Yup.string(),
    address: Yup.string(),
    description: Yup.string(),
    latitude: Yup.number(),
    longitude: Yup.number(),
    isFeatured: Yup.bool(),
    youCanPay: Yup.bool(),
    accompanyingName: Yup.string(),
    accompanyingMobile: Yup.string().required(translate('validation.catArTitle')),
    helpStatus: Yup.string(),
    favoriteList: Yup.array(),
    mobile: Yup.string(),
    status: Yup.string(),
    createdName: Yup.string(),
    createdBy: Yup.string(),
    createdAt: Yup.number(),
  });

  const defaultValues = {
    id: recordForEdit?.id || 'Nil',
    featureImage: recordForEdit?.featureImage || 'Nil',
    title: recordForEdit?.title || '',
    purpose: locPurpose,
    helpType: 'Nil',
    cityid: 'Nil',
    areaid: 'Nil',
    carNo: Math.random(),
    shasNo: 'Nil',
    address: recordForEdit?.address || '',
    description: recordForEdit?.description || '',
    latitude: 1.1,
    longitude: 1.1,
    isFeatured: true,
    youCanPay: true,
    accompanyingName: recordForEdit?.accompanyingName || '',
    accompanyingMobile: recordForEdit?.accompanyingMobile || '',
    helpStatus: recordForEdit?.helpStatus || 'Pending',
    favoriteList: recordForEdit?.favoriteList || [],
    mobile: recordForEdit?.mobile || 0,
    status: recordForEdit?.status || 'Requesting',
    createdName: recordForEdit?.createdName || '',
    createdBy: recordForEdit?.createdBy || '',
    createdAt: recordForEdit?.createdAt || new Date().getTime(),
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
      let accompanyingMobile = `${phoneKey}${data.accompanyingMobile}`;
      const firstChar = data.accompanyingMobile.substring(0, 1);
      if (data.accompanyingMobile.length === 10 && firstChar === '0') {
        accompanyingMobile = `${phoneKey}${data.accompanyingMobile.substring(1)}`;
      }
      const description = `${data.description}
       Tel: ${accompanyingMobile}`;

      const newItem = {
        id: data.id,
        featureImage: data.featureImage,
        title: description,
        purpose: data.purpose,
        helpType: data.helpType,
        cityid: data.cityid,
        areaid: data.areaid,
        carNo: data.carNo,
        shasNo: data.shasNo,
        address: data.address,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        isFeatured: data.isFeatured,
        youCanPay: data.youCanPay,
        accompanyingName: data.accompanyingName,
        accompanyingMobile,
        helpStatus: data.helpStatus,
        favoriteList: data.favoriteList,
        mobile: accompanyingMobile,
        status: data.status,
        createdName: data.createdName,
        createdBy: data.createdBy,
        createdAt: data.createdAt,
      };

      if (newItem.id === 'Nil') {
        await AddHelpAPI(newItem);
      } else {
        UpdateHelpAPI(newItem);
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

  useEffect(() => {
    const FetchData = async () => {
      try {
        purposeDispatch({ type: PURPOSE_FETCHING });
        const result = await getMissingPurposesAPI();
        purposeDispatch({ type: PURPOSE_SUCCESS, payload: result });
      } catch (e) {
        purposeDispatch({ type: PURPOSE_FAILED });
      }
    };
    FetchData();
  }, [purposeDispatch]);

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
            {/* <RHFSelect name="purpose" label={translate('helps_page.purpose')} sx={{ mb: 1 }}>
              {purposeState.purposes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect> */}
            {/* <RHFSelect name="purpose" label={translate('helps_page.purpose')} sx={{ mb: 1 }}>
              {purposeList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </RHFSelect> */}

            <RHFTextField name="address" size="small" label={translate('helps_page.address')} sx={{ pb: 1 }} />
            <RHFTextField name="description" size="small" label={translate('helps_page.description')} sx={{ pb: 1 }} />
            <RHFTextField
              name="accompanyingName"
              size="small"
              label={translate('helps_page.accompanyingName')}
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
              <RHFTextField
                name="accompanyingMobile"
                size="small"
                label={translate('helps_page.accompanyingMobile')}
                sx={{ pb: 1 }}
              />
              <PhoneInput
                sx={{ width: 20, height: 20, color: 'green', mr: 1 }}
                onlyCountries={['sd', 'sa', 'ae', 'qa', 'kw', 'om', 'bh', 'eg', 'us', 'gb']}
                country={'sd'}
                enableSearch="true"
                value={phoneKey}
                onChange={(code) => setPhoneKey(code)}
              />
            </Box>
            {/* <RHFTextField
              name="accompanyingMobile"
              size="small"
              label={translate('helps_page.accompanyingMobile')}
              sx={{ pb: 1 }}
            /> */}
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

export { MissingForm };
