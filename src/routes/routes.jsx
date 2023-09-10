import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import { PATH_AFTER_LOGIN } from '../config';
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return (
    <Routes>
      <Route path="auth">
        <Route
          path="login"
          element={
            <GuestGuard>
              <Login />
            </GuestGuard>
          }
        />
      </Route>
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
        }
      >
        <Route element={<Navigate to={PATH_AFTER_LOGIN} replace />} />
        <Route path="advertise" element={<Advertise />} />
        <Route path="events" element={<Events />} />
        <Route path="news" element={<News />} />
        <Route path="services" element={<Services />} />
        <Route path="associations" element={<Associations />} />

        <Route path="setting">
          <Route path="users" element={<Register />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Route>
      <Route path="*" element={<LogoOnlyLayout />}>
        <Route path="404" element={<Page404 />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard/events" replace />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
const Page404 = Loadable(lazy(() => import('../pages/Page404/Page404')));

const Advertise = Loadable(lazy(() => import('../pages/advertise/advertise')));
const Events = Loadable(lazy(() => import('../pages/events/events')));
const News = Loadable(lazy(() => import('../pages/news/news')));
const Associations = Loadable(lazy(() => import('../pages/associations/associations')));
const Services = Loadable(lazy(() => import('../pages/services/services')));
