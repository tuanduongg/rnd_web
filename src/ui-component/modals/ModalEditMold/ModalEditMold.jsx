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
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useEffect } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import Loading from 'ui-component/Loading';
import { ShowConfirm } from 'ui-component/ShowDialog';
import { IconDeviceFloppy, IconPlus, IconTransferIn } from '@tabler/icons-react';
import { isMobile } from 'react-device-detect';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { IconBackspace } from '@tabler/icons-react';
import { IconTrash } from '@tabler/icons-react';
import { IconCirclePlus } from '@tabler/icons-react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    borderBottom: 'none'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },
  '& .MuiDialogTitle-root': {
    padding: '10px 15px'
  }
}));
const currentDayJS = dayjs();
const initialValueForm = {
  assetNo: '',
  category: '',
  model: '',
  productName: '',
  version: '',
  edition: '',
  SFC: '',
  code: '',
  company: '',
  weight: '',
  size: '',
  inputDate: currentDayJS,
  maker: '',
  type: '',
  material: '',
  location: ''
};
const listValidate = ['assetNo', 'category', 'model', 'productName', 'version', 'edition', 'SFC', 'code', 'location'];
const initialValiDateForm = {
  assetNo: { error: false },
  category: { error: false },
  model: { error: false },
  productName: { error: false },
  version: { error: false },
  edition: { error: false },
  SFC: { error: false },
  code: { error: false },
  company: { error: false },
  weight: { error: false },
  size: { error: false },
  inputDate: { error: false },
  maker: { error: false },
  type: { error: false },
  material: { error: false },
  location: { error: false }
};
const initvalidate = { error: false };
const initvalueInOutJIG = {
  location: '',
  isShow: true,
  date: currentDayJS,
  isFirstInput: '',
  type: 'IN'
};
const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
];
export default function ModalEditMold({ open, onClose, selectedRow, typeModal, afterSave, setLoading }) {
  const theme = useTheme();
  const [valueForm, setValueForm] = useState(initialValueForm);
  const [arrInOutJig, setArrInOutJig] = useState([]);
  const [validateForm, setValidateForm] = useState(initialValiDateForm);

  const onChangeInput = (event) => {
    const { name, value } = event.target;
    if (validateForm[name]?.error) {
      setValidateForm((pre) => ({ ...pre, [name]: initvalidate }));
    }
    setValueForm((pre) => ({ ...pre, [name]: value }));
  };

  const getAllInOutJig = async () => {
    const res = await restApi.post(RouterApi.findInOutJigByJig, { jigId: selectedRow?.jigId });
    if (res?.status === 200) {
      const data = res?.data;
      if (data?.length > 0) {
        const newArr = data.map((item) => {
          return { ...item, date: dayjs(item?.date), error: false, isShow: true };
        });
        setArrInOutJig(newArr);
      }
    }
  };

  useEffect(() => {
    if (open && selectedRow && typeModal === 'EDIT') {
      getAllInOutJig();
      setValueForm({
        assetNo: selectedRow?.assetNo,
        category: selectedRow?.category,
        model: selectedRow?.model,
        productName: selectedRow?.productName,
        version: selectedRow?.version,
        edition: selectedRow?.edition,
        SFC: selectedRow?.SFC,
        code: selectedRow?.code,
        company: selectedRow?.company,
        weight: selectedRow?.weight,
        size: selectedRow?.size,
        maker: selectedRow?.maker,
        type: selectedRow?.type,
        material: selectedRow?.material,
        location: selectedRow?.location
      });
    }
  }, [open]);
  const onSave = () => {
    let check = false;
    let inoutFlag = false;
    Object.keys(valueForm).map((key, index) => {
      if (listValidate.includes(key) && !valueForm[key]) {
        check = true;
        setValidateForm((pre) => ({ ...pre, [key]: { error: true } }));
      }
    });
    if (typeModal === 'EDIT') {
      const newArr = arrInOutJig.map((item) => {
        let checkInout = false;
        if (item?.location?.trim() === '') {
          checkInout = true;
          inoutFlag = true;
        }
        if (!dayjs(item?.date).isValid()) {
          checkInout = true;
          inoutFlag = true;
        }
        return { ...item, error: checkInout };
      });
      setArrInOutJig(newArr);
    }
    if ((!check && typeModal === 'ADD') || (!inoutFlag && typeModal === 'EDIT')) {
      ShowConfirm({
        title: typeModal === 'EDIT' ? 'Update' : 'Create New',
        message: 'Do you want to save changes?',
        onOK: async () => {
          setLoading(true);
          let url = typeModal === 'EDIT' ? RouterApi.updateJIG : RouterApi.addJIG;
          const res = await restApi.post(url, {
            data: JSON.stringify({ valueForm: { ...valueForm, jigId: selectedRow?.jigId ?? '' }, arrInOutJig })
          });
          setLoading(false);
          if (res?.status === 200) {
            toast.success('Saved changes successful!');
            handleClose();
            afterSave();
          } else {
            toast.error(res?.data?.message || 'Server Error!');
          }
        }
      });
    }
  };
  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    setValueForm(initialValueForm);
    setValidateForm(initialValiDateForm);
    setArrInOutJig([]);
    onClose();
  };
  const onClickAdd = (index) => {
    const newArr = insert(arrInOutJig, index + 1, initvalueInOutJIG);
    setArrInOutJig(newArr);
  };
  const onClickDelete = (index) => {
    const newArr = arrInOutJig.map((item, i) => {
      return { ...item, isShow: i === index ? false : item?.isShow };
    });
    setArrInOutJig(newArr);
  };

  const onChangeInOutSelect = (event, index) => {
    const newArr = arrInOutJig.map((item, i) => {
      if (i === index) {
        return { ...item, type: event.target.value, error: false };
      }
      return item;
    });
    setArrInOutJig(newArr);
  };
  const onChangeDateInOut = (newValue, index) => {
    const newArr = arrInOutJig.map((item, i) => {
      if (i === index) {
        return { ...item, date: newValue, error: false };
      }
      return item;
    });
    setArrInOutJig(newArr);
  };
  const onChangeLocation = (e, index) => {
    const newArr = arrInOutJig.map((item, i) => {
      if (i === index) {
        return { ...item, location: e.target.value, error: false };
      }
      return item;
    });
    setArrInOutJig(newArr);
  };

  return (
    <>
      <BootstrapDialog fullScreen={isMobile} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          {typeModal === 'ADD' ? 'Create New' : 'Update Infomation'}
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
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.assetNo?.error}
                  onChange={onChangeInput}
                  value={valueForm?.assetNo}
                  name="assetNo"
                  label="Asset No."
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  // disabled={typeModal === 'EDIT'}
                  error={validateForm?.category?.error}
                  onChange={onChangeInput}
                  name="category"
                  value={valueForm?.category}
                  label="Phân Loại"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.model?.error}
                  onChange={onChangeInput}
                  value={valueForm?.model}
                  name="model"
                  label="Model"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.productName?.error}
                  onChange={onChangeInput}
                  value={valueForm?.productName}
                  name="productName"
                  label="Production Name"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={3.5}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.version?.error}
                  onChange={onChangeInput}
                  value={valueForm?.version}
                  name="version"
                  label="Version"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={3.5}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.edition?.error}
                  onChange={onChangeInput}
                  value={valueForm?.edition}
                  name="edition"
                  label="Edition"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={5}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.SFC?.error}
                  onChange={onChangeInput}
                  value={valueForm?.SFC}
                  name="SFC"
                  label="S*F*C"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.code?.error}
                  onChange={onChangeInput}
                  value={valueForm?.code}
                  name="code"
                  label="Code"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.company?.error}
                  onChange={onChangeInput}
                  value={valueForm?.company}
                  name="company"
                  label="Company"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.weight?.error}
                  onChange={onChangeInput}
                  value={valueForm?.weight}
                  name="weight"
                  label="Weight"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.size?.error}
                  onChange={onChangeInput}
                  value={valueForm?.size}
                  name="size"
                  label="Size"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.maker?.error}
                  onChange={onChangeInput}
                  value={valueForm?.maker}
                  name="maker"
                  label="Maker"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.type?.error}
                  onChange={onChangeInput}
                  value={valueForm?.type}
                  name="type"
                  label="Type"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <TextField
                  error={validateForm?.material?.error}
                  onChange={onChangeInput}
                  value={valueForm?.material}
                  name="material"
                  label="Material"
                  size="small"
                  variant="outlined"
                />
              </FormControl>
            </Grid>
            {typeModal === 'ADD' && (
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <TextField
                    error={validateForm?.location?.error}
                    onChange={onChangeInput}
                    value={valueForm?.location}
                    name="location"
                    label="Vị trí"
                    size="small"
                    variant="outlined"
                  />
                </FormControl>
              </Grid>
            )}
            {typeModal === 'ADD' && (
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <DatePicker
                    value={valueForm?.inputDate}
                    format="YYYY/MM/DD"
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: { size: 'small' }
                      //   popper: { placement: 'right-end' }
                    }}
                    onChange={(newValue) => {
                      if (validateForm['inputDate'].error) {
                        setValidateForm((pre) => ({ ...pre, inputDate: { error: false } }));
                      }
                      setValueForm((pre) => ({ ...pre, inputDate: newValue }));
                    }}
                    label="Input Date"
                    placeholder="Input Date..."
                    size="small"
                  />
                </FormControl>
              </Grid>
            )}
            {typeModal === 'EDIT' && (
              <Grid item xs="12">
                <Typography>Input/Output Infomation</Typography>
              </Grid>
            )}
            {arrInOutJig?.length > 0 && typeModal === 'EDIT'
              ? arrInOutJig.map(
                  (item, index) =>
                    item?.isShow && (
                      <>
                        <Grid item xs={2.5}>
                          <FormControl error={item?.error} size="small" fullWidth>
                            <InputLabel id="demo-simple-select-label">Type</InputLabel>
                            <Select
                              value={item?.type}
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              label="Type"
                              onChange={(event) => {
                                onChangeInOutSelect(event, index);
                              }}
                            >
                              <MenuItem value={'IN'}>Input</MenuItem>
                              <MenuItem value={'OUT'}>Output</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                          <FormControl fullWidth size="small">
                            <DatePicker
                              value={item?.date}
                              format="YYYY/MM/DD"
                              views={['year', 'month', 'day']}
                              slotProps={{
                                textField: { size: 'small', error: item?.error }
                                //   popper: { placement: 'right-end' }
                              }}
                              onChange={(newValue) => {
                                onChangeDateInOut(newValue, index);
                              }}
                              label="Date"
                              placeholder="Date..."
                              size="small"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl fullWidth size="small">
                            <TextField
                              error={item?.error}
                              onChange={(e) => {
                                onChangeLocation(e, index);
                              }}
                              value={item?.location}
                              name="location"
                              label="Vị trí"
                              size="small"
                              variant="outlined"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={0.75}>
                          <IconButton
                            onClick={() => {
                              onClickAdd(index);
                            }}
                            size="small"
                            color="primary"
                          >
                            <IconCirclePlus />
                          </IconButton>
                        </Grid>
                        <Grid item xs={0.75}>
                          <IconButton
                            disabled={arrInOutJig?.filter((item) => item?.isShow).length === 1}
                            onClick={() => {
                              onClickDelete(index);
                            }}
                            size="small"
                            color="error"
                          >
                            <IconTrash />
                          </IconButton>
                        </Grid>
                      </>
                    )
                )
              : null}
          </Grid>
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
              onSave();
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
