import React, { useState } from 'react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../../hooks/useAuth';
import useIsMountedRef from '../../hooks/useIsMountedRef';
import { Iconify } from '../../components/share';
import { FormProvider, RHFTextField } from '../../components/hook-form';

const options = [
  {
    _id: 'Editor',
    arName: 'editor',
  },
  {
    _id: 'publisher',
    arName: 'Publisher',
  },
  {
    _id: 'Admin',
    arName: 'Admin',
  },
];

const UsersForm = (props) => {
  const { addOrEdit, recordForEdit } = props;

  const { register } = useAuth();
  const isMountedRef = useIsMountedRef();
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    arName: Yup.string().required('First name required'),
    enName: Yup.string().required('enName name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    userType: Yup.string().required('Last name required'),
  });

  const defaultValues = {
    arName: '',
    enName: '',
    email: '',
    password: '',
    userType: '',
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
      await register(data.email, data.password, data.arName, data.enName, data.userType);
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
      <Stack spacing={3} width={700}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="arName" label="Full Arabic Name" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="enName" label="Full English Name" />
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="userType" label="User Role" />
        </Stack>

        <RHFTextField name="email" label="Email address" />
        <RHFTextField
          name="password"
          label="Password"
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
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
    // <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    //   <Grid container sx={{ maxWidth: '700px' }}>
    //     <Grid item xs={12}>
    //       <MyInput
    //         name="arName"
    //         label="arName"
    //         value={values.arName}
    //         onChange={handleInputChange}
    //         error={errors.arName}
    //       />
    //       <MyInput
    //         label="enName"
    //         name="enName"
    //         value={values.enName}
    //         onChange={handleInputChange}
    //         error={errors.enName}
    //       />
    //     </Grid>
    //     <Grid item xs={12}>
    //       <MyInput
    //         label="arDescription"
    //         name="arDescription"
    //         value={values.arDescription}
    //         onChange={handleInputChange}
    //         error={errors.arDescription}
    //         rows={2}
    //         multiline
    //       />
    //       <MyInput
    //         label="enDescription"
    //         name="enDescription"
    //         value={values.enDescription}
    //         onChange={handleInputChange}
    //         error={errors.enDescription}
    //         rows={2}
    //         multiline
    //       />

    //       <MyInput label="email" name="email" value={values.email} onChange={handleInputChange} error={errors.email} />

    //       <MySelect
    //         name="userType"
    //         label="userType"
    //         value={values.userType}
    //         options={options}
    //         onChange={(e) => {
    //           setValues({
    //             ...values,
    //             userType: e.target.value,
    //           });
    //         }}
    //       />
    //       <MyInput
    //         label="password"
    //         name="password"
    //         value={values.password}
    //         onChange={handleInputChange}
    //         error={errors.password}
    //       />
    //     </Grid>

    //     <Grid item xs={12}>
    //       <MyButton type="submit" text="Submit" />
    //       <MyButton
    //         text="Reset"
    //         // color="default"
    //         onClick={resetForm}
    //       />
    //     </Grid>
    //   </Grid>
    // </FormProvider>
  );
};
export { UsersForm };
