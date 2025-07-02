import App from '~/App.jsx';
import theme from '~/theme.js';
import CssBaseline from '@mui/material/CssBaseline';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify';
import { ConfirmProvider } from 'material-ui-confirm';
import { Provider } from 'react-redux';
import { store } from '~/redux/store';
import { BrowserRouter } from 'react-router-dom';

// Importing Redux persistence
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
const persistor = persistStore(store);

// Injecting the Redux store into the axios instance
import { injectStore } from '~/utils/authorizeAxios';
injectStore(store);

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/">
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ConfirmProvider
            defaultOptions={{
              allowClose: false,
              dialogProps: { maxWidth: 'xs' },
              cancellationButtonProps: { color: 'inherit' },
              confirmationButtonProps: {
                color: 'success',
                variant: 'outlined',
              },
            }}
          >
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-left" theme="colored" />
          </ConfirmProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);
