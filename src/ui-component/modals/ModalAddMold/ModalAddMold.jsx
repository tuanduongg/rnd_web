import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, styled, IconButton, Stack, Grid, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, OutlinedInput, InputAdornment } from "@mui/material"

import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from 'react-device-detect';
import config from 'config';
import { useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { useForm, Controller } from 'react-hook-form';
import { IconDeviceFloppy, IconSearch } from '@tabler/icons-react';
import { IconListSearch } from '@tabler/icons-react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LIST_STATUS } from 'views/management_mold/management_mold.service';
import { useRef } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { ShowConfirm } from 'ui-component/ShowDialog';


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
    'companyID': '',
    'companyCode': '',
}

const currentDate = dayjs();
export default function ModalAddMold({ open, onClose, categories, onOpenModalSetting, setFormValues, typeModal, selected, afterSave }) {

    const buttonSubmitRef = useRef();
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
            wearingPlan: initialCompanyOBJ,
            tryNo: '',
            historyEdit: '',
            productionStatus: '',
        }
    });

    useEffect(() => {
        if (typeModal === 'EDIT' && open && selected) {

            const {
                outputJigID,
                moldNo,
                tryNo,
                shipMassCompany,
                shipDate,
                outputEdit,
                historyEdit,
                receivingCompleted,
                productionStatus,
                manufacturer,
                shipArea,
                massCompany,
                modificationCompany,
                wearingPlan,
                model: {
                    modelID,
                    projectName,
                    type,
                    model,
                    description,
                    category: {
                        categoryId,
                        categoryName,
                    }
                }
            } = selected;

            setValue('modelID', modelID)
            setValue('project', projectName)
            setValue('type', type)
            setValue('model', model)
            setValue('category', categoryId)
            setValue('description', description)
            setValue('moldNo', moldNo);
            setValue('tryNo', tryNo);

            setValue('shipMassCompany', dayjs(shipMassCompany));
            setValue('shipDate', dayjs(shipDate));
            setValue('outputEdit', dayjs(outputEdit));
            setValue('historyEdit', historyEdit);
            setValue('receivingCompleted', dayjs(receivingCompleted));
            setValue('productionStatus', productionStatus);
            setValue('manufacturer', manufacturer);
            setValue('shipArea', shipArea);
            setValue('massCompany', massCompany);
            setValue('modificationCompany', modificationCompany);
            setValue('wearingPlan', wearingPlan);
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
                    category: {
                        categoryId,
                        categoryName
                    }
                } = value;
                setValue('modelID', modelID)
                setValue('project', projectName)
                setValue('type', type)
                setValue('model', model)
                setValue('category', categoryId)
                setValue('description', description)
            } else {
                setValue(prop,
                    {
                        'companyID': value?.companyID,
                        'companyCode': value?.companyCode,
                    });

            }
        }
    }, [setFormValues]);


    const onSaveData = (data) => {
        ShowConfirm({
            title: typeModal === 'EDIT' ? 'Update' : 'Create new',
            message: 'Do you want to save changes?',
            onOK: async () => {
                const url = typeModal === 'EDIT' ? RouterApi.updateOutputJig : RouterApi.addOutputJig;
                const res = await restApi.post(url, { ...data, outputJigID: selected?.outputJigID });
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

                        <Grid container spacing={[1, 2]}>
                            <Grid item display={'none'} xs={12}>
                                <Controller
                                    name="modelID"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => <TextField fullWidth size="small" {...field}
                                        inputProps={{ readOnly: true }} label="Project name" variant="outlined" />}
                                />
                            </Grid>
                            <Grid item xs={5.5}>
                                <Controller
                                    name="model"
                                    control={control}
                                    rules={{ required: ' ' }}
                                    render={({ field }) =>
                                    (
                                        <FormControl size='small' fullWidth error={!!errors.model} variant="outlined">
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
                                                            onClick={() => { onOpenModalSetting('MODEL', 'model') }}
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
                                    )
                                    }
                                />
                            </Grid>
                            <Grid item xs={6.5}>
                                <Controller
                                    name="tryNo"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => <TextField fullWidth size="small" {...field} label="Try No." variant="outlined" error={!!errors.tryNo} />}
                                />

                            </Grid>
                            <Grid item xs={5.5}>
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
                            </Grid>
                            <Grid item xs={6.5}>
                                <Controller
                                    name="manufacturer"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) =>
                                    (
                                        <FormControl size='small' fullWidth error={!!errors.manufacturer} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">제작업체(NSX)</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                {...field}
                                                value={field.value?.companyCode || ''}
                                                onChange={(e) => field.onChange({ ...field.value, companyCode: e.target.value })}
                                                id="outlined-adornment-password"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            // onClick={handleClickShowPassword}
                                                            // onMouseDown={handleMouseDownPassword}
                                                            // onMouseUp={handleMouseUpPassword}
                                                            edge="end"
                                                            onClick={() => { onOpenModalSetting('COMPANY', 'manufacturer') }}
                                                        >
                                                            <IconListSearch />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="제작업체(NSX)"
                                            />
                                        </FormControl>
                                        //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                                    )
                                    }
                                />
                            </Grid>

                            <Grid item xs={5.5}>
                                <Controller
                                    name="project"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => <TextField fullWidth size="small"
                                        {...field}
                                        inputProps={{ readOnly: true }}
                                        label="Project name"
                                        variant="outlined"
                                        error={!!errors.project} />}
                                />
                            </Grid>
                            <Grid item xs={6.5}>
                                <Controller
                                    name="shipArea"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) =>
                                    (
                                        <FormControl size='small' fullWidth error={!!errors.shipArea} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">발송지역(Nơi VC)</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                {...field}
                                                value={field.value?.companyCode || ''}
                                                onChange={(e) => field.onChange({ ...field.value, companyCode: e.target.value })}
                                                id="outlined-adornment-password"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            // onClick={handleClickShowPassword}
                                                            // onMouseDown={handleMouseDownPassword}
                                                            // onMouseUp={handleMouseUpPassword}
                                                            edge="end"
                                                            onClick={() => { onOpenModalSetting('COMPANY', 'shipArea') }}
                                                        >
                                                            <IconListSearch />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="발송지역(Nơi VC)"
                                            />
                                        </FormControl>
                                        //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                                    )
                                    }
                                />
                            </Grid>
                            <Grid item xs={5.5}>
                                <Controller
                                    name="type"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => <TextField fullWidth size="small" {...field}
                                        inputProps={{ readOnly: true }} label="구분" variant="outlined" error={!!errors.type} />}
                                />
                            </Grid>
                            <Grid item xs={6.5}>
                                <Controller
                                    name="shipDate"
                                    control={control}
                                    rules={{ required: ' ' }}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="출고 계획(Thời gian)"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(newValue) => { setValue('shipDate', newValue); }}
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
                            </Grid>
                            <Grid item xs={5.5}>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => <TextField
                                        {...field}
                                        inputProps={{ readOnly: true }} fullWidth size="small" label="Description" variant="outlined" error={!!errors.description} />}
                                />
                            </Grid>

                            <Grid item xs={3.5}>
                                <Controller
                                    name="massCompany"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) =>
                                    (
                                        <FormControl size='small' fullWidth error={!!errors.massCompany} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">양산업체(Cty SX)</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                {...field}
                                                value={field.value?.companyCode || ''}
                                                onChange={(e) => field.onChange({ ...field.value, companyCode: e.target.value })}
                                                id="outlined-adornment-password"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            edge="end"
                                                            onClick={() => { onOpenModalSetting('COMPANY', 'massCompany') }}
                                                        >
                                                            <IconListSearch />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="양산업체(Cty SX)"
                                            />
                                        </FormControl>
                                        //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                                    )
                                    }
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <Controller
                                    name="shipMassCompany"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="양산업체입고(Thời gian)"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(newValue) => { setValue('shipMassCompany', newValue); }}
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
                            </Grid>
                            <Grid item xs={5.5}>
                                <Controller
                                    name="moldNo"
                                    control={control}
                                    rules={{ required: ' ' }}
                                    render={({ field }) => <TextField fullWidth size="small" {...field} label="Mold No." variant="outlined" error={!!errors.moldNo} />}
                                />
                            </Grid>
                            <Grid item xs={3.5}>
                                <Controller
                                    name="modificationCompany"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) =>
                                    (
                                        <FormControl size='small' fullWidth error={!!errors.modificationCompany} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">수정업체(Nơi sửa)</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                {...field}
                                                value={field.value?.companyCode || ''}
                                                onChange={(e) => field.onChange({ ...field.value, companyCode: e.target.value })}
                                                id="outlined-adornment-password"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            // onClick={handleClickShowPassword}
                                                            // onMouseDown={handleMouseDownPassword}
                                                            // onMouseUp={handleMouseUpPassword}
                                                            edge="end"
                                                            onClick={() => { onOpenModalSetting('COMPANY', 'modificationCompany') }}
                                                        >
                                                            <IconListSearch />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="수정업체(Nơi sửa)"
                                            />
                                        </FormControl>
                                        //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                                    )
                                    }
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <Controller
                                    name="outputEdit"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="수리 출고(Xuất kho sửa)"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(newValue) => { setValue('outputEdit', newValue); }}
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
                            </Grid>
                            <Grid item xs={5.5}>
                                <FormControl size="small" fullWidth error={!!errors.productionStatus}>
                                    <InputLabel id="category-select-label">양산적용(Trạng thái)</InputLabel>
                                    <Controller
                                        name="productionStatus"
                                        control={control}
                                        rules={{ required: ' ' }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                labelId="category-select-label"
                                                label="양산적용(Trạng thái)"
                                                value={field.value}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value); // Cập nhật giá trị cho react-hook-form
                                                    // Nếu cần thêm logic validateForm bạn có thể xử lý tại đây
                                                }}
                                            >
                                                {LIST_STATUS?.map((item) => (
                                                    <MenuItem key={item?.value} value={item?.value}>
                                                        {item?.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={3.5}>
                                <Controller
                                    name="wearingPlan"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) =>
                                    (
                                        <FormControl size='small' fullWidth error={!!errors.wearingPlan} variant="outlined">
                                            <InputLabel htmlFor="outlined-adornment-password">입고 계획(Xuất tới)</InputLabel>
                                            <OutlinedInput
                                                fullWidth
                                                {...field}
                                                value={field.value?.companyCode || ''}
                                                onChange={(e) => field.onChange({ ...field.value, companyCode: e.target.value })}
                                                id="outlined-adornment-password"
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            // onClick={handleClickShowPassword}
                                                            // onMouseDown={handleMouseDownPassword}
                                                            // onMouseUp={handleMouseUpPassword}
                                                            edge="end"
                                                            onClick={() => { onOpenModalSetting('COMPANY', 'wearingPlan') }}
                                                        >
                                                            <IconListSearch />
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="입고 계획(Xuất tới)"
                                            />
                                        </FormControl>
                                        //  <TextField fullWidth  size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />
                                    )
                                    }
                                />
                            </Grid>

                            <Grid item xs={3}>
                                <Controller
                                    name="receivingCompleted"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="입고 완료(Thời gian)"
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(newValue) => { setValue('receivingCompleted', newValue); }}
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
                            </Grid>
                            <Grid item xs={12}>
                                <Controller
                                    name="historyEdit"
                                    control={control}
                                    rules={{}}
                                    render={({ field }) => <TextField multiline rows={2} fullWidth size="small" {...field} label="수정내역(Nội dung chỉnh sửa)" variant="outlined" error={!!errors.historyEdit} />}
                                />
                            </Grid>

                            <Button ref={buttonSubmitRef} type="submit" hidden sx={{ display: 'none' }} variant="contained">
                                Save Changes
                            </Button>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant="custom" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="contained" startIcon={<IconDeviceFloppy />} autoFocus onClick={() => { buttonSubmitRef?.current?.click() }}>
                        Save changes
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </>
    );
}
