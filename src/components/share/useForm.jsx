import React, { useState } from 'react';

const useForm = (initialFValues, validate) => {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});
  const { file, setFile } = useState('');
  const [featureImage, setFeatureImage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    validate({ [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setValues({
      ...values,
      [name]: e.target.files[0],
    });
    setFeatureImage(e.target.files[0]);
  };

  const handleMultiFile = (e) => {
    const { name } = e.target;
    setValues({
      ...values,
      [name]: e.target.files,
    });
    setFeatureImage(e.target.files);
  };

  const resetForm = () => {
    setValues(initialFValues);
    setErrors({});
  };

  return {
    featureImage,
    file,
    setFile,
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    handleFileChange,
    handleMultiFile,
    resetForm,
  };
};

const MyForm = (props) => {
  const { children, ...other } = props;
  return (
    <form autoComplete="off" {...other}>
      {children}
    </form>
  );
};

export { useForm, MyForm };
