import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import ButtonBase from '@mui/material/ButtonBase';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';

// assets
import { IconBell, IconCloudDownload } from '@tabler/icons-react';
import { Badge, CircularProgress, IconButton, LinearProgress, Tooltip } from '@mui/material';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { minWidth } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMenu } from 'store/downloadSlice';
import LinearProgressWithLabel from 'layout/Customization/component/LinearWithLabel';
import { IconX } from '@tabler/icons-react';

// notification status options
const status = [
    {
        value: 'all',
        label: 'All Notification'
    },
    {
        value: 'new',
        label: 'New'
    },
    {
        value: 'unread',
        label: 'Unread'
    },
    {
        value: 'other',
        label: 'Other'
    }
];

// ==============================|| NOTIFICATION ||============================== //

const DownloadSection = () => {
    const theme = useTheme();
    const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
    const downloads = useSelector((state) => state.downloads);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [value, setValue] = useState('');
    /**
     * anchorRef is used on different componets and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);

    const handleToggle = () => {
        // setOpen((prevOpen) => !prevOpen);
        dispatch(toggleMenu({ open: !downloads?.open }))

    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        dispatch(toggleMenu({ open: false }))

        // setOpen(false);
    };

    const prevOpen = useRef(downloads?.open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleChange = (event) => {
        if (event?.target.value) setValue(event?.target.value);
    };

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    [theme.breakpoints.down('md')]: {
                        mr: 2
                    }
                }}
            >
                <ButtonBase sx={{ borderRadius: '12px' }}>
                    <Badge color="error" badgeContent={downloads?.files?.length > 0 ? 1 : 0} variant="dot">
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.primary.light,
                                color: theme.palette.primary.dark,
                                '&[aria-controls="menu-list-grow"],&:hover': {
                                    background: theme.palette.primary.dark,
                                    color: theme.palette.primary.light
                                }
                            }}
                            ref={anchorRef}
                            aria-controls={downloads?.open ? 'menu-list-grow' : undefined}
                            aria-haspopup="true"
                            onClick={handleToggle}
                        >

                            <IconCloudDownload stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </Badge>
                    {/* <Box mr={2} ref={anchorRef}
                        aria-controls={downloads?.open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle} >
                        <Badge color="error" badgeContent={downloads?.files?.length > 0 ? 1 : 0} variant="dot">
                            <Avatar
                                variant="rounded"
                                sx={{
                                    position: 'absolute',   // Absolute positioning to center the Avatar
                                    top: '50%',             // Move to the center
                                    left: '50%',            // Move to the center
                                    transform: 'translate(-50%, -50%)', // Center it properly
                                    ...theme.typography.commonAvatar,
                                    ...theme.typography.mediumAvatar,
                                    transition: 'all .2s ease-in-out',
                                    background: theme.palette.primary.light,
                                    color: theme.palette.primary.dark,
                                    '&[aria-controls="menu-list-grow"],&:hover': {
                                        background: theme.palette.primary.dark,
                                        color: theme.palette.primary.light
                                    }
                                }}

                                color="inherit"
                            >
                                <IconCloudDownload stroke={1.5} size="1.3rem" />
                            </Avatar>
                        </Badge>
                    </Box> */}
                </ButtonBase>
            </Box>
            <Popper
                placement={matchesXs ? 'bottom' : 'bottom-end'}
                open={downloads?.open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                    modifiers: [
                        {
                            name: 'offset',
                            options: {
                                offset: [matchesXs ? 5 : 0, 20]
                            }
                        }
                    ]
                }}
            >
                {({ TransitionProps }) => (
                    <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
                        <Paper>
                            <ClickAwayListener onClickAway={() => { }}>
                                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item xs={12}>
                                            <Grid container alignItems="center" justifyContent="space-between" sx={{ pt: 1, px: 2 }}>
                                                <Grid item>
                                                    <Typography color={'primary'} variant="subtitle1">Download</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <IconButton onClick={handleToggle} size='small'><IconX /></IconButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid alignItems={'center'} item xs={12}>
                                            <Divider />
                                            <Box
                                                style={{ height: '100%', maxHeight: 350, overflowX: 'hidden' }}
                                            >
                                                <Box sx={{ width: 350 }}>
                                                    {
                                                        downloads?.files?.length > 0 ? downloads.files.map((file) => (

                                                            (
                                                                <>

                                                                    <Grid container alignItems={'center'} p={1}>
                                                                        <Grid item xs={1.5} alignItems={'center'}>
                                                                            {file?.progress ? (
                                                                                <InsertDriveFileIcon />
                                                                            ) : (
                                                                                <CheckCircleIcon color='success' />
                                                                            )}
                                                                        </Grid>
                                                                        <Grid item xs={10.5}>
                                                                            <Stack>
                                                                                <Typography variant='h6'>
                                                                                    {file?.name}
                                                                                </Typography>
                                                                                {file?.progress ? (
                                                                                    <LinearProgress />
                                                                                ) : (
                                                                                    <Typography variant='subtitle2'>
                                                                                        Tải xuống thành công -

                                                                                        <a style={{ marginLeft: '5px', textDecoration: 'none' }} download={file?.name} href={file?.link}> Save File</a>
                                                                                    </Typography>
                                                                                )
                                                                                }
                                                                            </Stack>
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Divider />
                                                                </>
                                                            ))) : (<Box textAlign={'center'}>
                                                                <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                                                                <div>NO DATA</div>
                                                            </Box>)
                                                    }
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    {/* <Divider /> */}
                                    <CardActions sx={{ p: 1, justifyContent: 'flex-end' }}>
                                        {downloads?.files?.length > 0 && (<Typography variant='h5' mr={1}>Total: {downloads?.files?.length}</Typography>)}
                                    </CardActions>
                                </MainCard>
                            </ClickAwayListener>
                        </Paper>
                    </Transitions>
                )}
            </Popper>
        </>
    );
};

export default DownloadSection;
