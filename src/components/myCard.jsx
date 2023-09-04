import { Grid, Paper, Typography } from '@mui/material';

const MyCard = ({ name }) => {
  return (
    <Grid item xs={6}>
      <Paper variant="outlined" sx={{ py: 2.5, textAlign: 'center', width: 40 }}>
        {/* <Box sx={{ mb: 0.5 }}>{icon}</Box> */}
        {/* <Typography variant="h6">{fShortenNumber(value)}</Typography> */}
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {name}
        </Typography>
      </Paper>
    </Grid>
  );
};
export { MyCard };
