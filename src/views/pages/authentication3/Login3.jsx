import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
// material-ui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper1 from '../AuthWrapper1';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '../authentication/auth-forms/AuthLogin';
import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { useEffect } from 'react';
import { ConfigRouter } from 'routes/ConfigRouter';
import { useSelector } from 'react-redux';
import { getCookie } from 'utils/helper';

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
      const token = getCookie('AUTH');
    if (token) {
      var decodedToken = jwtDecode(token);
      var dateNow = new Date();
      if (decodedToken.exp < dateNow.getTime()) {
        navigate(ConfigRouter.aprrovalPage.url);
      }
    }
  }, []);
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item sx={{ mb: 3 }}>
                    <Logo />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction={{ xs: 'column-reverse', md: 'row' }} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography gutterBottom variant={downMD ? 'h5' : 'h4'}>
                            Hi, Welcome Back
                          </Typography>
                          <Typography variant="caption" fontSize="14px" textAlign={{ xs: 'center', md: 'inherit' }}>
                            Enter your credentials to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin />
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
