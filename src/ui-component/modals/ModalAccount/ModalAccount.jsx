import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { useEffect } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import Loading from 'ui-component/Loading';
import { ShowConfirm } from 'ui-component/ShowDialog';
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
const names = ['ACC', 'RUBBER', 'CONVERTING', 'INJECTION', 'METAL KEY 5개중 택'];
const initvalidate = { error: false, msg: '' };
export default function ModalAccount({ open, onClose, afterSave, setSnackBar,selected,typeModal }) {
  const [personName, setPersonName] = useState([]);
  const [fullName, setFullName] = useState('');
  const [roles, setRoles] = useState([]);
  const [userName, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [validateFullName, setValidateFullName] = useState(initvalidate);
  const [validateUserName, setValidateUserName] = useState(initvalidate);
  const [validatePassword, setValidatePassword] = useState(initvalidate);
  const [validateRole, setValidateRole] = useState(initvalidate);
  const [isRoot, setIsRoot] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    setFullName('');
    setUsername('');
    setPassword('');
    setIsRoot(false);
    setValidateFullName(initvalidate);
    setValidateUserName(initvalidate);
    setValidatePassword(initvalidate);
    setValidateRole(initvalidate);
    setRole('');
    onClose();
  };
  const getAllRole = async () => {
    setLoading(true);
    const response = await restApi.get(RouterApi.roleAll);
    setLoading(false);
    if (response?.status === 200) {
      setRoles(response?.data);
    }
  };
  const findUser = async () => {
    setLoading(true);
    const response = await restApi.post(RouterApi.findUser,{userId:selected?.userId});
    setLoading(false);
    if (response?.status === 200) {
      const data = response?.data;
      setFullName(data?.fullName)
      setUsername(data?.userName)
      setIsRoot(data?.isRoot)
      setRole(data?.role?.roleId)
    }
  };
  useEffect(() => {
    getAllRole();
  }, []);
  useEffect(() => {
    if(open && typeModal === 'EDIT' && selected) {
      findUser();
    }
  }, [open]);

  const onChangeInput = (e) => {
    const { name, value } = e?.target;
    switch (name) {
      case 'fullName':
        if (validateFullName.error) {
          setValidateFullName(initvalidate);
        }
        setFullName(value);
        break;
      case 'userName':
        if (validateUserName.error) {
          setValidateUserName(initvalidate);
        }
        setUsername(value);
        break;
      case 'password':
        if (validatePassword.error) {
          setValidatePassword(initvalidate);
        }
        setPassword(value);
        break;

      default:
        break;
    }
  };
  const onClickSave = () => {
    let check = false;
    if (!role) {
      check = true;
      setValidateRole({ error: true, msg: 'This field is requird!' });
    }
    if (fullName?.trim() === '') {
      check = true;
      setValidateFullName({ error: true, msg: 'This field is requird!' });
    }
    if (userName?.trim() === '') {
      check = true;
      setValidateUserName({ error: true, msg: 'This field is requird!' });
    }
    if (password?.trim() === '' && typeModal === 'ADD') {
      check = true;
      setValidatePassword({ error: true, msg: 'This field is requird!' });
    }
    if (check === false) {
      let urlAPI = typeModal === 'ADD' ? RouterApi.createUser : RouterApi.updateUser;
      ShowConfirm({
        title: typeModal === 'ADD'? 'Create User' : 'Update User',
        message: 'Do you want to save changes?',
        onOK: async () => {
          const res = await restApi.post(urlAPI, {
            userId:selected?.userId,
            fullName,
            userName,
            role,
            password,
            isRoot
          });
          if (res?.status === 200) {
            afterSave();
            handleClose();
            setSnackBar({ open: true, message: 'Saved changes successful!', type: true });
          } else {
            setSnackBar({ open: true, message: res?.data?.message || 'Server Error!', type: false });
          }
        }
      });
    }
  };
  return (
    <>
      <BootstrapDialog fullScreen={isMobile} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          Create New User
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
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <TextField
                  helperText={validateFullName.msg}
                  error={validateFullName.error}
                  onChange={onChangeInput}
                  value={fullName}
                  name="fullName"
                  label="Full Name"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <TextField
                disabled={typeModal==='EDIT'}
                  helperText={validateUserName.msg}
                  error={validateUserName.error}
                  onChange={onChangeInput}
                  name="userName"
                  value={userName}
                  label="User Name"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <TextField
                  helperText={validatePassword.msg}
                  error={validatePassword.error}
                  onChange={onChangeInput}
                  value={password}
                  name="password"
                  label="Password"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl error={validateRole?.error} fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  value={role}
                  labelId="demo-simple-select-label"
                  label="Role"
                  id="demo-simple-select"
                  onChange={(e) => {
                    if (validateRole.error) {
                      setValidateRole(initvalidate);
                    }
                    setRole(e.target.value);
                  }}
                >
                  {roles?.map((role) => (
                    <MenuItem key={role?.roleId} value={role?.roleId}>{role?.roleName}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{validateRole?.msg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isRoot}
                    value={isRoot}
                    onChange={(e) => {
                      setIsRoot(!isRoot);
                    }}
                  />
                }
                label="Admin"
              />
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
      <Loading open={loading} />
    </>
  );
}
