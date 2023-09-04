import { Avatar } from '@mui/material';
import React from 'react';

const MyAvatar = (props) => {
  const { fileurl, url, height, width } = props;
  return (
    <Avatar
      alt="No Image"
      sx={{ height: height || 120, width: width || 120 }}
      src={fileurl ? URL.createObjectURL(fileurl) : `/upload/${url}`}
    />
  );
};
export { MyAvatar };
