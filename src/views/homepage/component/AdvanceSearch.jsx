import { useEffect, useState } from "react";
import dayjs from 'dayjs';
// material-ui
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    ListItemText,
    Menu,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { IconPlus, IconEdit, IconCheck, IconFilter, IconSearch, IconCircleCheckFilled, IconCircleCheck, IconUser, IconEye } from '@tabler/icons-react';

import { DatePicker } from "@mui/x-date-pickers";
import { END_OF_CURRENT_MONTH, START_OF_CURRENT_MONTH } from "utils/helper";


const currentDate = dayjs();
// Lấy ngày đầu tiên của tháng hiện tại
const firstDayOfCurrentMonth = currentDate.startOf('month');

// Lấy ngày đầu tiên của tháng trước
const firstDayOfLastMonth = firstDayOfCurrentMonth.subtract(1, 'month');

// Lấy ngày đầu tiên của tháng sau
const firstDayOfNextMonth = firstDayOfCurrentMonth.add(1, 'month');
const AdvanceSearch = ({ anchorEl, open, onCloseMenuFilter, categories, handleClickApplyFiler, users, currentFilter,valueTab }) => {

    const [personName, setPersonName] = useState([]);

    const [categoryFilter, setCategoryFiler] = useState([]);

    const [startDate, setStartDate] = useState(START_OF_CURRENT_MONTH);

    const [endDate, setEndDate] = useState(END_OF_CURRENT_MONTH);

    const onClickResetAll = () => {
        setPersonName([]);
        setCategoryFiler([]);
        setStartDate(null);
        setEndDate(null);
    };

    const onClose = () => {
        onCloseMenuFilter();
    }
    useEffect(() => {
        if (open && currentFilter) {
            const {
                personName,
                categoryFilter,
                startDate,
                endDate,
            } = currentFilter;
            setPersonName(personName);
            setCategoryFiler(categoryFilter);
            setStartDate(startDate);
            setEndDate(endDate);
        }
    }, [open])
    return (
        <>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={onClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button'
                }}
            // anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            >
                <Paper sx={{ width: '100%', maxWidth: { xs: 340, sm: 400 }, padding: '10px' }}>
                    {/* <Grid container spacing={2}>
            <Grid item xs={12}> */}
                    <Stack direction="row" alignItems={'center'} justifyContent="space-between">
                        <Typography color={'primary'} variant="h4" component="h4">
                            Advance search
                        </Typography>
                        <IconButton onClick={onClose} size="small" aria-label="close">
                            <IconX />
                        </IconButton>
                    </Stack>
                    <Divider />
                    <Box sx={{ margin: '10px 0px 0px 0px', overflowY: 'auto' }}>
                        <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
                            <InputLabel htmlFor="demo-multiple-checkbox">카테고리(Category)</InputLabel>
                            <Select
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 500, // Set max height to 200px
                                        },
                                    },
                                }}
                                label="카테고리(Category)"
                                // labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={categoryFilter}
                                onChange={(event) => {
                                    const {
                                        target: { value }
                                    } = event;
                                    setCategoryFiler(
                                        // On autofill we get a stringified value.
                                        typeof value === 'string' ? value.split(',') : value
                                    );
                                }}
                                input={<OutlinedInput label="카테고리(Category)" />}
                                renderValue={(selected) => {
                                    let result = selected
                                        ?.map((id) => {
                                            let catefind = categories?.find((cate) => cate.categoryId === id);
                                            return catefind?.categoryName;
                                        })
                                        .join(' ,');
                                    return result;
                                }}
                            >
                                {categories?.map((item) => (
                                    <MenuItem key={item?.categoryId} value={item?.categoryId}>
                                        <Checkbox checked={categoryFilter.indexOf(item?.categoryId) > -1} />
                                        <ListItemText primary={item?.categoryName} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <TextField
                onChange={onChangeInputFilter}
                name="modelFilter"
                value={modelFilter}
                id="standard-basic-model"
                label="모델명(Model)"
                size="small"
                variant="outlined"
              />
            </FormControl>
            <FormControl style={{ margin: '10px 0px' }} fullWidth size="small">
              <TextField
                onChange={onChangeInputFilter}
                name="plNameFilter"
                value={plNameFilter}
                id="standard-basic"
                label="P/L NAME"
                size="small"
                variant="outlined"
              />
            </FormControl>
            <FormControl style={{ margin: '10px 0px' }} fullWidth size="small">
              <TextField
                onChange={onChangeInputFilter}
                name="codeFilter"
                id="standard-basic"
                value={codeFilter}
                label="코드(Code)"
                size="small"
                variant="outlined"
              />
            </FormControl>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <TextField
                onChange={onChangeInputFilter}
                name="productNameFilter"
                value={productNameFilter}
                id="standard-basic"
                label="품명(Product Name)"
                size="small"
                variant="outlined"
              />
            </FormControl> */}
                        <FormControl disabled={valueTab !== 'ALL'} style={{ margin: '10px  0px' }} fullWidth size="small">
                            <InputLabel id="demo-simple-select-label">등록자(Registrant)</InputLabel>
                            <Select
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300, // Set max height to 200px
                                        },
                                    },
                                }}
                                id="demo-simple-select"
                                labelId="demo-simple-select-label"
                                label="등록자(Registrant)"
                                multiple
                                value={personName}
                                onChange={(event) => {
                                    const {
                                        target: { value }
                                    } = event;
                                    setPersonName(
                                        // On autofill we get a stringified value.
                                        typeof value === 'string' ? value.split(',') : value
                                    );
                                }}
                                input={<OutlinedInput label="등록자(Registrant)" />}
                                renderValue={(selected) => {
                                    let result = selected
                                        ?.map((id) => {
                                            let catefind = users?.find((cate) => cate.userId === id);
                                            return catefind?.userName;
                                        })
                                        .join(' ,');
                                    return result;
                                }}
                            >
                                {users?.map((item) => (
                                    <MenuItem key={item?.userId} value={item?.userId}>
                                        <Checkbox checked={personName.indexOf(item?.userId) > -1} />
                                        <ListItemText primary={`${item?.userName}(${item?.fullName})`} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl style={{ margin: '10px 0px' }} fullWidth size="small">
                            <Stack spacing={2} direction="row" alignItems={'center'} justifyContent="space-between">
                                <DatePicker
                                    onChange={(newValue) => {
                                        setStartDate(newValue);
                                    }}
                                    value={startDate}
                                    views={['year', 'month', 'day']}
                                    format="YYYY/MM/DD"
                                    slotProps={{ textField: { size: 'small' } }}
                                    label="Start Registration Date"
                                    size="small"
                                />
                                <DatePicker
                                    autoOk={false}
                                    onChange={(newValue) => {
                                        setEndDate(newValue);
                                    }}
                                    value={endDate}
                                    views={['year', 'month', 'day']}
                                    format="YYYY/MM/DD"
                                    slotProps={{ textField: { size: 'small' } }}
                                    label="End Registration Date"
                                    size="small"
                                />
                            </Stack>
                        </FormControl>
                    </Box>
                    <Divider />
                    <Stack direction="row" alignItems={'center'} sx={{ marginTop: '10px' }} justifyContent="space-between">
                        <Button onClick={onClickResetAll} variant="custom" size="small">
                            Reset all
                        </Button>
                        <Button startIcon={<IconSearch />} onClick={() => {
                            handleClickApplyFiler({ personName, categoryFilter, startDate, endDate })
                        }} variant="contained" size="small">
                            Search
                        </Button>
                    </Stack>
                    {/* </Grid>
          </Grid> */}
                </Paper>
            </Menu>
        </>
    );

}

export default AdvanceSearch;