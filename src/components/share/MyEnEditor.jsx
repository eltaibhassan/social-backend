import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MyEnEditor = (props) => {
  const { values, setValues } = props;
  // values={values} setValues={setValues}
  const onChange = (disc) => {
    setValues({ ...values, enDescription: disc });
  };

  return <ReactQuill theme="snow" value={values.enDescription} onChange={onChange} />;
};
export { MyEnEditor };
