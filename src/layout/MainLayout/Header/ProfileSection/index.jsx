import { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';

// assets
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';
import { SET_OPEN_DRAWE_RIGHT } from 'store/actions';
import { logout, stringAvatar } from 'utils/helper';
import { ShowConfirm, ShowMessage } from 'ui-component/ShowDialog';
import { IconBrandSamsungpass } from '@tabler/icons-react';
import ModalChangePassword from 'ui-component/modals/ModalChangePassword/ModalChangePassword';


// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const dispatch = useDispatch();
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    ShowConfirm({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      labelYes: 'Logout',
      onOK: () => {
        logout();
      }
    });
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    if (index === 0) {
      dispatch({ type: SET_OPEN_DRAWE_RIGHT, openRightDrawer: !customization?.openRightDrawer });
      // return;
    }
    if (index === 1) {
      setOpenModalChangePassword(true);
      // return;
    }
    setSelectedIndex(index);
    handleClose(event);

    // if (route && route !== '') {
    //   navigate(route);
    // }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
            {...stringAvatar(auth?.dataUser?.fullName)}
          ></Avatar>
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">Hi,</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {auth?.dataUser?.fullName}
                        </Typography>
                      </Stack>
                      <Typography variant="subtitle2">{auth?.dataUser?.userName}</Typography>
                    </Stack>
                    {/* <Divider /> */}
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 0}
                          onClick={(event) => handleListItemClick(event, 0, '#')}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Settings</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 1}
                          onClick={(event) => handleListItemClick(event, 1, '#')}
                        >
                          <ListItemIcon>
                            <IconBrandSamsungpass stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Grid container spacing={1} justifyContent="space-between">
                                <Grid item>
                                  <Typography variant="body2">Change password</Typography>
                                </Grid>
                                {/* <Grid item>
                                  <Chip
                                    label="02"
                                    size="small"
                                    sx={{
                                      bgcolor: theme.palette.warning.dark,
                                      color: theme.palette.background.default
                                    }}
                                  />
                                </Grid> */}
                              </Grid>
                            }
                          />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${customization.borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                      <Stack direction={'row'} justifyContent={'flex-end'}>
                        <Typography variant="subtitle2" >{import.meta.env.VITE_APP_VERSION}</Typography>
                      </Stack>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
      <ModalChangePassword
        open={openModalChangePassword}
        onClose={() => {
          setOpenModalChangePassword(false);
        }}
      />
    </>
  );
};

export default ProfileSection;
