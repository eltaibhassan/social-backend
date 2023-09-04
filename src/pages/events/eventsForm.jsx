import React, { useState, useCallback, useEffect } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Alert, Card, Box, Grid, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { FormProvider, RHFTextField, RHFUploadAvatar, RHFSelect } from '../../components/hook-form';
import { InsertEventAPI, UpdateEventAPI } from '../../api';

const EventsForm = ({ recordForEdit }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const [phoneKey, setPhoneKey] = useState('+249');
  const locPurpose = 'sVfnoGyFShDF0o4HrHTt';

  const ItemSchema = Yup.object().shape({
    featureImage: Yup.mixed(),
    title: Yup.string(),
    purpose: Yup.string(),
    helpType: Yup.string(),
    cityid: Yup.string(),
    areaid: Yup.string(),
    carNo: Yup.string().required('ادخل رقم مركبة صحيح'),
    shasNo: Yup.string(),
    address: Yup.string(),
    description: Yup.string(),
    latitude: Yup.number(),
    longitude: Yup.number(),
    isFeatured: Yup.bool(),
    youCanPay: Yup.bool(),
    accompanyingName: Yup.string(),
    accompanyingMobile: Yup.string().required(translate('plase_insert_mobile_no')),
    createdAt: Yup.number(),
    createdBy: Yup.string(),
    favoriteList: Yup.array(),
    mobile: Yup.string(),
    createdName: Yup.string(),
    status: Yup.string(),
    helpStatus: Yup.string(),
  });

  const defaultValues = {
    id: recordForEdit?.id || 'Nil',
    featureImage: recordForEdit?.featureImage || 'Nil',
    title: recordForEdit?.title || '',
    purpose: locPurpose,
    helpType: recordForEdit?.helpType || 'Nil',
    cityid: recordForEdit?.cityid || 'Nil',
    areaid: recordForEdit?.areaid || 'Nil',
    carNo: recordForEdit?.carNo || 0,
    shasNo: recordForEdit?.shasNo || '',
    address: recordForEdit?.address || '',
    description: recordForEdit?.description || '',
    latitude: 1.1,
    longitude: 1.1,
    isFeatured: true,
    youCanPay: true,
    accompanyingName: recordForEdit?.accompanyingName || '',
    accompanyingMobile: recordForEdit?.accompanyingMobile || '',
    createdAt: recordForEdit?.createdAt || new Date().getTime(),
    createdBy: recordForEdit?.createdBy || '',
    favoriteList: recordForEdit?.favoriteList || [],
    mobile: recordForEdit?.mobile || 0,
    createdName: recordForEdit?.createdName || '',
    status: recordForEdit?.status || 'Requesting',
    helpStatus: recordForEdit?.helpStatus || 'Pending',
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

      let initTitle = '';
      if (recordForEdit === null) {
        initTitle = `تم سرقم سيارة ${data.description} من ${data.address} بالرقم ${data.carNo} 
       Tel:${accompanyingMobile}`;
      } else {
        initTitle = data.title;
      }

      const newItme = {
        id: data.id,
        featureImage: data.featureImage,
        title: initTitle,
        arrTitle: initTitle.split(' '),
        purpose: data.purpose,
        helpType: data.helpType,
        cityid: data.cityid,
        areaid: data.areaid,
        carNo: `${data.carNo}`,
        carNoLetter: data.carNoLetter,
        shasNo: data.shasNo,
        address: data.address,
        description: data.description,
        latitude: data.latitude,
        longitude: data.longitude,
        isFeatured: data.isFeatured,
        youCanPay: data.youCanPay,
        accompanyingName: data.accompanyingName,
        accompanyingMobile,
        ccPhoneNo: phoneKey,
        createdAt: new Date().getTime(),
        createdBy: data.createdBy,
        favoriteList: data.favoriteList,
        mobile: accompanyingMobile,
        createdName: data.createdName,
        status: data.status,
        helpStatus: data.helpStatus,
      };
      if (recordForEdit === null) {
        InsertEventAPI(newItme);
      } else {
        UpdateEventAPI(newItme);
      }
      reset();
      // AfterAddOrEdit();
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
            {/* <RHFSelect name="purpose" label={translate('helps_page.purpose')} sx={{ mb: 1 }}>
              {purposeState.purposes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect> */}
            {/* <RHFSelect name="helpType" label={translate('helps_page.helpType')} sx={{ mb: 1 }}>
              {helpTypeState.helpTypes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect> */}
            {/* <RHFTextField name="needName" size="small" label="اسم الدواء او التخصص او الجهاز" sx={{ pb: 1 }} /> */}
            {/* <RHFSelect name="areaid" label={translate('helps_page.areaid')} sx={{ mb: 1 }}>
              {localityState.localities.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect> */}
            {/* <Box
              sx={{
                display: 'grid',
                columnGap: 3,
                rowGap: 0,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                // pb: 1,
              }}
            >
              <RHFSelect name="carNoLetter" label={translate('helps_page.carNoLetter')} sx={{ mb: 1 }}>
                {carLetterState.carLetters.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="carNo" size="small" label={translate('helps_page.carNo')} sx={{ pb: 1 }} />{' '}
            </Box> */}

            <RHFTextField name="shasNo" size="small" label={translate('helps_page.shasNo')} sx={{ pb: 1 }} />
            <RHFTextField name="description" size="small" label={translate('helps_page.description')} sx={{ pb: 1 }} />
            <RHFTextField name="address" size="small" label={translate('helps_page.address')} sx={{ pb: 1 }} />
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
      {/* <LocalitySelector
              onSelectLocality={onSelectLocality}
              selectedValue={selectedLocality}
              stateId={selectedState}
            /> */}
      {/* <RHFSelect name="cityid" label={translate('helps_page.cityid')}>
              {stateState.states.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect> */}
      {/* <PurposeSelector onSelectPurpose={handlePurposeChange} selectedValue={selectedPurpose} /> */}
      {/* <CarLetterSelector onSelectCarLetter={onSelectCarLetter} selectedValue={selectedCarLetter} /> */}
    </FormProvider>
  );
};

export { EventsForm };
