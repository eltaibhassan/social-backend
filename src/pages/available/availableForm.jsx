import React, { useEffect, useState, useCallback } from 'react';
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
import { FormProvider, RHFTextField, RHFSelect, RHFUploadAvatar } from '../../components/hook-form';
import { AddHelpAPI, UpdateHelpAPI } from '../../api/helpsAPI';
import { StatesSelector } from './states_Selector';
import {
  HELPS_TYPE_FETCHING,
  HELPS_TYPE_SUCCESS,
  HELPS_TYPE_FAILED,
  LOCALITY_FETCHING,
  LOCALITY_SUCCESS,
  LOCALITY_FAILED,
  PURPOSE_FETCHING,
  PURPOSE_SUCCESS,
  PURPOSE_FAILED,
} from '../../context/type';
import { getHelpTypesAPI } from '../../api/helpTypesAPI';
import { useHelpTypeState, useHelpTypeDispatch } from '../../context/helpTypesContext';
import { getLocalitiesAPI } from '../../api/localitiesAPI';
import { getPurposesAPI } from '../../api/purpose';

import { useLocalityState, useLocalityDispatch } from '../../context/localitiesContext';
import { usePurposeState, usePurposeDispatch } from '../../context/purposeContext';

const HelpForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();
  const [selectedState, setSelectedState] = useState(recordForEdit?.cityid || '');
  const helpTypeDispatch = useHelpTypeDispatch();
  const helpTypeState = useHelpTypeState();
  const localityDispatch = useLocalityDispatch();
  const localityState = useLocalityState();
  const purposeDispatch = usePurposeDispatch();
  const purposeState = usePurposeState();
  const [phoneKey, setPhoneKey] = useState('+249');
  const locPurpose = 'OdOxXEoLoB0CIHJu9Wog';

  const ItemSchema = Yup.object().shape({
    featureImage: Yup.mixed(),
    title: Yup.string(),
    purpose: Yup.string().required(translate('validation.catArTitle')),
    helpType: Yup.string().required(translate('validation.catArTitle')),
    needName: Yup.string(),
    cityid: Yup.string().required(translate('validation.catArTitle')),
    areaid: Yup.string().required(translate('validation.catArTitle')),
    carNo: Yup.string(),
    shasNo: Yup.string(),
    address: Yup.string(),
    description: Yup.string(),
    latitude: Yup.number(),
    longitude: Yup.number(),
    isFeatured: Yup.bool(),
    youCanPay: Yup.bool(),
    accompanyingName: Yup.string(),
    accompanyingMobile: Yup.string().required(translate('plase_insert_mobile_no')),
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
    helpType: recordForEdit?.helpType || '',
    needName: recordForEdit?.needName || '',
    cityid: recordForEdit?.cityid || '',
    areaid: recordForEdit?.areaid || '',
    carNo: recordForEdit?.carNo || '',
    shasNo: recordForEdit?.shasNo || '',
    address: recordForEdit?.address || '',
    description: recordForEdit?.description || '',
    latitude: recordForEdit?.latitude || 1.1,
    longitude: recordForEdit?.longitude || 1.1,
    isFeatured: recordForEdit?.isFeatured || false,
    youCanPay: recordForEdit?.youCanPay || true,
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
      const helpTypeItem = helpTypeState.helpTypes.find((item) => item.id === data.helpType);
      const helpType = helpTypeItem.arName;

      const purposeItems = purposeState.purposes.find((item) => item.id === data.purpose);
      const purposeItem = purposeItems.arName;

      let accompanyingMobile = `${phoneKey}${data.accompanyingMobile}`;
      const firstChar = data.accompanyingMobile.substring(0, 1);
      if (data.accompanyingMobile.length === 10 && firstChar === '0') {
        accompanyingMobile = `${phoneKey}${data.accompanyingMobile.substring(1)}`;
      }

      const title = `${purposeItem} ل${helpType} ${data.needName} بمنطقة ${data.address}
       Tel: ${accompanyingMobile}`;

      if (data.id === 'Nil') {
        await AddHelpAPI({
          id: data.id,
          featureImage: data.featureImage,
          title,
          purpose: data.purpose,
          helpType: data.helpType,
          cityid: selectedState,
          areaid: data.areaid,
          carNo: '',
          shasNo: '',
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
          createdAt: new Date().getTime(),
        });
      } else {
        UpdateHelpAPI({
          id: data.id,
          featureImage: data.featureImage,
          title,
          purpose: data.purpose,
          helpType: data.helpType,
          cityid: selectedState,
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
        });
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

  const onSelectState = (val) => {
    setSelectedState(val);
    setValue('cityid', val);
  };

  useEffect(() => {
    const FetchData = async () => {
      try {
        purposeDispatch({ type: PURPOSE_FETCHING });
        const result = await getPurposesAPI();
        purposeDispatch({ type: PURPOSE_SUCCESS, payload: result });
      } catch (e) {
        purposeDispatch({ type: PURPOSE_FAILED });
      }
    };
    FetchData();
  }, [purposeDispatch]);

  useEffect(() => {
    const FetchData = async () => {
      try {
        helpTypeDispatch({ type: HELPS_TYPE_FETCHING });
        const result = await getHelpTypesAPI();
        helpTypeDispatch({ type: HELPS_TYPE_SUCCESS, payload: result });
      } catch (e) {
        helpTypeDispatch({ type: HELPS_TYPE_FAILED });
      }
    };
    FetchData();
  }, [helpTypeDispatch]);

  useEffect(() => {
    const FetchData = async () => {
      try {
        localityDispatch({ type: LOCALITY_FETCHING });
        if (selectedState !== '') {
          const result = await getLocalitiesAPI(selectedState);
          localityDispatch({ type: LOCALITY_SUCCESS, payload: result });
        } else {
          const result = [];
          localityDispatch({ type: LOCALITY_SUCCESS, payload: result });
        }
      } catch (e) {
        localityDispatch({ type: LOCALITY_FAILED });
      }
    };
    FetchData();
  }, [localityDispatch, selectedState]);

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
            <RHFSelect name="helpType" label={translate('helps_page.helpType')} sx={{ mb: 1 }}>
              {helpTypeState.helpTypes.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect>
            <RHFTextField name="needName" size="small" label="اسم الدواء او التخصص او الجهاز" sx={{ pb: 1 }} />
            <StatesSelector onSelectState={onSelectState} selectedValue={selectedState} />
            <RHFSelect name="areaid" label={translate('helps_page.areaid')} sx={{ mb: 1 }}>
              {localityState.localities.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.arName}
                </option>
              ))}
            </RHFSelect>
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
      {/* <HelpTypeSelector onSelectHelpType={onSelectHelpType} selectedValue={selectedHelpType} /> */}
    </FormProvider>
  );
};

export { HelpForm };
