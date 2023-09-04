import React from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Alert, Card, Box, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { FormProvider, RHFTextField } from '../../components/hook-form';
import { AddCategoryAPI, UpdateCategoryAPI } from '../../api/categoriesAPI';

const CandidateForm = ({ recordForEdit, AfterAddOrEdit }) => {
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const isMountedRef = useIsMountedRef();

  const ItemSchema = Yup.object().shape({
    catArTitle: Yup.string().required(translate('validation.catArTitle')),
    catEnTitle: Yup.number().required(translate('validation.catEnTitle')),
    catStId: Yup.string().required(translate('validation.catStId')),
    catVoteCount: Yup.string().required(translate('validation.catVoteCount')),
  });

  const defaultValues = {
    id: recordForEdit?.id || 0,
    catArTitle: recordForEdit?.catArTitle || '',
    catEnTitle: recordForEdit?.catEnTitle || '',
    catStId: recordForEdit?.catStId || '',
    catVoteCount: recordForEdit?.catVoteCount || '',
  };

  const methods = useForm({
    resolver: yupResolver(ItemSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const newItem = {
        id: data.id,
        catArTitle: data.catArTitle,
        catEnTitle: data.catEnTitle,
        catStId: data.catStId,
        catVoteCount: data.catVoteCount,
      };
      if (recordForEdit === null) {
        await AddCategoryAPI(newItem);
      } else {
        UpdateCategoryAPI(newItem);
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
            <RHFTextField name="catArTitle" size="small" label={translate('catArTitle')} sx={{ pb: 1 }} />
            <RHFTextField name="catEnTitle" size="small" label={translate('catEnTitle')} sx={{ pb: 1 }} />
            <RHFTextField name="catStId" size="small" label={translate('catStId')} rows={2} sx={{ pb: 1 }} />
            <RHFTextField name="catVoteCount" size="small" label={translate('catVoteCount')} rows={2} sx={{ pb: 1 }} />
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

export { CandidateForm };
