import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { Alert, FormControl, Grid, IconButton, Portal, Snackbar, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import Loading from 'ui-component/Loading';
import { ShowConfirm } from 'ui-component/ShowDialog';
import { logout } from 'utils/helper';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { isMobile } from 'react-device-detect';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));
const initvalidate = { error: false, msg: '' };
export default function ModalChangePassword({ open, onClose }) {
  const [currentPassword, setCurrenPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validateCurrentPasword, setValidateCurrentPasword] = useState(initvalidate);
  const [validateNewPassword, setValidateNewPassword] = useState(initvalidate);
  const [validateConfirmPassword, setValidateConfirmPassword] = useState(initvalidate);
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: '',
    type: true
  });
  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    setCurrenPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setValidateCurrentPasword(initvalidate);
    setValidateNewPassword(initvalidate);
    setValidateConfirmPassword(initvalidate);
    onClose();
  };

  const onChangeInput = (e) => {
    const { name, value } = e?.target;
    switch (name) {
      case 'currentPassword':
        if (validateCurrentPasword.error) {
          setValidateCurrentPasword(initvalidate);
        }
        setCurrenPassword(value);
        break;
      case 'newPassword':
        if (validateNewPassword.error) {
          setValidateNewPassword(initvalidate);
        }
        setNewPassword(value);
        break;
      case 'confirmPassword':
        if (validateConfirmPassword.error) {
          setValidateConfirmPassword(initvalidate);
        }
        setConfirmPassword(value);
        break;

      default:
        break;
    }
  };
  const onClickSave = () => {
    let check = false;
    if (currentPassword?.trim() === '') {
      check = true;
      setValidateCurrentPasword({ error: true, msg: 'This field is requird!' });
    }
    if (newPassword?.trim() === '') {
      check = true;
      setValidateNewPassword({ error: true, msg: 'This field is requird!' });
    }
    if (confirmPassword?.trim() === '') {
      check = true;
      setValidateConfirmPassword({ error: true, msg: 'This field is requird!' });
    }
    if (check === false) {
      // let urlAPI = typeModal === 'ADD' ? RouterApi.createUser : RouterApi.updateUser;
      ShowConfirm({
        title: 'Change Password',
        message: 'Do you want to save changes?',
        onOK: async () => {
          const res = await restApi.post(RouterApi.changePasswordUser, {
            currentPassword,
            newPassword,
            confirmPassword
          });
          if (res?.status === 200) {
            setSnackBar({ open: true, message: 'Saved changes successful!', type: true });
            setTimeout(() => {
              logout();
            }, 1000);
          } else {
            setSnackBar({ open: true, message: res?.data?.message || 'Server Error!', type: false });
          }
        }
      });
    }
  };
  return (
    <>
      <Portal>
        <Snackbar
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackBar?.open}
          onClose={() => {
            setSnackBar({ open: false, message: '' });
          }}
        >
          <Alert
            onClose={() => {
              setSnackBar({ open: false, message: '' });
            }}
            severity={snackBar?.type ? 'success' : 'error'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackBar?.message}
          </Alert>
        </Snackbar>
      </Portal>

      <BootstrapDialog fullScreen={isMobile} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          Change your password
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={24}>
              <FormControl fullWidth size="small">
                <TextField
                  helperText={validateCurrentPasword.msg}
                  error={validateCurrentPasword.error}
                  onChange={onChangeInput}
                  value={currentPassword}
                  name="currentPassword"
                  label="Current password"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={24}>
              <FormControl fullWidth size="small">
                <TextField
                  helperText={validateNewPassword.msg}
                  error={validateNewPassword.error}
                  onChange={onChangeInput}
                  name="newPassword"
                  value={newPassword}
                  label="New password"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={24}>
              <FormControl fullWidth size="small">
                <TextField
                  helperText={validateConfirmPassword.msg}
                  error={validateConfirmPassword.error}
                  onChange={onChangeInput}
                  value={confirmPassword}
                  name="confirmPassword"
                  label="Confirm Password"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" startIcon={<IconDeviceFloppy />} autoFocus onClick={onClickSave}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
