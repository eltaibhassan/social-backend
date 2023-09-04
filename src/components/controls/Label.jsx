import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
}));
const MyLabel = (props) => <LabelStyle>{props.label}</LabelStyle>;
// <InputLabel sx={{ paddingBottom: '10px', paddingTop: '10px', fontSize: '18px', fontWeight: 'bold' }}>
//   {props.label}
// </InputLabel>

export { MyLabel };
