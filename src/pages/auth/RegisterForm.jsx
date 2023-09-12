import { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../../hooks/useAuth';
import useLocales from '../../hooks/useLocales';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { Iconify } from '../../components/share';
import { FormProvider, RHFTextField } from '../../components/hook-form';

const RegisterForm = () => {
  const { translate } = useLocales();
  const { register } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    fullName: Yup.string().required('First name required'),
    phoneNo: Yup.string(),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    img: Yup.string(),
    token: Yup.string(),
    notification: Yup.string(),
    userType: Yup.string(),
  });

  const defaultValues = {
    fullName: '',
    phoneNo: '',
    email: '',
    password: '',
    img: '',
    token: '',
    notification: '',
    userType: 'Editor',
    createdAt: new Date().getTime(),
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
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
      const newItme = {
        fullName: data.fullName,
        phoneNo: data.phoneNo,
        email: data.email,
        password: data.password,
        img: data.img,
        token: data.token,
        notification: data.notification,
        userType: data.userType,
        createdAt: data.createdAt,
      };
      await register(newItme);
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
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="fullName" label={translate('users.fullName')} />
        </Stack>

        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="enName" label={translate('users.fullName')} />
        </Stack> */}

        {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="userType" label="User Role" />
        </Stack> */}
        <RHFTextField name="email" label={translate('users.email')} />
        <RHFTextField
          name="password"
          label={translate('users.password')}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          {translate('theme.register')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
};

export { RegisterForm };
