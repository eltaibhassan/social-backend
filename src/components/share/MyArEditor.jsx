import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MyArEditor = (props) => {
  const { values, setValues } = props;
  // values={values} setValues={setValues}

  const onChange = (disc) => {
    setValues({ ...values, arDescription: disc });
  };

  return <ReactQuill theme="snow" value={values.arDescription} onChange={onChange} />;
};
export { MyArEditor };
