import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Divider,
  styled,
  IconButton,
  Stack,
  Grid,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  FormLabel,
  Typography,
  Menu,
  ListItemIcon
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from 'react-device-detect';
import config from 'config';
import { useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { useForm, Controller } from 'react-hook-form';
import { IconCaretDown, IconDeviceFloppy, IconFileDownload, IconSearch, IconUpload } from '@tabler/icons-react';
import { IconListSearch } from '@tabler/icons-react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LIST_STATUS } from 'views/management_mold/management_mold.service';
import { useRef } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { ShowConfirm } from 'ui-component/ShowDialog';
import { IconFileArrowLeft } from '@tabler/icons-react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    borderBottom: 'none'
  },
  '.MuiPaper-root': {
    maxWidth: '800px',
    minWidth: '400px'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },

  '& .MuiDialogTitle-root': {
    padding: '10px 15px'
  }
}));

const initialCompanyOBJ = {
  companyID: '',
  companyCode: ''
};

const currentDate = dayjs();
export default function ModalAddMold({ open, onClose, categories, onOpenModalSetting, setFormValues, typeModal, selected, afterSave }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const buttonSubmitRef = useRef();
  const inputRef = useRef();
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const {
    watch,
    handleSubmit,
    clearErrors,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      project: '',
      type: '',
      modelID: '',
      model: '',
      category: '',
      description: '',
      moldNo: '',
      manufacturer: initialCompanyOBJ,
      shipArea: initialCompanyOBJ,
      shipDate: currentDate,
      massCompany: initialCompanyOBJ,
      shipMassCompany: null,
      //양산업체입고
      modificationCompany: initialCompanyOBJ,
      outputEdit: null,
      receivingCompleted: null,
      wearingPlan: null,
      tryNo: '',
      developDate: null,
      historyEdit: ''
    }
  });

  useEffect(() => {
    if (open && selected) {
      const {
        outputJigID,
        historyTryNo,
        moldNo,
        tryNo,
        shipMassCompany,
        shipDate,
        outputEdit,
        historyEdit,
        receivingCompleted,
        manufacturer,
        shipArea,
        massCompany,
        modificationCompany,
        wearingPlan,
        developDate,
        model: {
          modelID,
          projectName,
          type,
          model,
          description,
          category: { categoryId, categoryName }
        }
      } = selected;

      setValue('modelID', modelID);
      setValue('project', projectName);
      setValue('type', type);
      setValue('model', model);
      setValue('category', categoryId);
      setValue('description', description);
      if (typeModal === 'EDIT') {
        setValue('moldNo', moldNo);
        setValue('tryNo', historyTryNo[0] ? historyTryNo[0].tryNum : '');
        setValue('historyEdit', historyTryNo[0] ? historyTryNo[0].remark : '');
        setValue('wearingPlan', historyTryNo[0] ? dayjs(historyTryNo[0]?.wearingPlan) : null);
        setValue('modificationCompany', historyTryNo[0] ? historyTryNo[0]?.modificationCompany : null);
        setValue('outputEdit', historyTryNo[0] ? dayjs(historyTryNo[0]?.outputEdit) : null);
        setValue('receivingCompleted', historyTryNo[0] ? dayjs(historyTryNo[0]?.receivingCompleted) : null);
      }

      setValue('shipMassCompany', dayjs(shipMassCompany));
      setValue('shipDate', dayjs(shipDate));
      setValue('manufacturer', manufacturer);
      setValue('shipArea', shipArea);
      setValue('developDate', developDate ? dayjs(developDate) : null);
      setValue('massCompany', massCompany);
    }
  }, [open]);

  useEffect(() => {
    if (setFormValues) {
      const { prop, value } = setFormValues;

      if (prop === 'model') {
        const {
          modelID,
          projectName,
          type,
          model,
          description,
          category: { categoryId, categoryName }
        } = value;
        setValue('modelID', modelID);
        setValue('project', projectName);
        setValue('type', type);
        setValue('model', model);
        setValue('category', categoryId);
        setValue('description', description);
      } else {
        setValue(prop, {
          companyID: value?.companyID,
          companyCode: value?.companyCode
        });
      }
    }
  }, [setFormValues]);
  const onDownloadSampleFile = async () => {
    handleCloseMenu();
    const response = await restApi.get(RouterApi.outputJigSampleFile, {
      responseType: 'arraybuffer'
    });
    // setLoading(false);
    if (response?.status === 200) {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `Sample_file.xlsx`);
    } else {
      toast.error('Download file fail!');
    }
  };
  const onSaveData = (data) => {
    ShowConfirm({
      title: typeModal === 'EDIT' ? 'Update' : 'Create new',
      message: typeModal === 'EDIT' ? 'Do you want to save changes?' : 'Do you want to create new record?',
      onOK: async () => {
        const url = typeModal === 'EDIT' ? RouterApi.updateOutputJig : RouterApi.addOutputJig;
        const res = await restApi.post(url, {
          ...data,
          outputJigID: selected?.outputJigID,
          moldNo: data?.moldNo ? `${data.moldNo}`.replaceAll('#', '') : null,
          tryNo: data?.tryNo ? parseInt(`${data.tryNo}`.replaceAll('T', '')) : null,
          historyTryNoId: selected?.historyTryNo[0] ? selected?.historyTryNo[0]?.historyTryNoId : ''
        });
        if (res?.status === 200) {
          toast.success(typeModal === 'EDIT' ? 'Saved changes successful!' : 'Create new successful!');
          handleClose();
          afterSave();
        } else {
          toast.error(res?.data?.message || 'Server Error!');
        }
      }
    });
  };
  const handleUploadExcelFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await restApi.post(RouterApi.outputJigImportExcelFile, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (response?.status === 200) {
      toast.success('Import successful!');
      handleClose();
      afterSave();
    } else {
      toast.error(res?.data?.message || 'Error while import file!');
    }
  };
  const onChangeInputImportExcel = (event) => {
    const file = event?.target?.files[0];
    event.target.value = null;
    event.target.files = null;
    if (file?.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      handleUploadExcelFile(file);
    } else {
      toast.error('Please choose a Excel file!');
    }
  };
  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    reset();
    onClose();
  };
  return (
    <>
      <BootstrapDialog fullScreen={isMobile} maxWidth={'lg'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          <Stack direction={'row'} alignItems={'center'}>
            <div style={{ marginRight: '5px' }}>{typeModal === 'EDIT' ? 'Update Infomation' : 'Create new'}</div>
          </Stack>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 6
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit((data) => onSaveData(data))}>
            <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
              <Stack p={2} sx={{ border: '1px dashed  #aaae' }} width={'100%'} spacing={3}>
                <Typography variant="h6" color={'primary'}>
                  발송처 등록(Nơi gửi hàng)
                </Typography>
                <Controller
                  name="model"
                  control={control}
                  rules={{ required: ' ' }}
                  render={({ field }) => (
                    <FormControl size="small" fullWidth error={!!errors.model} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">Model</InputLabel>
                      <OutlinedInput
                        fullWidth
                        {...field}
                        inputProps={{ readOnly: true }}
                        id="outlined-adornment-password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => {
                                onOpenModalSetting('MODEL', 'model');
                              }}
                              // onMouseDown={handleMouseDownPassword}
                              // onMouseUp={handleMouseUpPassword}
                              edge="end"
                            >
                              <IconListSearch />
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Model"
                      />
                    </FormControl>
                    //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                  )}
                />
                <FormControl size="small" fullWidth error={!!errors.category}>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Controller
                    name="category"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="category-select-label"
                        label="Category"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value); // Cập nhật giá trị cho react-hook-form
                          // Nếu cần thêm logic validateForm bạn có thể xử lý tại đây
                        }}
                      >
                        {categories?.map((item) => (
                          <MenuItem disabled key={item?.categoryId} value={item?.categoryId}>
                            {item?.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
                <Controller
                  name="project"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...field}
                      inputProps={{ readOnly: true }}
                      label="Project name"
                      variant="outlined"
                      error={!!errors.project}
                    />
                  )}
                />
                <Controller
                  name="type"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...field}
                      inputProps={{ readOnly: true }}
                      label="구분"
                      variant="outlined"
                      error={!!errors.type}
                    />
                  )}
                />
                <Controller
                  name="modelID"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      sx={{ display: 'none' }}
                      fullWidth
                      size="small"
                      {...field}
                      inputProps={{ readOnly: true }}
                      label="modelid"
                      variant="outlined"
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      inputProps={{ readOnly: true }}
                      fullWidth
                      size="small"
                      label="Description"
                      variant="outlined"
                      error={!!errors.description}
                    />
                  )}
                />
                <Controller
                  name="moldNo"
                  control={control}
                  rules={{
                    required: ' ',
                    pattern: {
                      value: /^[0-9]+$/, // Chấp nhận số nguyên hoặc số thập phân dương
                      message: ' '
                    }
                  }}
                  render={({ field }) => (
                    <FormControl error={!!errors.moldNo} fullWidth>
                      <InputLabel htmlFor="outlined-adornment-amount">Mold No.</InputLabel>
                      <OutlinedInput
                        size="small"
                        {...field}
                        id="outlined-adornment-amount"
                        startAdornment={<InputAdornment position="start">#</InputAdornment>}
                        label="Mold No."
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="manufacturer"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <FormControl size="small" fullWidth error={!!errors.manufacturer} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">제작업체(NSX)</InputLabel>
                      <OutlinedInput
                        fullWidth
                        {...field}
                        value={field.value?.companyCode || ''}
                        onChange={(e) => field.onChange({ ...field.value, companyCode: e.target.value })}
                        onBlur={(e) => field.onChange({ ...field.value, companyID: '' })}
                        id="outlined-adornment-password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              // onClick={handleClickShowPassword}
                              // onMouseDown={handleMouseDownPassword}
                              // onMouseUp={handleMouseUpPassword}
                              edge="end"
                              onClick={() => {
                                onOpenModalSetting('COMPANY', 'manufacturer');
                              }}
                            >
                              <IconListSearch />
                            </IconButton>
                          </InputAdornment>
                        }
                        label="제작업체(NSX)"
                      />
                    </FormControl>
                    //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                  )}
                />
                <Controller
                  name="shipArea"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <FormControl size="small" fullWidth error={!!errors.shipArea} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">발송지역(Nơi VC)</InputLabel>
                      <OutlinedInput
                        fullWidth
                        {...field}
                        value={field.value?.companyCode || ''}
                        onChange={(e) => field.onChange({ ...field.value, companyCode: e.target.value })}
                        onBlur={(e) => field.onChange({ ...field.value, companyID: '' })}
                        id="outlined-adornment-password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              // onClick={handleClickShowPassword}
                              // onMouseDown={handleMouseDownPassword}
                              // onMouseUp={handleMouseUpPassword}
                              edge="end"
                              onClick={() => {
                                onOpenModalSetting('COMPANY', 'shipArea');
                              }}
                            >
                              <IconListSearch />
                            </IconButton>
                          </InputAdornment>
                        }
                        label="발송지역(Nơi VC)"
                      />
                    </FormControl>
                    //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                  )}
                />
                <Controller
                  name="shipDate"
                  control={control}
                  rules={{ required: ' ' }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="출고 계획(Thời gian)"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        setValue('shipDate', newValue);
                      }}
                      format="YYYY/MM/DD"
                      views={['year', 'month', 'day']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!errors.shipDate
                        }
                      }}
                    />
                  )}
                />
              </Stack>
              <Stack width={'100%'} spacing={0}>
                <Stack p={2} sx={{ border: '1px dashed  #aaae', borderBottom: 0 }} width={'100%'} spacing={3}>
                  <Typography mt={4} variant="h6" color={'primary'}>
                    구매등록(Mua hàng)
                  </Typography>
                  <Controller
                    name="massCompany"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <FormControl size="small" fullWidth error={!!errors.massCompany} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">양산업체(Cty SX)</InputLabel>
                        <OutlinedInput
                          fullWidth
                          {...field}
                          value={field.value?.companyCode || ''}
                          onChange={(e) => field.onChange({ ...field.value, companyCode: e.target.value })}
                          onBlur={(e) => field.onChange({ ...field.value, companyID: '' })}
                          id="outlined-adornment-password"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                edge="end"
                                onClick={() => {
                                  onOpenModalSetting('COMPANY', 'massCompany');
                                }}
                              >
                                <IconListSearch />
                              </IconButton>
                            </InputAdornment>
                          }
                          label="양산업체(Cty SX)"
                        />
                      </FormControl>
                      //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                    )}
                  />
                </Stack>
                <Stack p={2} sx={{ border: '1px dashed  #aaae', borderBottom: 0 }} width={'100%'} spacing={1}>
                  <Typography variant="h6" color={'primary'}>
                    개발등록 (RnD)
                  </Typography>
                  <Controller
                    name="developDate"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        // label="개발등록 (RnD)"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          setValue('developDate', newValue);
                        }}
                        format="YYYY/MM/DD"
                        views={['year', 'month', 'day']}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: !!errors.developDate
                          }
                        }}
                      />
                    )}
                  />
                </Stack>

                <Stack p={2} sx={{ border: '1px dashed  #aaae' }} width={'100%'} spacing={2}>
                  <Typography variant="h6" color={'primary'}>
                    제조기술 등록(Sản xuất)
                  </Typography>
                  <Controller
                    name="shipMassCompany"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="양산업체입고"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          setValue('shipMassCompany', newValue);
                        }}
                        format="YYYY/MM/DD"
                        views={['year', 'month', 'day']}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: !!errors.shipMassCompany
                          }
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="modificationCompany"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <FormControl size="small" fullWidth error={!!errors.modificationCompany} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">수정업체(Nơi sửa)</InputLabel>
                        <OutlinedInput
                          fullWidth
                          {...field}
                          value={field.value?.companyCode || ''}
                          onChange={(e) => field.onChange({ ...field.value, companyCode: e.target.value })}
                          onBlur={(e) => field.onChange({ ...field.value, companyID: '' })}
                          id="outlined-adornment-password"
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                // onClick={handleClickShowPassword}
                                // onMouseDown={handleMouseDownPassword}
                                // onMouseUp={handleMouseUpPassword}
                                edge="end"
                                onClick={() => {
                                  onOpenModalSetting('COMPANY', 'modificationCompany');
                                }}
                              >
                                <IconListSearch />
                              </IconButton>
                            </InputAdornment>
                          }
                          label="수정업체(Nơi sửa)"
                        />
                      </FormControl>
                      //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                    )}
                  />
                  <Controller
                    name="outputEdit"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="수리 출고(Xuất kho sửa)"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          setValue('outputEdit', newValue);
                        }}
                        format="YYYY/MM/DD"
                        views={['year', 'month', 'day']}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: !!errors.outputEdit
                          }
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="wearingPlan"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="입고 계획(K.Hoạch sửa xong)"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          setValue('wearingPlan', newValue);
                        }}
                        format="YYYY/MM/DD"
                        views={['year', 'month', 'day']}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: !!errors.wearingPlan
                          }
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="receivingCompleted"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="입고 완료(Thực tế sửa xong)"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          setValue('receivingCompleted', newValue);
                        }}
                        format="YYYY/MM/DD"
                        views={['year', 'month', 'day']}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: !!errors.receivingCompleted
                          }
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="tryNo"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[0-9]+$/, // Chấp nhận số nguyên hoặc số thập phân dương
                        message: ' '
                      }
                    }}
                    render={({ field }) => (
                      <FormControl error={!!errors.tryNo} fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount">Try No.</InputLabel>
                        <OutlinedInput
                          size="small"
                          {...field}
                          readOnly={true}
                          id="outlined-adornment-amount"
                          startAdornment={<InputAdornment position="start">T</InputAdornment>}
                          label="Try No."
                        />
                      </FormControl>

                      // <TextField fullWidth size="small" {...field} label="Try No" variant="outlined" error={!!errors.tryNo} />
                    )}
                  />
                  <Controller
                    name="historyEdit"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        multiline
                        rows={2}
                        fullWidth
                        size="small"
                        {...field}
                        label="수정내역(Nội dung chỉnh sửa)"
                        variant="outlined"
                        error={!!errors.historyEdit}
                      />
                    )}
                  />
                </Stack>
              </Stack>
            </Stack>
            <Button ref={buttonSubmitRef} type="submit" hidden sx={{ display: 'none' }} variant="contained">
              Save Changes
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack sx={{ width: '100%' }} direction={'row'} justifyContent={typeModal === 'ADD' ? 'space-between' : 'flex-end'}>
            {typeModal === 'ADD' && (
              <Button variant="custom" startIcon={<IconFileArrowLeft />} onClick={handleClick} endIcon={<IconCaretDown />}>
                Import Excel
              </Button>
            )}
            <Stack direction={'row'} spacing={2}>
              <Button variant="custom" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<IconDeviceFloppy />}
                autoFocus
                onClick={() => {
                  buttonSubmitRef?.current?.click();
                }}
              >
                Save changes
              </Button>
            </Stack>
          </Stack>
          <input ref={inputRef} type="file" hidden accept=".xlsx, .xls" onChange={onChangeInputImportExcel} />
        </DialogActions>
      </BootstrapDialog>
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            inputRef?.current?.click();
          }}
        >
          <ListItemIcon>
            <IconUpload />
          </ListItemIcon>
          Upload file
        </MenuItem>
        <MenuItem onClick={onDownloadSampleFile}>
          <ListItemIcon>
            <IconFileDownload />
          </ListItemIcon>
          Sample file
        </MenuItem>
      </Menu>
    </>
  );
}
