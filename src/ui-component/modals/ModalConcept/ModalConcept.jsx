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
  Chip,
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
  Tooltip,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { useSelector } from 'react-redux';
import { IconCloud, IconDownload, IconInfoCircle } from '@tabler/icons-react';
import { border, height } from '@mui/system';
import { IconFolder } from '@tabler/icons-react';
import { IconX } from '@tabler/icons-react';
import { IconFile } from '@tabler/icons-react';
import { formatBytes, formatDateFromDB, getExtenstionFromOriginalName } from 'utils/helper';
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
import { showNameFile } from './modal_concept.service';
import { IconCircleCheck } from '@tabler/icons-react';
import { IconChecks } from '@tabler/icons-react';
import { useTheme } from '@mui/material/styles';
import { IconPointFilled } from '@tabler/icons-react';
import { IconCheck } from '@tabler/icons-react';
import { IconUserCheck } from '@tabler/icons-react';
import { getClassWithColor } from 'file-icons-js';
import 'file-icons-js/css/style.css';
import './modal_concept.css';
import { IconCloudUpload } from '@tabler/icons-react';


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
export default function ModalConcept({
  open,
  onClose,
  categories,
  setSnackBar,
  afterSave,
  typeModal,
  selected,
  setLoading,
  showModalHistory
}) {
  const theme = useTheme();

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

  const [approval, setApproval] = useState('');

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
    setApproval('');
    setCheckedFile([]);
  };
  const getDetail = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.conceptDetail, { conceptId: selected?.conceptId });
    setLoading(false);
    const { conceptId, modelName, plName, code, productName, regisDate, approval, category, files } = res?.data;
    setApproval(approval);
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
    // if (plName?.trim() === '') {
    //   check = true;
    //   setValidatePlName({ error: true, msg: 'This field is requird!' });
    // }
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
  const onClickDownLoadAll = async () => {
    setLoading(true);
    const response = await restApi.post(
      RouterApi.conceptDownloadMultiple,
      { fileIds: checkedFile },
      {
        responseType: 'blob'
      }
    );
    setLoading(false);
    if (response?.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `files.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setSnackBar({ open: true, message: response?.data?.message || 'Server Error!', type: false });
    }
  };
  console.log('fileList', fileList);

  return (
    <>
      <BootstrapDialog fullScreen={isMobile} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          <Stack direction={'row'} alignItems={'center'}>
            {typeModal === 'ADD' ? 'Create New' : typeModal === 'VIEW' ? 'Detail' : 'Edit Infomation'}
            {typeModal === 'VIEW' && approval && (<Tooltip title={"Approval: " + approval} arrow placement='right'>
              <IconUserCheck color='green' style={{ marginLeft: '5px' }} />
            </Tooltip>)}
          </Stack>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 6,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={typeModal === 'VIEW' ? 1 : 2}>
            {typeModal !== 'VIEW' && (<><Grid item xs={6}>
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
              </Grid></>)}
            {typeModal === 'VIEW' && (<>
              <Grid item xs={6}>
                <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                  &bull; 카테고리(Category)
                </Typography>
                <Typography ml={1} variant="subtitle1">
                  {category ?  categories?.find((categoryItem) => categoryItem?.categoryId === category).categoryName ?? '' : ''}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                  &bull; 코드(Code)
                </Typography>
                <Typography ml={1} variant="subtitle1">
                  {code}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                  &bull; 모델명(Model)
                </Typography>
                <Typography ml={1} variant="subtitle1">
                  {modelName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                  &bull; 품명(Product Name)
                </Typography>
                <Typography ml={1} sx={{wordBreak:'break-word'}} variant="subtitle1">
                  {productName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                  &bull; P/L Name
                </Typography>
                <Typography ml={1} variant="subtitle1">
                  {plName}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                  &bull; 등록일자(Registration Date)
                </Typography>
                <Typography ml={1} variant="subtitle1">
                  {regisDate?.format('DD/MM/YYYY')}
                </Typography>
              </Grid>
              {approval && (<Grid item xs={12}>
                <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                  &bull; Approval
                </Typography>
                <Typography ml={1} variant="subtitle1">
                  {approval}
                </Typography>
              </Grid>)}
              {/* <Grid item xs={12}>
                <Typography variant='h4' color={theme?.palette?.primary?.main}>
                  Files
                </Typography>
                <Divider />
              </Grid> */}
            </>)}
            {typeModal !== 'VIEW' && (
              <Grid item xs={12}>
                <Stack>
                  <Typography variant="h5" gutterBottom>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '5px' }}>첨부자료</span>
                      <Tooltip arrow title="Tip: You should compressed file to .zip before upload" placement="right">
                        <IconInfoCircle />
                      </Tooltip>
                    </div>
                  </Typography>
                  <Button component="label" role={undefined} variant="outlined" size="medium" tabIndex={-1} startIcon={<IconCloudUpload />}>
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
                                  sx={{ padding: '5px' }}
                                  disableGutters
                                  secondaryAction={
                                    <Tooltip arrow placement='left' title="Delete">
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
                                    </Tooltip>
                                  }
                                >
                                  <Typography sx={{ marginRight: '15px' }} component={'h6'}>
                                    {index + 1}
                                  </Typography>
                                  <span
                                    className={getClassWithColor(!file?.fileName ? file?.name : showNameFile(file?.fileName, file?.fileExtenstion)) + ' iconcustom_modal'}
                                  />
                                  {/* <Box sx={{ width: '25px', marginRight: '5px' }}>
                                    <FileIcon extension={!file?.fileExtenstion ? file?.name ? `${getExtenstionFromOriginalName(file.name)}`.toLocaleLowerCase() : '' : file?.fileExtenstion} {...defaultStyles[!file?.fileExtenstion ? file?.name ? `${getExtenstionFromOriginalName(file.name)}`.toLocaleLowerCase() : '' : file?.fileExtenstion]} />
                                  </Box> */}
                                  <ListItemText
                                    sx={{ margin: '0px' }}
                                    primary={file?.name ? file?.name : showNameFile(file?.fileName, file?.fileExtenstion)}
                                    secondary={
                                      <Stack direction={'row'} sx={{ fontSize: '12px' }}>
                                        <span style={{ minWidth: '75px' }} >
                                          {formatBytes(file?.size ? file?.size : file?.fileSize ? file?.fileSize : '')}
                                        </span>
                                        <span>
                                          <Tooltip arrow title="Upload at">{formatDateFromDB(file?.uploadAt)}</Tooltip>
                                        </span>
                                      </Stack>
                                    }
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
              </Grid>
            )}
            {typeModal === 'VIEW' && (
              <Grid item xs={12}>
                <ListFile typeModal={typeModal} setLoading={setLoading} listFile={fileList} checked={checkedFile} setChecked={setCheckedFile} />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>

          <Button variant="text" onClick={handleClose}>
            Close
          </Button>
          {typeModal !== 'VIEW' && (
            <Button variant="contained" startIcon={<IconDeviceFloppy />} autoFocus onClick={onClickSave}>
              Save changes
            </Button>
          )}
          {typeModal === 'VIEW' && (
            <Button
              variant="text"
              startIcon={<IconHistory />}
              onClick={() => {
                showModalHistory();
              }}
            >
              History
            </Button>
          )}
          {/* {typeModal === 'VIEW' && (
            <Button
              variant="contained"
              startIcon={<IconDownload />}
              disabled={checkedFile?.length === 0}
              autoFocus
              onClick={onClickDownLoadAll}
            >
              Download All
            </Button>
          )} */}
        </DialogActions>
      </BootstrapDialog >
    </>
  );
}
