import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import {
  Autocomplete,
  Box,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconDeviceFloppy, IconPlus, IconUpload } from '@tabler/icons-react';
import { isMobile } from 'react-device-detect';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import config from 'config';
import { DatePicker } from '@mui/x-date-pickers';
import { IconFile } from '@tabler/icons-react';
import { IconPhotoPlus } from '@tabler/icons-react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { getIcon } from '../ModalConcept/modal_concept.service';
import './modal_countertactics.css';
import 'file-icons-js/css/style.css';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import {
  initValidate,
  currentDate,
  currenWeekNum,
  inititalValueForm,
  inititalValidateForm,
  arrNoValidate,
  listObjDate,
  arrFieldNum
} from './modal_countertactics.service';
import { concatFileNameWithExtension, formatNumberWithCommas, showImageFromAPI } from 'utils/helper';
import toast from 'react-hot-toast';
import { ShowConfirm } from 'ui-component/ShowDialog';
import dayjs from 'dayjs';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    borderBottom: 'none'
  },
  '.MuiPaper-root': {
    maxWidth: '700px'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },

  '& .MuiDialogTitle-root': {
    padding: '10px 15px'
  }
}));
// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1
// });

export default function ModalCounterTactics({ open, onClose, afterSave, typeModal, setLoading, selected, listProcess }) {
  const theme = useTheme();
  const [listImageUpload, setListImageUpload] = useState([]);
  const [listFilePreview, setListFilePreview] = useState([]);
  const [fileUploadRequest, setFileUploadRequest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [valueForm, setValueForm] = useState(inititalValueForm);
  const [typeFileUpload, seTypeFileUpload] = useState('');
  const [validateForm, setValidateForm] = useState(inititalValidateForm);
  const inputImageRef = useRef();
  const inputFileRef = useRef();

  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    setListFilePreview([]);
    setListImageUpload([]);
    setFileUploadRequest([]);
    setValidateForm(inititalValidateForm);
    setValueForm(inititalValueForm);
    onClose();
  };

  const findByCode = async () => {
    if (typeModal === 'EDIT') {
      return;
    }
    const codeReq = `${valueForm?.code}`.trim();
    // setLoading(true);
    const res = await restApi.post(RouterApi.conceptFindByCode, { code: codeReq });
    // setLoading(false);
    if (res?.status === 200) {
      const { modelName, productName, plName, category } = res?.data;
      setValidateForm((pre) => ({ ...pre, model: initValidate, item: initValidate }));
      setValueForm((pre) => ({ ...pre, model: modelName, item: productName, plName: plName, category: category?.categoryId }));
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      if (valueForm?.code) {
        findByCode();
      }
    }, 1000); // 3000ms = 3s

    // Cleanup the timer if the user types again within the 3s
    return () => clearTimeout(timer);
  }, [valueForm.code]);

  const getCategories = async () => {
    if (categories?.length > 0) {
      return;
    }
    setLoading(true);
    const res = await restApi.get(RouterApi.cateConceptAll);
    setLoading(false);
    if (res?.status === 200) {
      setCategories(res?.data);
    }
  };

  const getMedia = async (selectedID) => {
    setLoading(true);
    const res = await restApi.post(RouterApi.getImagesByReportQC, { reportId: selectedID });
    setLoading(false);
    if (res?.status === 200) {
      const data = res?.data;
      const imageArr = [];
      const fileArr = [];
      console.log('data', data);

      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (element?.type?.trim() === 'IMG') {
          imageArr.push({ ...element, isShow: true });
        } else if (element?.type?.trim() === 'FRL') {
          fileArr.push({ ...element, isShow: true, typeFile: 'REPLY' });
        } else if (element?.type?.trim() === 'FRQ') {
          fileArr.push({ ...element, isShow: true, typeFile: 'REQUEST' });
        } else {
        }
      }
      // data.map((item) => {
      //   console.log('item', item);
      // });
      console.log('fileArr', fileArr);

      setListImageUpload(imageArr);
      setFileUploadRequest(fileArr);
    }
  };
  useEffect(() => {
    if (open) {
      getCategories();
      if (typeModal === 'EDIT' && selected) {
        getMedia(selected?.reportId);
        setValueForm({
          shift: selected?.shift,
          author: selected?.author,
          week: selected?.week,
          date: dayjs(selected?.time),
          category: selected?.category?.categoryId,
          ngName: selected?.nameNG || '',
          percentage: selected?.percentageNG || '',
          code: selected?.code,
          process: selected?.processQC?.processId,
          model: selected?.model,
          supplier: selected?.supplier,
          plName: selected?.plName,
          attributable: selected?.attributable,
          item: selected?.item,
          representative: selected?.representative,
          seowonStock: selected?.seowonStock ? formatNumberWithCommas(selected?.seowonStock) : '',
          vendorStock: selected?.vendorStock ? formatNumberWithCommas(selected?.vendorStock) : '',
          tempSolution: selected?.tempSolution,
          techNg: selected?.techNG,
          remark: selected?.remark,
          requestDate: selected?.dateRequest ? dayjs(selected?.dateRequest) : null,
          replyDate: selected?.dateReply ? dayjs(selected?.dateReply) : null
        });
      }
    }
  }, [open]);

  useEffect(() => {
    const newArr = listImageUpload.map((file) => {
      if (file) {
        if (file?.fileId) {
          return file;
        }
        return {
          isShow: file?.isShow || false,
          fileName: file?.name,
          fileUrl: URL.createObjectURL(file)
        };
      }
    });
    setListFilePreview(newArr);
  }, [listImageUpload]);
  const onDeleteImage = (e, index) => {
    const newArr = listImageUpload.map((item, i) => {
      if (i === index) {
        item['isShow'] = false;
        return item;
      }
      return item;
    });
    setListImageUpload(newArr);
  };
  const onChangeInputImage = (e) => {
    const files = e.target.files;
    const numFile = listImageUpload.filter((item) => item?.isShow).length + files?.length;
    if (files?.length > config?.maxFileUpload || numFile > config?.maxFileUpload) {
      e.target.value = null;
      e.target.files = null;
      toast.error(`Allow upload max: ${config?.maxFileUpload} files!`);
      return;
    }
    const arrNewFile = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      element['isShow'] = true;
      arrNewFile.push(element);
    }
    setListImageUpload((pre) => pre.concat(arrNewFile));
    e.target.value = null;
    e.target.files = null;
  };
  const onClickUploadFile = (e) => {
    inputFileRef.current.click();
  };

  const onDeleteFileUpload = (e, index) => {
    const newArr = fileUploadRequest.map((item, i) => {
      if (i === index) {
        item['isShow'] = false;
      }
      return item;
    });
    setFileUploadRequest(newArr);
  };
  const onChangeInput = (e) => {
    const { value, name } = e?.target;
    if (validateForm[name].error) {
      setValidateForm((pre) => ({ ...pre, [name]: initValidate }));
    }
    setValueForm((prevValueForm) => ({
      ...prevValueForm,
      [name]: arrFieldNum?.includes(name) ? formatNumberWithCommas(value) : value
    }));
  };
  const onChangeCode = (e) => {
    const { value } = e?.target;
    if (validateForm?.code?.error) {
      setValidateForm((pre) => ({ ...pre, code: initValidate }));
    }
    setValueForm((prevValueForm) => ({
      ...prevValueForm,
      code: value
    }));
  };
  const onClickSave = async () => {
    let check = false;
    Object.keys(valueForm).map((key, index) => {
      if (listObjDate?.includes(key)) {
        if (!arrNoValidate.includes(key) && (!valueForm[key] || !valueForm[key]?.isValid())) {
          check = true;
          setValidateForm((pre) => ({ ...pre, [key]: { error: true, msg: 'This field is requried!' } }));
        }
      } else {
        if (`${valueForm[key]}`.trim() === '' && !arrNoValidate.includes(key)) {
          check = true;
          setValidateForm((pre) => ({ ...pre, [key]: { error: true, msg: 'This field is requried!' } }));
        }
      }
    });

    if (!check) {
      ShowConfirm({
        title: 'Create New',
        message: 'Do you want to save changes?',
        onOK: async () => {
          const dataSend = {
            ...valueForm,
            seowonStock: `${valueForm?.seowonStock}`.replaceAll(',', ''),
            vendorStock: `${valueForm?.vendorStock}`.replaceAll(',', '')
          };
          if (typeModal === 'EDIT') {
            dataSend['reportId'] = selected?.reportId;
            dataSend['imagesDelete'] = listImageUpload.filter((item) => !item.isShow && item?.fileId);
            dataSend['filesDelete'] = fileUploadRequest.filter((item) => !item.isShow && item?.fileId);
          }
          const formData = new FormData();
          formData.append('data', JSON.stringify(dataSend));
          listImageUpload.map((file) => {
            formData.append('images', file);
          });
          fileUploadRequest.map((file) => {
            switch (file?.typeFile) {
              case 'REQUEST':
                formData.append('fileRequest', file);
                break;
              case 'REPLY':
                formData.append('fileReply', file);
                break;

              default:
                break;
            }
          });
          let url = typeModal === 'EDIT' ? RouterApi.updateReportQC : RouterApi.addReportQC;
          setLoading(true);
          const res = await restApi.post(url, formData);
          setLoading(false);
          if (res?.status === 200) {
            handleClose();
            afterSave();
            toast.success('Successfully Savechanged!');
          } else {
            toast.error(res?.data?.message || 'Server error!');
          }
        }
      });
    }
  };
  const onChangeDate = (newValue) => {
    let week = valueForm.week;
    if (newValue?.isValid()) {
      const currentWeek = newValue.week();
      week = currentWeek < 10 ? `0${currentWeek}` : currentWeek;
    }
    setValueForm((pre) => ({ ...pre, date: newValue, week: week }));
    if (validateForm['date'].error) {
      setValidateForm((pre) => ({ ...pre, date: initValidate }));
    }
  };
  const onChangeInputFile = (e) => {
    const files = e.target.files;
    const numFile = fileUploadRequest.filter((item) => item?.isShow)?.length + files?.length;

    if (files?.length > config?.maxFileUpload || numFile > config?.maxFileUpload) {
      e.target.value = null;
      e.target.files = null;
      toast.error(`Allow upload max: ${config?.maxFileUpload} files!`);
      return;
    }

    const arrNewFile = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      element['isShow'] = true;
      element['typeFile'] = typeFileUpload;
      arrNewFile.push(element);
    }
    setFileUploadRequest((pre) => pre.concat(arrNewFile));
    e.target.value = null;
    e.target.files = null;
  };

  return (
    <>
      <PhotoProvider pullClosable={true} maskClosable={true}>
        <BootstrapDialog fullScreen={isMobile} maxWidth={'md'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
            <Stack direction={'row'} alignItems={'center'}>
              {typeModal === 'ADD' ? 'Create New' : 'Edit Infomation'}
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
          <Divider />
          <DialogContent>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={4.5}>
                  <FormControl size="small">
                    {/* <FormLabel id="demo-radio-buttons-group-label">Shift</FormLabel> */}
                    <RadioGroup
                      onChange={(event) => {
                        setValueForm((pre) => ({ ...pre, shift: event.target.value }));
                      }}
                      value={valueForm?.shift}
                      row
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="D"
                      name="radio-buttons-group"
                    >
                      <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <span style={{ fontWeight: 'bold' }}>Shift:</span>
                        <FormControlLabel value="D" control={<Radio />} label="Day" />
                        <FormControlLabel value="N" control={<Radio />} label="Night" />
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={2}>
                  <FormControl error={validateForm?.week?.error} fullWidth size="small">
                    <TextField
                      id="standard-basic"
                      name="week"
                      type="number"
                      onChange={onChangeInput}
                      value={valueForm?.week}
                      error={validateForm?.week?.error}
                      //   helperText={validateForm?.week?.msg}
                      label="Week"
                      placeholder="Week..."
                      size="small"
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={5.5}>
                  <FormControl error={validateForm?.date?.error} fullWidth size="small">
                    <DatePicker
                      clearable={false}
                      name="date"
                      value={valueForm?.date}
                      format="YYYY/MM/DD"
                      views={['year', 'month', 'day']}
                      slotProps={{
                        textField: { size: 'small', helperText: validateForm?.date?.msg, error: validateForm?.date?.msg }
                        //   popper: { placement: 'right-end' }
                      }}
                      onChange={onChangeDate}
                      label="Date"
                      placeholder="Date..."
                      size="small"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.date?.msg}</FormHelperText> */}
                </Grid>
                <Grid item xs={6}>
                  <FormControl error={validateForm?.category?.error} fullWidth size="small">
                    <InputLabel error={validateForm?.category?.error} id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      label="Category"
                      placeholder="Category..."
                      id="demo-simple-select"
                      value={valueForm?.category}
                      // value={category}
                      onChange={(e) => {
                        if (validateForm['category'].error) {
                          setValidateForm((pre) => ({ ...pre, category: initValidate }));
                        }
                        // if (validateCategory?.error) setValidateCategory(initValidate);
                        setValueForm((pre) => ({ ...pre, category: e.target.value }));
                      }}
                    >
                      {categories?.map((item) => (
                        <MenuItem key={item?.categoryId} value={item?.categoryId}>
                          {item?.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <FormHelperText>{validateForm?.category?.error}</FormHelperText> */}
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
                  <FormControl error={validateForm?.ngName?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-gn">불량명(NG Name)</InputLabel>
                    <OutlinedInput
                      value={valueForm?.ngName}
                      placeholder="불량명..."
                      name="ngName"
                      onChange={onChangeInput}
                      id="outlined-adornment-gn"
                      //   error={validateForm?.ngName?.error}
                      //   helperText={validateForm?.ngName?.msg}
                      aria-describedby="outlined-weight-helper-text"
                      label="불량명(NG Name)"
                    />
                  </FormControl>
                  {/* <FormHelperText sx={{ color: 'red' }}>{validateForm?.ngName?.msg}</FormHelperText> */}
                </Grid>
                <Grid item xs={2}>
                  <FormControl error={validateForm?.percentage?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">불량율</InputLabel>
                    <OutlinedInput
                      value={valueForm?.percentage}
                      placeholder="불량율..."
                      name="percentage"
                      onChange={onChangeInput}
                      error={validateForm?.percentage?.error}
                      //   helperText={validateForm?.percentage?.msg}
                      id="outlined-adornment-password"
                      endAdornment={<InputAdornment position="end">%</InputAdornment>}
                      aria-describedby="outlined-weight-helper-text"
                      label="불량율"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.percentage?.msg}</FormHelperText> */}
                </Grid>
                <Grid item xs={6}>
                  <FormControl error={validateForm?.code?.error} fullWidth size="small">
                    <TextField
                      id="standard-basic"
                      name="code"
                      onChange={onChangeCode}
                      value={valueForm?.code}
                      error={validateForm?.code?.error}
                      //   helperText={validateForm?.code?.msg}
                      label="Code"
                      placeholder="Code..."
                      size="small"
                      variant="outlined"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl error={validateForm?.process?.error} fullWidth size="small">
                    <InputLabel htmlFor="demo-simple-select-proces" id="demo-simple-select-label">
                      공정(Process)
                    </InputLabel>
                    <Select
                      value={valueForm?.process}
                      labelId="demo-simple-select-proces"
                      label="공정(Process)"
                      placeholder="공정(Process)"
                      id="demo-simple-select-proces"
                      onChange={(e) => {
                        if (validateForm['process'].error) {
                          setValidateForm((pre) => ({ ...pre, process: initValidate }));
                        }
                        //   if (validateCategory?.error) setValidateCategory(initValidate);
                        setValueForm((pre) => ({ ...pre, process: e.target.value }));
                      }}
                    >
                      {listProcess?.map((item) => (
                        <MenuItem key={item?.processId} value={item?.processId}>
                          {item?.processName}
                        </MenuItem>
                      ))}
                    </Select>
                    {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl error={validateForm?.author?.error} fullWidth size="small">
                    <TextField
                      id="standard-basic"
                      value={valueForm?.author}
                      name="author"
                      onChange={onChangeInput}
                      error={validateForm?.author?.error}
                      //   helperText={validateForm?.model?.msg}
                      label="작성자"
                      placeholder="author..."
                      size="small"
                      variant="outlined"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.model?.msg}</FormHelperText> */}
                </Grid>

                <Grid item xs={6}>
                  <FormControl error={validateForm?.model?.error} fullWidth size="small">
                    <TextField
                      id="standard-basic"
                      value={valueForm?.model}
                      name="model"
                      onChange={onChangeInput}
                      error={validateForm?.model?.error}
                      //   helperText={validateForm?.model?.msg}
                      label="Model"
                      placeholder="Model..."
                      size="small"
                      variant="outlined"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.model?.msg}</FormHelperText> */}
                </Grid>

                <Grid item xs={6}>
                  <FormControl error={validateForm?.supplier?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">고객명(NCC)</InputLabel>
                    <OutlinedInput
                      placeholder="고객명(NCC)..."
                      name="supplier"
                      error={validateForm?.supplier?.error}
                      //   helperText={validateForm?.supplier?.msg}
                      onChange={onChangeInput}
                      value={valueForm?.supplier}
                      id="outlined-adornment-password"
                      aria-describedby="outlined-weight-helper-text"
                      label="고객명(NCC)"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.supplier?.msg}</FormHelperText> */}
                </Grid>

                <Grid item xs={6}>
                  <FormControl error={validateForm?.plName?.error} fullWidth size="small">
                    <TextField
                      id="standard-basic"
                      value={valueForm?.plName}
                      name="plName"
                      onChange={onChangeInput}
                      error={validateForm?.plName?.error}
                      //   helperText={validateForm?.plName?.msg}
                      label="PL/NAME"
                      placeholder="PL/NAME..."
                      size="small"
                      variant="outlined"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                </Grid>

                <Grid item xs={6}>
                  <FormControl error={validateForm?.attributable?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">발생 귀책처(Attributable)</InputLabel>
                    <OutlinedInput
                      value={valueForm?.attributable}
                      placeholder="발생 귀책처(Attributable)..."
                      name="attributable"
                      onChange={onChangeInput}
                      error={validateForm?.attributable?.error}
                      //   helperText={validateForm?.attributable?.msg}
                      id="outlined-adornment-password"
                      aria-describedby="outlined-weight-helper-text"
                      label="발생 귀책처(Attributable)"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                </Grid>

                <Grid item xs={6}>
                  <FormControl error={validateForm?.item?.error} fullWidth size="small">
                    <TextField
                      id="standard-item-basic"
                      // value={code}
                      value={valueForm?.item}
                      name="item"
                      onChange={onChangeInput}
                      error={validateForm?.item?.error}
                      //   helperText={validateForm?.item?.msg}
                      label="Item"
                      placeholder="Item..."
                      size="small"
                      variant="outlined"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                </Grid>

                <Grid item xs={6}>
                  <FormControl error={validateForm?.representative?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">공급 업체 담당자</InputLabel>
                    <OutlinedInput
                      value={valueForm?.representative}
                      placeholder="Representative..."
                      name="representative"
                      error={validateForm?.representative?.error}
                      //   helperText={validateForm?.representative?.msg}
                      onChange={onChangeInput}
                      id="outlined-adornment-password"
                      aria-describedby="outlined-weight-helper-text"
                      label="공급 업체 담당자"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                </Grid>
                <Grid item xs={6}>
                  <FormControl error={validateForm?.seowonStock?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Seowon stock</InputLabel>
                    <OutlinedInput
                      value={valueForm?.seowonStock}
                      placeholder="Seowon stock..."
                      error={validateForm?.seowonStock?.error}
                      //   helperText={validateForm?.seowonStock?.msg}
                      name="seowonStock"
                      onChange={(e) => {
                        const re = /^[0-9\b,]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          onChangeInput(e);
                        }
                      }}
                      id="outlined-adornment-password"
                      aria-describedby="outlined-weight-helper-text"
                      label="Seowon stock"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                </Grid>
                <Grid item xs={6}>
                  <FormControl error={validateForm?.vendorStock?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Vendor stock</InputLabel>
                    <OutlinedInput
                      value={valueForm?.vendorStock}
                      placeholder="Vendor stock..."
                      error={validateForm?.vendorStock?.error}
                      //   helperText={validateForm?.vendorStock?.msg}
                      name="vendorStock"
                      onChange={(e) => {
                        const re = /^[0-9\b,]+$/;
                        if (e.target.value === '' || re.test(e.target.value)) {
                          onChangeInput(e);
                        }
                      }}
                      id="outlined-adornment-password"
                      aria-describedby="outlined-weight-helper-text"
                      label="Vendor stock"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                </Grid>
                <Grid item xs={6}>
                  <FormControl error={validateForm?.techNg?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">불량 원인 기술</InputLabel>
                    <OutlinedInput
                      value={valueForm?.techNg}
                      multiline
                      rows={2}
                      placeholder="불량 원인 기술..."
                      name="techNg"
                      error={validateForm?.techNg?.error}
                      //   helperText={validateForm?.techNg?.msg}
                      onChange={onChangeInput}
                      id="outlined-adornment-password"
                      aria-describedby="outlined-weight-helper-text"
                      label="불량 원인 기술"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                </Grid>
                <Grid item xs={6}>
                  <FormControl error={validateForm?.tempSolution?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Temporary Solution</InputLabel>
                    <OutlinedInput
                      multiline
                      value={valueForm?.tempSolution}
                      rows={2}
                      error={validateForm?.tempSolution?.error}
                      //   helperText={validateForm?.tempSolution?.msg}
                      placeholder="Temporary Solution..."
                      name="tempSolution"
                      onChange={onChangeInput}
                      id="outlined-adornment-password"
                      aria-describedby="outlined-weight-helper-text"
                      label="Temporary Solution"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                </Grid>

                <Grid item xs={12}>
                  <FormControl error={validateForm?.remark?.error} fullWidth size="small" variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Remark</InputLabel>
                    <OutlinedInput
                      error={validateForm?.remark?.error}
                      //   helperText={validateForm?.remark?.msg}
                      value={valueForm?.remark}
                      multiline
                      rows={3}
                      placeholder="Remark..."
                      name="remark"
                      onChange={onChangeInput}
                      id="outlined-adornment-password"
                      aria-describedby="outlined-weight-helper-text"
                      label="Remark"
                    />
                  </FormControl>
                  {/* <FormHelperText>{validateForm?.process?.msg}</FormHelperText> */}
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <DatePicker
                      value={valueForm?.requestDate}
                      format="YYYY/MM/DD"
                      views={['year', 'month', 'day']}
                      slotProps={{
                        textField: { size: 'small' }
                        //   popper: { placement: 'right-end' }
                      }}
                      onChange={(newValue) => {
                        if (validateForm['requestDate'].error) {
                          setValidateForm((pre) => ({ ...pre, requestDate: initValidate }));
                        }
                        setValueForm((pre) => ({ ...pre, requestDate: newValue }));
                      }}
                      label="Request Date"
                      placeholder="Request Date..."
                      size="small"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <DatePicker
                      value={valueForm?.replyDate}
                      format="YYYY/MM/DD"
                      views={['year', 'month', 'day']}
                      slotProps={{
                        textField: { size: 'small' }
                        //   popper: { placement: 'right-end' }
                      }}
                      onChange={(newValue) => {
                        if (validateForm['replyDate'].error) {
                          setValidateForm((pre) => ({ ...pre, replyDate: initValidate }));
                        }
                        setValueForm((pre) => ({ ...pre, replyDate: newValue }));
                      }}
                      label="Reply Date"
                      placeholder="Reply Date..."
                      size="small"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    border={'1px dotted #aaa'}
                    minHeight={50}
                    justifyContent={'center'}
                    alignItems={'center'}
                    display={fileUploadRequest?.length <= 0 ? 'flex' : 'block'}
                    width={'100%'}
                    sx={{ overflowY: 'auto', padding: '5px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Button
                        size="small"
                        onClick={(e) => {
                          seTypeFileUpload('REQUEST');
                          onClickUploadFile(e);
                        }}
                        variant="text"
                        startIcon={<IconUpload />}
                      >
                        대책서 파일 첨부(Request File)
                      </Button>
                    </div>
                    {fileUploadRequest?.length > 0 &&
                      fileUploadRequest.map(
                        (fileRequest, index) =>
                          fileRequest?.isShow &&
                          fileRequest?.typeFile === 'REQUEST' && (
                            <Stack
                              sx={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px', padding: '5px 0px' }}
                              mt={1}
                              direction={'row'}
                              alignItems={'center'}
                              justifyContent={'space-between'}
                            >
                              <Stack direction={'row'} alignItems={'center'}>
                                <span
                                  className={getIcon(fileRequest) + ' icon-file-in-modal'}
                                  style={{ fontSize: '33px', minWidth: '40px' }}
                                />
                                <Typography variant="h6">
                                  {fileRequest?.fileName
                                    ? concatFileNameWithExtension(fileRequest?.fileName, fileRequest?.fileExtenstion)
                                    : fileRequest?.name}
                                </Typography>
                              </Stack>
                              <IconButton
                                onClick={(e) => {
                                  onDeleteFileUpload(e, index);
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Stack>
                          )
                      )}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    border={'1px dotted #aaa'}
                    minHeight={50}
                    justifyContent={'center'}
                    alignItems={'center'}
                    display={fileUploadRequest?.length <= 0 ? 'flex' : 'block'}
                    width={'100%'}
                    sx={{ overflowY: 'auto', padding: '5px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <Button
                        size="small"
                        onClick={(e) => {
                          seTypeFileUpload('REPLY');
                          onClickUploadFile(e);
                        }}
                        variant="text"
                        startIcon={<IconUpload />}
                      >
                        대책서 파일 첨부(Reply File)
                      </Button>
                    </div>
                    {fileUploadRequest?.length > 0 &&
                      fileUploadRequest.map(
                        (fileRequest, index) =>
                          fileRequest?.isShow &&
                          fileRequest?.typeFile === 'REPLY' && (
                            <Stack
                              sx={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px', padding: '5px 0px' }}
                              mt={1}
                              direction={'row'}
                              alignItems={'center'}
                              justifyContent={'space-between'}
                            >
                              <Stack direction={'row'} alignItems={'center'}>
                                <span
                                  className={getIcon(fileRequest) + ' icon-file-in-modal'}
                                  style={{ fontSize: '33px', minWidth: '40px' }}
                                />
                                <Typography variant="h6">
                                  {fileRequest?.fileName
                                    ? concatFileNameWithExtension(fileRequest?.fileName, fileRequest?.fileExtenstion)
                                    : fileRequest?.name}
                                </Typography>
                              </Stack>
                              <IconButton
                                onClick={(e) => {
                                  onDeleteFileUpload(e, index);
                                }}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Stack>
                          )
                      )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    width={'100%'}
                    display={listFilePreview?.length > 0 ? 'block' : 'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    minHeight={100}
                    border={'1px dotted #aaa'}
                  >
                    {listFilePreview?.length <= 0 && (
                      <Button
                        onClick={() => {
                          inputImageRef?.current.click();
                        }}
                        startIcon={<IconPhotoPlus />}
                        size="large"
                        color="primary"
                      >
                        Add image(NG)
                      </Button>
                    )}
                    <ImageList cols={3} variant="quilted" rowHeight={121}>
                      {listFilePreview?.length <= 0 ? null : (
                        <ImageListItem>
                          <Box display="flex" alignContent={'center'} justifyContent={'center'} width={'100%'} height={'100%'}>
                            <IconButton
                              onClick={() => {
                                inputImageRef?.current.click();
                              }}
                              color="primary"
                              size="large"
                            >
                              <IconPlus style={{ width: '60px', height: '60px' }} />
                            </IconButton>
                          </Box>
                        </ImageListItem>
                      )}
                      {listFilePreview?.length > 0 &&
                        listFilePreview.map((item, index) =>
                          item?.isShow ? (
                            <PhotoView key={index} src={item?.fileId ? showImageFromAPI(item?.fileUrl) : item?.fileUrl}>
                              <ImageListItem>
                                <img
                                  style={{ objectFit: 'contain' }}
                                  alt={item?.fileName}
                                  src={item?.fileId ? showImageFromAPI(item?.fileUrl) : item?.fileUrl}
                                  loading="lazy"
                                />
                                <ImageListItemBar
                                  sx={{
                                    background:
                                      'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                                  }}
                                  title={<Tooltip title={item?.fileName}>{item?.fileName}</Tooltip>}
                                  position="top"
                                  actionIcon={
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteImage(e, index);
                                      }}
                                      sx={{ color: 'white' }}
                                      aria-label={`star ${item?.fileName}`}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  }
                                  actionPosition="right"
                                />
                              </ImageListItem>
                            </PhotoView>
                          ) : null
                        )}
                    </ImageList>
                  </Box>
                </Grid>

                {/* grid container */}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="custom" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              startIcon={<IconDeviceFloppy />}
              autoFocus
              onClick={() => {
                onClickSave();
              }}
            >
              Save changes
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </PhotoProvider>
      <input
        style={{ display: 'none' }}
        name="images"
        multiple
        type="file"
        accept="image/*"
        ref={inputImageRef}
        onChange={onChangeInputImage}
      />
      <input style={{ display: 'none' }} name="files" multiple type="file" accept="*" ref={inputFileRef} onChange={onChangeInputFile} />
    </>
  );
}
