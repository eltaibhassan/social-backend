import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from '@mui/material';

const MyProgress = () => (
  <Grid container justifyContent="center" height="500px" sx={{ alignItems: 'center' }}>
    <CircularProgress />
  </Grid>
);
export { MyProgress };
