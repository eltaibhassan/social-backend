import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography } from '@mui/material';
import useLocales from '../../hooks/useLocales';
import useResponsive from '../../hooks/useResponsive';
import { PATH_AUTH } from '../../routes/paths';
import { Page } from '../../components/Page';
import { Logo } from '../../components/Logo';
import Image from '../../components/Image';
import { RegisterForm } from './RegisterForm';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

export default function Register() {
  const { translate } = useLocales();
  const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');

  return (
    <Page title="Register">
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              {translate('theme.already_have_an_account')}{' '}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
                {translate('theme.login')}
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              {translate('theme.manage_the_work_more_effectively_with_MMS')}
            </Typography>
            <Image
              visibleByDefault
              disabledEffect
              alt="register"
              src="/static/illustrations/illustration_register.png"
            />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {translate('theme.register_user')}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>{translate('theme.enter_your_details_below')}</Typography>
              </Box>
            </Box>

            <RegisterForm />

            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              {translate('theme.by_registering')}&nbsp;&nbsp;
              <Link underline="always" color="text.primary" href="#">
                {translate('theme.terms_of_service')}&nbsp;
              </Link>
              {translate('theme.and')}&nbsp;
              <Link underline="always" color="text.primary" href="#">
                {translate('theme.privacy_policy')}
              </Link>
              .
            </Typography>

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
                {translate('theme.already_have_an_account')}
                <Link variant="subtitle2" to={PATH_AUTH.login} component={RouterLink}>
                  Login
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
