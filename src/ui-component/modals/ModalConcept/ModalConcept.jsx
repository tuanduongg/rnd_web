import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { useSelector } from 'react-redux';
import { IconCloud, IconDownload } from '@tabler/icons-react';
import { border, height } from '@mui/system';
import { IconFolder } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { IconFile } from '@tabler/icons-react';
import { formatBytes } from 'utils/helper';
import dayjs from 'dayjs';
import { ShowConfirm } from 'ui-component/ShowDialog';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import Loading from 'ui-component/Loading';
import { useEffect } from 'react';
import { IconDeviceFloppy } from '@tabler/icons-react';
import ListFile from './component/ListFile';
import { isMobile } from 'react-device-detect';
import { IconHistory } from '@tabler/icons-react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1
});
const initValidate = { error: false, msg: '' };
const currentDate = dayjs(new Date());
export default function ModalConcept({ open, onClose, categories, setSnackBar, afterSave, typeModal, selected, setLoading,showModalHistory }) {
  const [personName, setPersonName] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [category, setCategory] = useState('');
  const [validateCategory, setValidateCategory] = useState(initValidate);
  const [modelName, setModelName] = useState('');
  const [validateModelName, setValidateModelName] = useState(initValidate);

  const [plName, setplName] = useState('');
  const [validatePlName, setValidatePlName] = useState(initValidate);

  const [code, setCode] = useState('');
  const [validateCode, setValidateCode] = useState(initValidate);

  const [productName, setProductName] = useState('');
  const [validateProductName, setValidateProductName] = useState(initValidate);

  const [regisDate, setRegisDate] = useState(currentDate);
  const [checkedFile, setCheckedFile] = useState([]);

  const [validateRegisDate, setValidateResisDate] = useState(initValidate);

  const auth = useSelector((state) => state.auth);

  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    onClose();
    setFileList([]);
    setCategory('');
    setValidateCategory(initValidate);
    setValidateModelName(initValidate);
    setplName('');
    setValidatePlName(initValidate);
    setCode('');
    setRegisDate(currentDate);
    setValidateCode(initValidate);
    setValidateProductName(initValidate);
    setValidateResisDate(initValidate);
    setModelName('');
    setProductName('');
    setCheckedFile([])
  };
  const getDetail = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.conceptDetail, { conceptId: selected?.conceptId });
    setLoading(false);
    const { conceptId, modelName, plName, code, productName, regisDate, status, category, files } = res?.data;
    setCategory(category?.categoryId);
    setModelName(modelName);
    setplName(plName);
    setCode(code);
    setProductName(productName);
    setRegisDate(dayjs(regisDate));
    setFileList(files?.map((file) => ({ ...file, isShow: true })));
  };
  useEffect(() => {
    if (selected?.conceptId && open && (typeModal === 'EDIT' || typeModal === 'VIEW')) {
      getDetail();
    }
  }, [open]);
  const onChangeFileInput = (e) => {
    const files = e.target.files;
    const newArrFile = [];
    for (const file of files) {
      file.isShow = true;
      newArrFile.push(file);
    }
    setFileList((prevState) => prevState.concat(newArrFile));
    e.target.value = null;
  };
  const onClickSave = () => {
    let check = false;
    if (!regisDate?.isValid()) {
      check = true;
      setValidateResisDate({ error: true, msg: 'This field is requird!' });
    }
    if (!category) {
      check = true;
      setValidateCategory({ error: true, msg: 'This field is requird!' });
    }
    if (modelName?.trim() === '') {
      check = true;
      setValidateModelName({ error: true, msg: 'This field is requird!' });
    }
    if (productName?.trim() === '') {
      check = true;
      setValidateProductName({ error: true, msg: 'This field is requird!' });
    }
    if (code?.trim() === '') {
      check = true;
      setValidateCode({ error: true, msg: 'This field is requird!' });
    }
    if (plName?.trim() === '') {
      check = true;
      setValidatePlName({ error: true, msg: 'This field is requird!' });
    }
    if (!check) {
      ShowConfirm({
        title: typeModal === 'EDIT' ? 'Update' : 'Create New',
        message: 'Do you want to save changes?',
        onOK: async () => {
          let formData = new FormData();
          const data = {
            conceptId: selected?.conceptId,
            category,
            modelName,
            code,
            productName,
            regisDate,
            plName,
            fileList
          };
          fileList.map((file) => {
            if (!file?.fileId) {
              formData.append('files', file);
            }
          });
          formData.append('data', JSON.stringify(data));
          setLoading(true);
          let url = typeModal === 'EDIT' ? RouterApi.conceptUpdate : RouterApi.conceptAdd;
          const res = await restApi.post(url, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          });
          setLoading(false);
          if (res?.status === 200) {
            setSnackBar({ open: true, message: 'Saved changes successful!', type: true });
            handleClose();
            afterSave();
          } else {
            setSnackBar({ open: true, message: res?.data?.message || 'Server Error!', type: false });
          }
        }
      });
    }
  };
  const onClickDelete = (index) => {
    const newFile = fileList;
    if (fileList[index]['fileId']) {
      const newFileArr = newFile.map((item, i) => {
        if (index === i) {
          return { ...item, isShow: false };
        }
        return item;
      });
      setFileList(newFileArr);
    } else {
      const newF = fileList.filter((item, i) => i !== index);
      setFileList(newF);
    }
  };
  const onChangeInput = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'code':
        if (validateCode?.error) {
          setValidateCode(initValidate);
        }
        setCode(value);
        break;
      case 'modelName':
        if (validateModelName?.error) {
          setValidateModelName(initValidate);
        }
        setModelName(value);
        break;
      case 'productName':
        if (validateProductName?.error) {
          setValidateProductName(initValidate);
        }
        setProductName(value);
        break;
      case 'plName':
        if (validatePlName?.error) {
          setValidatePlName(initValidate);
        }
        setplName(value);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <BootstrapDialog fullScreen={isMobile} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          {typeModal === 'ADD' ? 'Create New' : 'Edit Infomation'}
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
            <Grid item xs={6}>
              <FormControl fullWidth error={validateCategory.error} size="small">
                <InputLabel id="demo-simple-select-label">카테고리(Category)</InputLabel>
                <Select
                  inputProps={{ readOnly: typeModal === 'VIEW' }}
                  labelId="demo-simple-select-label"
                  label="카테고리(Category)"
                  placeholder="카테고리(Category)"
                  id="demo-simple-select"
                  value={category}
                  onChange={(e) => {
                    if (validateCategory?.error) setValidateCategory(initValidate);
                    setCategory(e.target.value);
                  }}
                >
                  {categories?.map((item) => (
                    <MenuItem key={item?.categoryId} value={item?.categoryId}>
                      {item?.categoryName}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{validateCategory?.msg}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  inputProps={{ readOnly: typeModal === 'VIEW' }}
                  onChange={onChangeInput}
                  id="standard-basic"
                  value={code}
                  name="code"
                  error={validateCode.error}
                  helperText={validateCode.msg}
                  label="코드(Code)"
                  placeholder="코드(Code)..."
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  inputProps={{ readOnly: typeModal === 'VIEW' }}
                  onChange={onChangeInput}
                  error={validateModelName.error}
                  helperText={validateModelName.msg}
                  value={modelName}
                  name="modelName"
                  id="standard-validateModelName"
                  label="모델명(Model)"
                  placeholder="모델명(Model)..."
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  inputProps={{ readOnly: typeModal === 'VIEW' }}
                  onChange={onChangeInput}
                  error={validateProductName.error}
                  helperText={validateProductName.msg}
                  value={productName}
                  name="productName"
                  id="standard-validateProductName"
                  label="품명(Product Name)"
                  placeholder="품명(Product Name)..."
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  inputProps={{ readOnly: typeModal === 'VIEW' }}
                  onChange={onChangeInput}
                  error={validatePlName.error}
                  helperText={validatePlName.msg}
                  id="standard-validatePlName"
                  value={plName}
                  name="plName"
                  label="P/L NAME"
                  placeholder="P/L NAME..."
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <DatePicker
                  readOnly={typeModal === 'VIEW'}
                  format="DD/MM/YYYY"
                  value={regisDate}
                  views={['year', 'month', 'day']}
                  slotProps={{
                    textField: { size: 'small', helperText: validateRegisDate.msg, error: validateRegisDate.error },
                    popper: { placement: 'right-end' }
                  }}
                  onChange={(newValue) => {
                    if (validateRegisDate?.error) setValidateResisDate(initValidate);
                    setRegisDate(newValue);
                  }}
                  label="등록일자(Registration Date)"
                  placeholder="등록일자(Registration Date)..."
                  size="small"
                />
              </FormControl>
            </Grid>
            {typeModal !== 'VIEW' && (<Grid item xs={12}>
              <Stack>
                <Typography variant="h5" gutterBottom>
                  첨부자료(File)
                </Typography>
                <Button component="label" role={undefined} variant="outlined" size="medium" tabIndex={-1} startIcon={<IconCloud />}>
                  Upload file
                  <VisuallyHiddenInput multiple type="file" onChange={onChangeFileInput} />
                </Button>
              </Stack>
              <Box sx={{ width: '100%', height: 'auto', padding: '5px' }}>
                <Grid container>
                  <Grid item xs={12}>
                    <List dense={false}>
                      {fileList.map(
                        (file, index) =>
                          file?.isShow && (
                            <React.Fragment key={index}>
                              <Divider />
                              <ListItem
                                // primaryTypographyProps={{
                                //   style: {
                                //     whiteSpace: 'nowrap',
                                //     overflow: 'hidden',
                                //     textOverflow: 'ellipsis'
                                //   }
                                // }}
                                disableGutters
                                secondaryAction={
                                  <IconButton
                                    onClick={(e) => {
                                      onClickDelete(index);
                                    }}
                                    size="small"
                                    edge="end"
                                    aria-label="delete"
                                  >
                                    <IconX />
                                  </IconButton>
                                }
                              >
                                <Typography sx={{ marginRight: '15px' }} component={'h6'}>
                                  {index + 1}
                                </Typography>
                                <ListItemAvatar>
                                  <Avatar>
                                    <IconFile />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={file?.name ? file?.name : file?.fileName ? file?.fileName : ''}
                                  secondary={formatBytes(file?.size ? file?.size : file?.fileSize ? file?.fileSize : '')}
                                />

                              </ListItem>
                            </React.Fragment>
                          )
                      )}
                      <Divider />
                    </List>
                  </Grid>
                </Grid>
              </Box>
            </Grid>)}
            {typeModal === 'VIEW' && (<Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                  첨부자료(File)
                </Typography>
              <ListFile listFile={fileList} checked={checkedFile} setChecked={setCheckedFile} />
            </Grid>)}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Close
          </Button>
          {typeModal !== 'VIEW' && (<Button variant="contained" startIcon={<IconDeviceFloppy />} autoFocus onClick={onClickSave}>
            Save changes
          </Button>)}
          {typeModal === 'VIEW' && (<Button variant="outlined" startIcon={<IconHistory />} onClick={() => { showModalHistory() }}>
            History
          </Button>)}
          {typeModal === 'VIEW' && (<Button variant="contained" startIcon={<IconDownload />} disabled={checkedFile?.length === 0} autoFocus onClick={() => { console.log(checkedFile); }}>
            Download All
          </Button>)}
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
