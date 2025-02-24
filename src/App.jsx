import { useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import './app.css';
// routing
import router from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
// or for dayjs
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import 'react-photo-view/dist/react-photo-view.css';
import { useEffect } from 'react';
// ==============================|| APP ||============================== //

const App = () => {
  const customization = useSelector((state) => state.customization);

  // Disable React Developer Tools in production
  useEffect(() => {
    if (import.meta.env.VITE_APP_PRO) {
      if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined') {
        window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {};
      }
    }
  }, []);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <CssBaseline />
          <NavigationScroll>
            <RouterProvider router={router} />
          </NavigationScroll>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
