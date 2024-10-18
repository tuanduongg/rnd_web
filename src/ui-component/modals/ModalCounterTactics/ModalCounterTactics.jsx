import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import * as Yup from 'yup';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
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
import { IconDeviceFloppy, IconInfoCircle, IconPlus, IconUpload } from '@tabler/icons-react';
import { isMobile } from 'react-device-detect';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import config from 'config';
import { DatePicker } from '@mui/x-date-pickers';
import { IconPhotoPlus } from '@tabler/icons-react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { getIcon } from '../ModalConcept/modal_concept.service';
import './modal_countertactics.css';
import 'file-icons-js/css/style.css';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import {
  initValidate,
  inititalValueForm,
  inititalValidateForm,
  arrNoValidate,
  listObjDate,
  arrFieldNum
} from './modal_countertactics.service';
import { concatFileNameWithExtension, cssScrollbar, formatNumberWithCommas, showImageFromAPI } from 'utils/helper';
import toast from 'react-hot-toast';
import { ShowConfirm } from 'ui-component/ShowDialog';
import dayjs from 'dayjs';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

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
  const inputImageRef = useRef();
  const inputFileRef = useRef();
  const buttonSubmit = useRef();
  const pasteAreaRef = useRef(null); // Ref đến vùng cụ thể để paste
  const customization = useSelector((state) => state.customization);

  const {
    watch,
    handleSubmit,
    clearErrors,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: inititalValueForm
  });
  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    setListFilePreview([]);
    setListImageUpload([]);
    setFileUploadRequest([]);
    reset();
    onClose();
  };

  const findByCode = async () => {
    if (typeModal === 'EDIT' || typeModal === 'VIEW') {
      return;
    }
    const codeReq = `${codeValue}`.trim();
    // setLoading(true);
    const res = await restApi.post(RouterApi.conceptFindByCode, { code: codeReq });
    // setLoading(false);
    if (res?.status === 200) {
      const { modelName, productName, plName, category } = res?.data;

      setValue('model', modelName);
      setValue('item', productName);
      setValue('plName', plName);
      setValue('category', category?.categoryId);

      clearErrors(['model', 'item', 'plName', 'category']);
    }
  };

  // Theo dõi giá trị của code
  const codeValue = watch('code');
  const dateValue = watch('date');

  useEffect(() => {
    if (dateValue?.isValid()) {
      const currentWeek = dateValue.week();
      const week = currentWeek < 10 ? `0${currentWeek}` : currentWeek;
      setValue('week', week);
    }
  }, [dateValue]);
  useEffect(() => {
    // Kiểm tra nếu length của code >= 10, gọi API
    if (codeValue.length >= 11) {
      findByCode();
    }
  }, [codeValue]);

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

      setListImageUpload(imageArr);
      setFileUploadRequest(fileArr);
    }
  };
  useEffect(() => {
    if (open) {
      getCategories();
      if (typeModal !== 'ADD' && selected) {
        getMedia(selected?.reportId);
        const fields = {
          shift: selected?.shift,
          author: selected?.author,
          week: selected?.week,
          date: selected?.time ? dayjs(selected?.time) : null,
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
          seowonStock: selected?.seowonStock ? formatNumberWithCommas(selected?.seowonStock.toString()) : '',
          vendorStock: selected?.vendorStock ? formatNumberWithCommas(selected?.vendorStock.toString()) : '',
          tempSolution: selected?.tempSolution,
          techNg: selected?.techNG,
          remark: selected?.remark,
          requestDate: selected?.dateRequest ? dayjs(selected?.dateRequest) : null,
          replyDate: selected?.dateReply ? dayjs(selected?.dateReply) : null
        };

        // Duyệt qua tất cả các field và set giá trị
        Object.entries(fields).forEach(([key, value]) => {
          setValue(key, value); // setValue từ react-hook-form
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
    const fileDelete = listImageUpload[index];
    let newArr = [];
    if (fileDelete?.fileId) {
      newArr = listImageUpload.map((item, i) => {
        if (i === index) {
          item['isShow'] = false;
        }
        return item;
      });
    } else {
      newArr = listImageUpload.filter((item, i) => i !== index);
    }
    setListImageUpload(newArr);
  };
  const onChangeInputImage = (e) => {
    const files = e.target.files;
    // const numFile = listImageUpload.filter((item) => item?.isShow).length + files?.length;
    // if (files?.length > config?.maxFileUpload || numFile > config?.maxFileUpload) {
    //   e.target.value = null;
    //   e.target.files = null;
    //   toast.error(`Allow upload max: ${config?.maxFileUpload} files!`);
    //   return;
    // }

    const arrNewFile = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      element['isShow'] = true;
      arrNewFile.push(element);
    }
    console.log('arrNewFile', arrNewFile);
    setListImageUpload((pre) => pre.concat(arrNewFile));
    e.target.value = null;
    e.target.files = null;
  };
  const onClickUploadFile = (e) => {
    inputFileRef.current.click();
  };

  const onDeleteFileUpload = (e, index) => {
    const fileDelete = fileUploadRequest[index];
    let newArr = [];
    if (fileDelete?.fileId) {
      newArr = fileUploadRequest.map((item, i) => {
        if (i === index) {
          item['isShow'] = false;
        }
        return item;
      });
    } else {
      newArr = fileUploadRequest.filter((item, i) => i !== index);
    }
    setFileUploadRequest(newArr);
  };
  const onClickSave = async () => {
    buttonSubmit.current.click();
    // let check = false;
    // Object.keys(valueForm).map((key, index) => {
    //   if (listObjDate?.includes(key)) {
    //     if (!arrNoValidate.includes(key) && (!valueForm[key] || !valueForm[key]?.isValid())) {
    //       check = true;
    //       setValidateForm((pre) => ({ ...pre, [key]: { error: true, msg: 'This field is requried!' } }));
    //     }
    //   } else {
    //     if (`${valueForm[key]}`.trim() === '' && !arrNoValidate.includes(key)) {
    //       check = true;
    //       setValidateForm((pre) => ({ ...pre, [key]: { error: true, msg: 'This field is requried!' } }));
    //     }
    //   }
    // });

    // if (!check) {

    // }
  };
  const onSaveData = (data) => {
    ShowConfirm({
      title: 'Create New',
      message: 'Do you want to save changes?',
      onOK: async () => {
        const dataSend = {
          ...data,
          seowonStock: `${data?.seowonStock}`.replaceAll(',', ''),
          vendorStock: `${data?.vendorStock}`.replaceAll(',', '')
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
  };
  const handlePasteImage = async (event) => {
    if (document.activeElement === pasteAreaRef.current) {
      const clipboardItems = event.clipboardData.items;
      for (let i = 0; i < clipboardItems.length; i++) {
        const item = clipboardItems[i];

        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          file['isShow'] = true;
          setListImageUpload((pre) => [...pre, file]);
        }
      }
    }
  };
  const onClickAddImages = () => {
    inputImageRef?.current.click();
    // handlePasteImage();
  };
  useEffect(() => {
    window.addEventListener('paste', handlePasteImage);

    return () => {
      window.removeEventListener('paste', handlePasteImage);
    };
  }, []);
  const handleFocusBoxPaste = () => {
    // Chỉ lắng nghe sự kiện paste khi vùng này có focus
  };

  const handleBlurBoxPaste = () => {
    // Ngừng lắng nghe sự kiện paste khi vùng này mất focus
  };
  const onChangeInputFile = (e) => {
    const files = e.target.files;
    // const numFile = fileUploadRequest.filter((item) => item?.isShow)?.length + files?.length;

    // if (files?.length > config?.maxFileUpload || numFile > config?.maxFileUpload) {
    //   e.target.value = null;
    //   e.target.files = null;
    //   toast.error(`Allow upload max: ${config?.maxFileUpload} files!`);
    //   return;
    // }

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
  const getTitleFromImage = (index) => {
    const find = listFilePreview?.find((item, i) => i === index);
    if (find) {
      return concatFileNameWithExtension(find?.fileName, find?.fileExtenstion);
    }
    return '';
  };
  return (
    <>
      <PhotoProvider
        maskOpacity={0.5}
        toolbarRender={({ rotate, onRotate, index }) => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              <span style={{ marginRight: '10px' }}>{getTitleFromImage(index)}</span>

              <IconButton
                className="PhotoView-Slider__toolbarIcon color-icon"
                onClick={() => {
                  onRotate(rotate - 90);
                  getTitleFromImage(index);
                }}
                size="small"
              >
                <RotateLeftIcon />
              </IconButton>
              <IconButton className="PhotoView-Slider__toolbarIcon color-icon" onClick={() => onRotate(rotate + 90)} size="small">
                <RotateRightIcon />
              </IconButton>
            </Stack>
          );
        }}
        maskClosable={true}
      >
        <BootstrapDialog fullScreen={isMobile} maxWidth={'md'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
            <Stack direction={'row'} alignItems={'center'}>
              {typeModal === 'ADD' ? 'Create New' : typeModal === 'EDIT' ? 'Edit Infomation' : 'Detail'}
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
          <DialogContent sx={{ ...cssScrollbar }}>
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit((data) => onSaveData(data))}>
              <Grid container spacing={2}>
                <Grid item xs={4.5} >
                  <Controller
                    name="shift"
                    control={control}
                    rules={{ required: ' ' }}
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        row

                        sx={{ border: '1px solid #bdbdbd', paddingLeft: 2, borderRadius: `${customization.borderRadius}px`, backgroundColor: '#f8fafc' }}
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="radio-buttons-group"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        <Stack maxHeight={38} direction={'row'} spacing={1} alignItems={'center'}>
                          <span style={{ fontWeight: 'bold' }}>Shift:</span>
                          <FormControlLabel value="D" control={<Radio />} label="Day" />
                          <FormControlLabel value="N" control={<Radio />} label="Night" />
                        </Stack>
                      </RadioGroup>
                    )}
                  />
                </Grid>
                <Grid item xs={2}>
                  <Controller
                    name="week"
                    control={control}
                    rules={{ required: ' ' }}
                    render={({ field }) => <TextField size="small" {...field} label="Week" variant="outlined" error={!!errors.week} />}
                  />
                </Grid>
                <Grid item xs={5.5}>
                  <Controller
                    name="date"
                    control={control}
                    rules={{ required: ' ' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => field.onChange(newValue)}
                        format="YYYY/MM/DD"
                        views={['year', 'month', 'day']}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            // helperText: errors.date ? errors.date.message : '',
                            error: !!errors.date
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl size="small" fullWidth error={!!errors.category}>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: ' ' }}
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
                          disabled={typeModal === 'VIEW'}
                        >
                          {categories?.map((item) => (
                            <MenuItem key={item?.categoryId} value={item?.categoryId}>
                              {item?.categoryName}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3.5}>
                  <Controller
                    name="ngName"
                    control={control}
                    rules={{ required: ' ' }}
                    render={({ field }) => (
                      <TextField
                        placeholder="Tên lỗi..."
                        size="small"
                        {...field}
                        label="불량명(Tên Lỗi)"
                        variant="outlined"
                        error={!!errors.ngName}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={2.5}>
                  <Controller
                    name="percentage"
                    control={control}
                    rules={{
                      required: ' ',
                      pattern: {
                        value: /^[0-9]+(\.[0-9]+)?$/, // Chấp nhận số nguyên hoặc số thập phân dương
                        message: ' '
                      }
                    }}
                    render={({ field }) => (
                      <FormControl error={!!errors.percentage} fullWidth size="small" variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">Tỷ lệ</InputLabel>
                        <OutlinedInput
                          size="small"
                          placeholder="Tỷ lệ..."
                          name="percentage"
                          {...field}
                          fullWidth
                          error={!!errors.percentage}
                          endAdornment={<InputAdornment position="end">%</InputAdornment>}
                          label="Tỷ lệ"
                        />
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="code"
                    control={control}
                    rules={{ required: ' ' }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        placeholder="Code..."
                        size="small"
                        {...field}
                        label={'Code'}
                        variant="outlined"
                        error={!!errors.code}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={3.5}>
                  <FormControl error={!!errors.process} fullWidth size="small">
                    <InputLabel htmlFor="demo-simple-select-proces" id="demo-simple-select-label">
                      부적합 통보(BP Thông Báo)
                    </InputLabel>
                    <Controller
                      name="process"
                      control={control}
                      rules={{ required: ' ' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="category-select-label"
                          label="부적합 통보(BP Thông Báo)"
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.value); // Cập nhật giá trị cho react-hook-form
                            // Nếu cần thêm logic validateForm bạn có thể xử lý tại đây
                          }}
                        >
                          {listProcess?.map((item) => (
                            <MenuItem key={item?.processId} value={item?.processId}>
                              {item?.processName}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={2.5}>
                  <Controller
                    name="author"
                    control={control}
                    rules={{ required: ' ' }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        placeholder="Người đăng ký..."
                        size="small"
                        {...field}
                        label="등록자"
                        variant="outlined"
                        error={!!errors.author}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name="model"
                    control={control}
                    rules={{ required: ' ' }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        placeholder="Model..."
                        size="small"
                        {...field}
                        label="Model"
                        variant="outlined"
                        error={!!errors.model}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name="supplier"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        placeholder="Khách hàng..."
                        size="small"
                        {...field}
                        label="고객(Khách hàng)"
                        variant="outlined"
                        error={!!errors.supplier}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name="plName"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        placeholder="PL/NAME..."
                        size="small"
                        {...field}
                        label="PL/NAME"
                        variant="outlined"
                        error={!!errors.plName}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name="attributable"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        placeholder="귀책처(Chịu trách nhiệm)..."
                        size="small"
                        {...field}
                        label="귀책처(Chịu trách nhiệm)"
                        variant="outlined"
                        error={!!errors.attributable}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name="item"
                    control={control}
                    rules={{ required: ' ' }}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        placeholder="Item..."
                        size="small"
                        {...field}
                        label="Item"
                        variant="outlined"
                        error={!!errors.item}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Controller
                    name="representative"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        placeholder="Đại diện nhà cung cấp..."
                        size="small"
                        {...field}
                        label="공급 업체 담당자(Đại diện NCC)"
                        variant="outlined"
                        error={!!errors.representative}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="seowonStock"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        type="text"
                        fullWidth
                        placeholder="Seowon stock..."
                        size="small"
                        {...field}
                        label="Seowon stock"
                        variant="outlined"
                        value={field.value ? formatNumberWithCommas(field.value.toString()) : ''}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/,/g, ''); // Xóa dấu phẩy cũ
                          if (!isNaN(Number(inputValue)) || inputValue === '') {
                            field.onChange(inputValue); // Cập nhật giá trị mới sau khi loại bỏ dấu phẩy
                          }
                        }}
                        error={!!errors.seowonStock}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="vendorStock"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <TextField
                        fullWidth
                        placeholder="Vendor stock..."
                        size="small"
                        {...field}
                        label="Vendor stock"
                        variant="outlined"
                        value={field.value ? formatNumberWithCommas(field.value.toString()) : ''}
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/,/g, ''); // Xóa dấu phẩy cũ
                          if (!isNaN(Number(inputValue)) || inputValue === '') {
                            field.onChange(inputValue); // Cập nhật giá trị mới sau khi loại bỏ dấu phẩy
                          }
                        }}
                        error={!!errors.vendorStock}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="techNg"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <>
                        <FormControl error={!!errors.techNg} fullWidth size="small" variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-password">불량원인 (Nguyên nhân lỗi)</InputLabel>
                          <OutlinedInput
                            {...field}
                            multiline
                            rows={3}
                            placeholder="Nguyên nhân lỗi..."
                            name="techNg"
                            error={!!errors.techNg}
                            label="불량원인 (Nguyên nhân lỗi)"
                          />
                        </FormControl>
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="tempSolution"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <>
                        <FormControl error={!!errors.tempSolution} fullWidth size="small" variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-password">임시조치(Biện pháp)</InputLabel>
                          <OutlinedInput
                            {...field}
                            multiline
                            rows={3}
                            error={!!errors.tempSolution}
                            placeholder="Biện pháp..."
                            name="tempSolution"
                            label="임시조치(Biện pháp)"
                          />
                        </FormControl>
                      </>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="remark"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <>
                        <FormControl error={!!errors.remark} fullWidth size="small" variant="outlined">
                          <InputLabel htmlFor="outlined-adornment-password">조치사항 (Đã thực hiện)</InputLabel>
                          <OutlinedInput
                            {...field}
                            disabled={typeModal === 'VIEW'}
                            error={!!errors.remark}
                            multiline
                            rows={3}
                            placeholder="Đã thực hiện..."
                            name="remark"
                            label="조치사항 (Đã thực hiện)"
                          />
                        </FormControl>
                      </>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="requestDate"
                    control={control}
                    rules={{ required: ' ' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Request Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => field.onChange(newValue)}
                        format="YYYY/MM/DD"
                        views={['year', 'month', 'day']}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: !!errors.requestDate
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="replyDate"
                    control={control}
                    rules={{}}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        label="Reply Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => field.onChange(newValue)}
                        format="YYYY/MM/DD"
                        views={['year', 'month', 'day']}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: 'small',
                            error: !!errors.replyDate
                          }
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Box
                    border={'1px dotted #aaa'}
                    borderRadius={`${customization.borderRadius}px`}
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
                        부적합통보서 (QPN)
                      </Button>
                    </div>
                    {fileUploadRequest?.length > 0 &&
                      fileUploadRequest.map(
                        (fileRequest, index) =>
                          fileRequest?.isShow &&
                          fileRequest?.typeFile === 'REQUEST' && (
                            <Stack
                              sx={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px', padding: '5px 0px', borderRadius: `${customization.borderRadius}px` }}
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
                                <Typography sx={{ wordBreak: 'break-all' }} variant="h6">
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
                    borderRadius={`${customization.borderRadius}px`}
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
                        대책서 (đối sách)
                      </Button>
                    </div>
                    {fileUploadRequest?.length > 0 &&
                      fileUploadRequest.map(
                        (fileRequest, index) =>
                          fileRequest?.isShow &&
                          fileRequest?.typeFile === 'REPLY' && (
                            <Stack
                              sx={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 0px 0px 1px', padding: '5px 0px', borderRadius: `${customization.borderRadius}px` }}
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
                                <Typography sx={{ wordBreak: 'break-all' }} variant="h6">
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
                    ref={pasteAreaRef}
                    tabIndex={0} // Make Box focusable
                    width={'100%'}
                    display={listFilePreview?.length > 0 ? 'block' : 'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    minHeight={100}
                    border={'1px dotted #aaa'}
                    borderRadius={`${customization.borderRadius}px`}
                  >
                    {listFilePreview?.length <= 0 && (
                      <Tooltip title="Click để tải ảnh lên từ thiết bị hoặc click vào khoảng trắng và dán ảnh đã sao chép">
                        <Button onClick={onClickAddImages} startIcon={<IconPhotoPlus />} size="large" color="primary">
                          Add image(NG)
                        </Button>
                      </Tooltip>
                    )}
                    <ImageList cols={3} variant="quilted" rowHeight={121}>
                      {listFilePreview?.length <= 0 ? null : (
                        <ImageListItem>
                          <Box display="flex" alignContent={'center'} justifyContent={'center'} width={'100%'} height={'100%'}>
                            <Tooltip title="Click để tải ảnh lên từ thiết bị hoặc click vào khoảng trắng và dán ảnh đã sao chép">
                              <IconButton
                                onClick={() => {
                                  inputImageRef?.current.click();
                                }}
                                color="primary"
                                size="large"
                              >
                                <IconPlus style={{ width: '60px', height: '60px' }} />
                              </IconButton>
                            </Tooltip>
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
              <Button ref={buttonSubmit} hidden sx={{ display: 'none' }} type="submit" variant="contained">
                Submit
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="custom" onClick={handleClose}>
              Close
            </Button>
            {typeModal !== 'VIEW' && (
              <Button
                variant="contained"
                startIcon={<IconDeviceFloppy />}
                autoFocus
                onClick={() => {
                  onClickSave();
                }}
              >
                Save
              </Button>
            )}
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
