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
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  InputAdornment,
  Typography
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import config from 'config';
import { useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { useForm, Controller } from 'react-hook-form';
import { IconDeviceFloppy, IconSearch } from '@tabler/icons-react';
import { IconListSearch } from '@tabler/icons-react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { ShowConfirm } from 'ui-component/ShowDialog';
import { TABLE_ADD_AFTER, TABLE_ADD_BEFORE } from './ListTab';

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
export default function ModalAddNewData({
  open,
  onClose,
  afterSave,
  typeTable,
  typeModal,
  selectedRowBefore,
  selectedRowAfter,
  setLoading
}) {
  const buttonSubmitRef = useRef();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      type: '',
      project: '',
      model: '',
      productName: '',
      level: '',
      asset: '',
      cvt: '',
      massProduct: '',
      currentLocation: '',
      date: null,

      no: '',
      modification: '',
      schedule: '',
      detailEdit: '',
      division: ''
    }
  });

  useEffect(() => {
    if (typeModal === 'EDIT' && open) {
      switch (typeTable) {
        case TABLE_ADD_BEFORE:
          if (selectedRowBefore) {
            const { beforeID, type, project, model, productName, level, asset, cvt, massProduct, currentLocation, date } =
              selectedRowBefore;
            setValue('beforeID', beforeID);
            setValue('type', type);
            setValue('project', project);
            setValue('model', model);
            setValue('productName', productName);
            setValue('level', level);
            setValue('asset', asset);
            setValue('cvt', cvt);
            setValue('massProduct', massProduct);
            setValue('currentLocation', currentLocation);
            setValue('date', date ? dayjs(date) : null);
          }
          break;

        case TABLE_ADD_AFTER:
          if (selectedRowAfter) {
            const { afterID, no, modification, schedule, detailEdit, division } = selectedRowAfter;
            setValue('afterID', afterID);
            setValue('no', no);
            setValue('modification', modification);
            setValue('schedule', schedule);
            setValue('detailEdit', detailEdit);
            setValue('division', division);
          }
          break;

        default:
          break;
      }
    }
  }, [open]);
  const saveTableBefore = async (data) => {
    const url = typeModal === 'ADD' ? RouterApi.detailMoldBeforeAdd : RouterApi.detailMoldBeforeUpdate;
    setLoading(true);
    const res = await restApi.post(url, {
      ...data,
      beforeID: selectedRowBefore?.beforeID
    });
    setLoading(false);
    if (res?.status === 200) {
      toast.success(typeModal === 'EDIT' ? 'Saved changes successful!' : 'Create new successful!');
      handleClose();
      afterSave();
    } else {
      toast.error(res?.data?.message || 'Server Error!');
    }
  };
  const saveTableAfter = async (data) => {
    const url = typeModal === 'ADD' ? RouterApi.detailMoldAfterAdd : RouterApi.detailMoldAfterUpdate;
    setLoading(true);
    const res = await restApi.post(url, {
      ...data,
      afterID: selectedRowAfter?.afterID
    });
    setLoading(false);
    if (res?.status === 200) {
      toast.success(typeModal === 'EDIT' ? 'Saved changes successful!' : 'Create new successful!');
      handleClose();
      afterSave();
    } else {
      toast.error(res?.data?.message || 'Server Error!');
    }
  };
  const onSaveData = (data) => {
    let check = false;
    switch (typeTable) {
      case TABLE_ADD_BEFORE:
        const { type, project, model, productName, level, asset, cvt, massProduct, currentLocation } = data;
        if (
          type?.trim() ||
          project?.trim() ||
          model?.trim() ||
          productName?.trim() ||
          level?.trim() ||
          asset?.trim() ||
          cvt?.trim() ||
          massProduct?.trim() ||
          currentLocation?.trim()
        ) {
          check = true;
        }
        break;
      case TABLE_ADD_AFTER:
        const { no, modification, schedule, detailEdit, division } = data;
        if (no?.trim() || modification?.trim() || schedule?.trim() || detailEdit?.trim() || division?.trim()) {
          check = true;
        }
        break;

      default:
        break;
    }
    if (check) {
      ShowConfirm({
        title: typeModal === 'ADD' ? 'Create new' : 'Update',
        message: typeModal === 'ADD' ? 'Do you want to create new?' : 'Do you want to update it?',
        onOK: async () => {
          switch (typeTable) {
            case TABLE_ADD_BEFORE:
              saveTableBefore(data);
              break;
            case TABLE_ADD_AFTER:
              saveTableAfter(data);
              break;

            default:
              break;
          }
        }
      });
    } else {
      toast.error('The form cannot be empty!', { duration: 2000 });
    }
  };
  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    onClose();
    reset();
  };
  return (
    <>
      <BootstrapDialog maxWidth={'lg'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          <Stack direction={'row'} alignItems={'center'}>
            <div style={{ marginRight: '5px' }}>{typeModal === 'ADD' ? 'Create new' : 'Update infomation'}</div>
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
            {typeTable === TABLE_ADD_BEFORE && (
              <Stack width={'100%'} spacing={2.5}>
                <Controller
                  name="type"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField fullWidth size="small" {...field} label="구분" variant="outlined" error={!!errors.type} />
                  )}
                />
                <Controller
                  name="project"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField fullWidth size="small" {...field} label="Project" variant="outlined" error={!!errors.project} />
                  )}
                />

                <Controller
                  name="model"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="모델명" variant="outlined" error={!!errors.model} />
                  )}
                />
                <Controller
                  name="productName"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="품명" variant="outlined" error={!!errors.productName} />
                  )}
                />
                <Controller
                  name="level"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="차수" variant="outlined" error={!!errors.level} />
                  )}
                />
                <Controller
                  name="asset"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="자산 번호" variant="outlined" error={!!errors.asset} />
                  )}
                />
                <Controller
                  name="cvt"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="CVT" variant="outlined" error={!!errors.cvt} />
                  )}
                />
                <Controller
                  name="massProduct"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="양산처" variant="outlined" error={!!errors.massProduct} />
                  )}
                />
                <Controller
                  name="currentLocation"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="현위치" variant="outlined" error={!!errors.currentLocation} />
                  )}
                />
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="입고일"
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(newValue) => {
                        setValue('date', newValue);
                      }}
                      format="YYYY/MM/DD"
                      views={['year', 'month', 'day']}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: 'small',
                          error: !!errors.date
                        }
                      }}
                    />
                  )}
                />
              </Stack>
            )}
            {typeTable === TABLE_ADD_AFTER && (
              <Stack width={'100%'} spacing={2.5}>
                <Controller
                  name="no"
                  control={control}
                  rules={{}}
                  render={({ field }) => <TextField fullWidth size="small" {...field} label="No" variant="outlined" error={!!errors.no} />}
                />
                <Controller
                  name="modification"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField fullWidth size="small" {...field} label="수정처" variant="outlined" error={!!errors.modification} />
                  )}
                />

                <Controller
                  name="schedule"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="일정" variant="outlined" error={!!errors.schedule} />
                  )}
                />
                <Controller
                  name="detailEdit"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="수리 내용" variant="outlined" error={!!errors.detailEdit} />
                  )}
                />
                <Controller
                  name="division"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <TextField {...field} fullWidth size="small" label="구분" variant="outlined" error={!!errors.division} />
                  )}
                />
              </Stack>
            )}
            <Button ref={buttonSubmitRef} type="submit" sx={{ display: 'none' }} variant="contained">
              .
            </Button>
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
              buttonSubmitRef?.current?.click();
            }}
          >
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
