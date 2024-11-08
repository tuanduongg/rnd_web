import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { SET_BORDER_RADIUS, SET_FONT_FAMILY, SET_OPEN_DRAWE_RIGHT } from 'store/actions';
import { gridSpacing } from 'store/constant';

// assets
import { IconFolderCheck, IconRefresh, IconSettings } from '@tabler/icons-react';
import LinearProgressWithLabel from './component/LinearWithLabel';
import { Box, Stack } from '@mui/material';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { formatBytes, getPercentageStorage } from 'utils/helper';
import Loading from 'ui-component/Loading';
import { IconListCheck } from '@tabler/icons-react';
import toast from 'react-hot-toast';

// concat 'px'
function valueText(value) {
    return `${value}px`;
}
const oneTB = 1099511627776;
// ==============================|| LIVE CUSTOMIZATION ||============================== //

const Customization = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const customization = useSelector((state) => state.customization);

    // drawer on/off
    // const [open, setOpen] = useState(false);
    // const handleToggle = () => {
    //   setOpen(!open);
    // };

    // state - border radius
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState(0);
    const [borderRadius, setBorderRadius] = useState(customization.borderRadius);
    const handleBorderRadius = (event, newValue) => {
        setBorderRadius(newValue);
    };
    const checkFile = async () => {
        setLoading(true);
        const res = await restApi.get(RouterApi.fileReportQCCheckFile);
        setLoading(false);
        if (res?.status === 200) {
            toast.success('Successful!')
        } else {
            toast.error(res?.data?.message || 'You do not have permission to access it!')
        }
    }
    const getStorage = async () => {
        setLoading(true);
        const res = await restApi.get(RouterApi.userGetStorage);
        setLoading(false);
        if (res?.status === 200) {
            setSize(res?.data?.size);
        }
    }
    useEffect(() => {
        getStorage();
    }, [])

    useEffect(() => {
        dispatch({ type: SET_BORDER_RADIUS, borderRadius });
    }, [dispatch, borderRadius]);

    let initialFont;
    switch (customization.fontFamily) {
        case `'Inter', sans-serif`:
            initialFont = 'Inter';
            break;
        case `'Poppins', sans-serif`:
            initialFont = 'Poppins';
            break;
        case `'Roboto', sans-serif`:
        default:
            initialFont = 'Roboto';
            break;
    }

    // state - font family
    const [fontFamily, setFontFamily] = useState(initialFont);
    useEffect(() => {
        let newFont;
        switch (fontFamily) {
            case 'Inter':
                newFont = `'Inter', sans-serif`;
                break;
            case 'Poppins':
                newFont = `'Poppins', sans-serif`;
                break;
            case 'Roboto':
            default:
                newFont = `'Roboto', sans-serif`;
                break;
        }
        dispatch({ type: SET_FONT_FAMILY, fontFamily: newFont });
    }, [dispatch, fontFamily]);

    const handleToggle = () => {
        dispatch({ type: SET_OPEN_DRAWE_RIGHT, openRightDrawer: false });
    };
    const onClickCheckFileExisted = () => {
        // getStorage();
        checkFile()
    };
    const onClickRefresh = () => {
        getStorage();
    };

    return (
        <>
            {/* toggle button */}
            {/* <Tooltip title="Live Customize">
        <Fab
          component="div"
          onClick={handleToggle}
          size="medium"
          variant="circular"
          color="secondary"
          sx={{
            borderRadius: 0,
            borderTopLeftRadius: '50%',
            borderBottomLeftRadius: '50%',
            borderTopRightRadius: '50%',
            borderBottomRightRadius: '4px',
            top: '25%',
            position: 'fixed',
            right: 10,
            zIndex: theme.zIndex.speedDial
          }}
        >
          <AnimateButton type="rotate">
            <IconButton color="inherit" size="large" disableRipple>
              <IconSettings />
            </IconButton>
          </AnimateButton>
        </Fab>
      </Tooltip> */}

            <Drawer
                anchor="right"
                onClose={handleToggle}
                open={customization?.openRightDrawer}
                PaperProps={{
                    sx: {
                        width: 280
                    }
                }}
            >
                <PerfectScrollbar component="div">
                    <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
                        <Grid item xs={12}>
                            {/* font family */}
                            <SubCard title="Font">
                                <FormControl>
                                    <RadioGroup
                                        aria-label="font-family"
                                        value={fontFamily}
                                        onChange={(e) => setFontFamily(e.target.value)}
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel
                                            value="Roboto"
                                            control={<Radio />}
                                            label="Roboto"
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 28 },
                                                '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                                            }}
                                        />
                                        <FormControlLabel
                                            value="Poppins"
                                            control={<Radio />}
                                            label="Poppins"
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 28 },
                                                '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                                            }}
                                        />
                                        <FormControlLabel
                                            value="Inter"
                                            control={<Radio />}
                                            label="Inter"
                                            sx={{
                                                '& .MuiSvgIcon-root': { fontSize: 28 },
                                                '& .MuiFormControlLabel-label': { color: theme.palette.grey[900] }
                                            }}
                                        />
                                    </RadioGroup>
                                </FormControl>
                            </SubCard>
                        </Grid>
                        <Grid item xs={12}>
                            {/* border radius */}
                            <SubCard title='Border'>
                                <Grid item xs={12} container spacing={2} alignItems="center" sx={{ mt: 2.5 }}>
                                    <Grid item>
                                        <Typography variant="h6" color="primary">
                                            4px
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <Slider
                                            size="small"
                                            value={borderRadius}
                                            onChange={handleBorderRadius}
                                            getAriaValueText={valueText}
                                            valueLabelDisplay="on"
                                            aria-labelledby="discrete-slider-small-steps"
                                            marks
                                            step={2}
                                            min={4}
                                            max={24}
                                            color="primary"
                                            sx={{
                                                '& .MuiSlider-valueLabel': {
                                                    color: 'secondary.light'
                                                }
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="h6" color="primary">
                                            24px
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                        <Grid item xs={12}>
                            {/* border radius */}
                            <SubCard title={<Stack direction={'row'} alignItems={'center'}>
                                Your storage
                                <Tooltip title="Refresh">
                                    <IconButton onClick={onClickRefresh} size='small' color='primary'>
                                        <IconRefresh />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Check for files that do not exist in the directory">
                                    <IconButton onClick={onClickCheckFileExisted} size='small' color='primary'>
                                        <IconFolderCheck />
                                    </IconButton>
                                </Tooltip>
                            </Stack>}>
                                <Grid item xs={12} container spacing={2} alignItems="center" >
                                    <Typography ml={2} pt={1} pb={1} variant='h6' component={'h6'}>{formatBytes(size)} of {formatBytes(oneTB)} are used</Typography>
                                </Grid>
                                <Grid item xs={12} container spacing={2} alignItems="center" >
                                    <Grid item xs>
                                        <LinearProgressWithLabel sx={{ height: '20px', borderRadius: `${customization.borderRadius}px` }} color={getPercentageStorage(size ,oneTB)  >= 90 ? 'error' : 'primary'} value={getPercentageStorage(size ,oneTB) } />
                                    </Grid>
                                </Grid>
                            </SubCard>
                        </Grid>
                    </Grid>
                </PerfectScrollbar>
            </Drawer >
            {loading && (<Loading open={loading} />)}
        </>
    );
};

export default Customization;
