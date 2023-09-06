import Router from './routes/routes';
import ThemeProvider from './theme';
import { ScrollToTop } from './components/ScrollToTop';
import RtlLayout from './components/RtlLayout';
import ThemeLocalization from './components/ThemeLocalization';
import NotistackProvider from './components/NotistackProvider';
import MotionLazyContainer from './components/animate/MotionLazyContainer';

import {
  AdvertiseProvider,
  UsersProvider,
  AssociationsProvider,
  EventsProvider,
  NewsProvider,
  NewsCatsProvider,
  ProductsProvider,
  ProCatsProvider,
} from './context';

export default function App() {
  return (
    <ThemeProvider>
      <ThemeLocalization>
        <RtlLayout>
          <NotistackProvider>
            <MotionLazyContainer>
              <AdvertiseProvider>
                <UsersProvider>
                  <AssociationsProvider>
                    <EventsProvider>
                      <NewsProvider>
                        <NewsCatsProvider>
                          <ProductsProvider>
                            <ProCatsProvider>
                              <ScrollToTop />
                              <Router />
                            </ProCatsProvider>
                          </ProductsProvider>
                        </NewsCatsProvider>
                      </NewsProvider>
                    </EventsProvider>
                  </AssociationsProvider>
                </UsersProvider>
              </AdvertiseProvider>
            </MotionLazyContainer>
          </NotistackProvider>
        </RtlLayout>
      </ThemeLocalization>
    </ThemeProvider>
  );
}