// scroll bar
import './locales/i18n';

// editor
import 'react-quill/dist/quill.snow.css';
// highlight => working for quill
import './utils/highlight';

import 'simplebar/src/simplebar.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import { CollapseDrawerProvider } from './context/CollapseDrawerContext';
import { AuthProvider } from './context/FirebaseContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <AuthProvider>
    <HelmetProvider>
      <SettingsProvider>
        <CollapseDrawerProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </CollapseDrawerProvider>
      </SettingsProvider>
    </HelmetProvider>
  </AuthProvider>
);
