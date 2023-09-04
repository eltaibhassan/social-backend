import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Drawer } from '@mui/material';
// hooks
import useResponsive from '../../../hooks/useResponsive';
import useCollapseDrawer from '../../../hooks/useCollapseDrawer';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { NAVBAR } from '../../../config';
// components
import { Logo } from '../../../components/Logo';
import { Scrollbar } from '../../../components/Scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
//
import { Iconify } from '../../../components/share/Iconify';

// import { NavConfig } from './NavConfig';
// import NavbarDocs from './NavbarDocs';
import useLocales from '../../../hooks/useLocales';

// import NavbarAccount from './NavbarAccount';
import CollapseButton from './CollapseButton';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

NavbarVertical.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
};

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }) {
  const { translate } = useLocales();

  const theme = useTheme();

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } =
    useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

  const NavConfig = [
    {
      subheader: translate('control_panel'),
      items: [
        {
          title: translate('advertise.advertise'),
          path: '/dashboard/advertise',
          icon: getIcon('emojione-monotone:newspaper'),
        },
        {
          title: translate('helps_page.events'),
          path: '/dashboard/events',
          icon: getIcon('emojione-monotone:newspaper'),
        },
        {
          title: translate('helps_page.available'),
          path: '/dashboard/available',
          icon: getIcon('emojione-monotone:newspaper'),
        },
        {
          title: translate('helps_page.cars'),
          path: '/dashboard/cars',
          icon: getIcon('emojione-monotone:newspaper'),
        },
        {
          title: translate('missing.missingPerson'),
          path: '/dashboard/missingperson',
          icon: getIcon('emojione-monotone:newspaper'),
        },
        {
          title: translate('missing.missingSomething'),
          path: '/dashboard/missingsomething',
          icon: getIcon('emojione-monotone:newspaper'),
        },
      ],
    },
    {
      subheader: translate('setting'),
      items: [
        {
          title: translate('setting'),
          path: 'dashboard/setting',
          icon: getIcon('icon-park-twotone:setting-two'),
          children: [
            { title: translate('set_voteing'), path: '/dashboard/setting/setting' },
            { title: translate('category'), path: '/dashboard/setting/category' },
          ],
        },
      ],
    },
  ];
  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 2,
          pb: 0,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' }),
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo />

          {isDesktop && !isCollapse && (
            <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />
          )}
        </Stack>

        {/* <NavbarAccount isCollapse={isCollapse} /> */}
      </Stack>

      <NavSectionVertical navConfig={NavConfig} isCollapse={isCollapse} />

      <Box sx={{ flexGrow: 1 }} />

      {/* {!isCollapse && <NavbarDocs />} */}
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: 'absolute',
        }),
      }}
    >
      {!isDesktop && (
        <Drawer open={isOpenSidebar} onClose={onCloseSidebar} PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
