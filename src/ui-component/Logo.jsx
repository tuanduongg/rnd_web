// material-ui
// import { useTheme } from '@mui/material/styles';

import LOGO from 'assets/images/logos/favilogo.png';
import { Box, Typography } from '@mui/material';
/**Flex
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    // const theme = useTheme();

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img src={LOGO} alt="LOGO" height={25} />
                <Typography variant="h4" color={'primary'} ml={2} component="h4">
                    HANOI SEOWONINTECH
                </Typography>
            </Box>
        </>
    );
};

export default Logo;
