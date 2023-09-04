// @mui
import { Box, Typography, Stack } from '@mui/material';
// assets
import { UploadIllustration } from '../../assets';
import useLocales from '../../hooks/useLocales';

// ----------------------------------------------------------------------

export default function BlockContent() {
  const { translate } = useLocales();
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          {translate('information.drop_or_select_file')}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {translate('information.drop_files_here_or_clic')}
          &nbsp;
          <Typography variant="body2" component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
            {translate('information.browse')}
          </Typography>
          &nbsp;{translate('information.thorough_your_machine')}
        </Typography>
      </Box>
    </Stack>
  );
}
