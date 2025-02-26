// material-ui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="center">
        <Typography variant="subtitle2" color={'#a1a1a1'}>
            &copy; {new Date().getFullYear()} Ha Noi Seowonintech - {import.meta.env.VITE_APP_VERSION}
        </Typography>
    </Stack>
);

export default AuthFooter;
