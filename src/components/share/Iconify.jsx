import { Icon } from '@iconify/react';
import { Box } from '@mui/material';

const Iconify = ({ icon, sx, ...other }) => <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;

export { Iconify };
