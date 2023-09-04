import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Container, Typography } from '@mui/material';
import { PATH_AUTH } from '../../routes/paths';
import useResponsive from '../../hooks/useResponsive';
import { Page } from '../../components/Page';
import { Logo } from '../../components/Logo';
import Image from '../../components/Image';
import useLocales from '../../hooks/useLocales';

// sections
import { LoginForm } from './LoginForm';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

const Login = () => {
  const { translate } = useLocales();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {/* {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              {translate('theme.dont_have_an_account')}&nbsp;&nbsp;
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                {translate('theme.get_started')}
              </Link>
            </Typography>
          )} */}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              {translate('theme.hi_welcome_back')}
            </Typography>
            <Image visibleByDefault disabledEffect alt="login" src="/static/illustrations/illustration_login.png" />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {translate('theme.sign_in_to_mms')}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{translate('theme.enter_your_details_below')}</Typography>
              </Box>
            </Stack>

            <LoginForm />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                {translate('theme.dont_have_an_account')}
                <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                  {translate('theme.get_started')}
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
};

export default Login;
