import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Alert, Snackbar, TextField } from '@mui/material';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { useNavigate } from 'react-router-dom';
import { SET_DATA_USER, SET_TOKEN } from 'store/authAction';
import { ConfigRouter } from 'routes/ConfigRouter';
import { setCookie } from 'utils/helper';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = ({ ...others }) => {
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
    const auth = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [snackBar, setSnackBar] = useState({
        open: false,
        message: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleFormSubmit = async (values, { setSubmitting }) => {
        const response = await restApi.post(RouterApi.login, values);
        setSubmitting(false); // Ngừng trạng thái submitting sau khi xử lý xong
        if (response?.status === 200) {
            const { token, user } = response.data.data;
            setCookie('AUTH', token, 1);
            dispatch({ type: SET_DATA_USER, dataUser: user });
            location.href = ConfigRouter.homePage;
            // navigate(ConfigRouter.homePage);

        } else {
            setSnackBar({ open: true, message: response?.data?.message || 'Check your Username or Password!' });
        }
    };
    return (
        <>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                    submit: null
                }}
                onSubmit={handleFormSubmit}
                validationSchema={Yup.object().shape({
                    username: Yup.string().max(255).required('Username is required'),
                    password: Yup.string().max(255).required('Password is required')
                })}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        {/* <FormControl
                            size="small"
                            fullWidth
                            error={Boolean(touched.username && errors.username)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-username-login">Username</InputLabel> */}
                        <TextField
                            fullWidth
                            error={touched.username && errors.username}
                            autoFocus
                            id="outlined-adornment-username-login"
                            value={values.username}
                            name="username"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            size="small"
                            label="User name"
                            helperText={errors.username}
                        />
                        <FormControl size="small" fullWidth error={Boolean(touched.password && errors.password)} sx={{ marginTop: '20px' }}>
                            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                size="small"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    Login
                                </Button>
                            </AnimateButton>
                        </Box>
                    </form>
                )}
            </Formik>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackBar?.open}
                onClose={() => {
                    setSnackBar({ open: false, message: '', type: snackBar?.type });
                }}
            >
                <Alert
                    onClose={() => {
                        setSnackBar({ open: false, message: '', type: snackBar?.type });
                    }}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackBar?.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default AuthLogin;
