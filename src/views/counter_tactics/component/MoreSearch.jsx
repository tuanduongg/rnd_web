import { useEffect, useState } from 'react';
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
  TextField,
  Typography
} from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { IconSearch } from '@tabler/icons-react';

import { DatePicker } from '@mui/x-date-pickers';
import { END_OF_CURRENT_MONTH, START_OF_CURRENT_MONTH } from 'utils/helper';

const currentDate = dayjs();
// Lấy ngày đầu tiên của tháng hiện tại
const firstDayOfCurrentMonth = currentDate.startOf('month');

// Lấy ngày đầu tiên của tháng trước
const firstDayOfLastMonth = firstDayOfCurrentMonth.subtract(1, 'month');

// Lấy ngày đầu tiên của tháng sau
const firstDayOfNextMonth = firstDayOfCurrentMonth.add(1, 'month');
const MoreSearch = ({ anchorEl, open, onCloseMenuFilter, categories, processes, currentFilter, onClickAdvanceSearch }) => {
  const [process, setProcess] = useState([]);

  const [categoryFilter, setCategoryFiler] = useState([]);

  const [startDate, setStartDate] = useState(START_OF_CURRENT_MONTH);

  const [endDate, setEndDate] = useState(END_OF_CURRENT_MONTH);

  const onClickResetAll = () => {
    setProcess([]);
    setCategoryFiler([]);
    setStartDate(START_OF_CURRENT_MONTH);
    setEndDate(END_OF_CURRENT_MONTH);
  };

  useEffect(() => {
    if (open && currentFilter) {
      setStartDate(currentFilter?.startDate);
      setEndDate(currentFilter?.endDate);
      setProcess(currentFilter?.process);
      setCategoryFiler(currentFilter?.category);
    }
  }, [open]);

  const onClose = () => {
    setProcess([]);
    setCategoryFiler([]);
    setStartDate(firstDayOfLastMonth);
    setEndDate(firstDayOfNextMonth);
    onCloseMenuFilter();
  };
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
              <InputLabel htmlFor="demo-multiple-checkbox">Category</InputLabel>
              <Select
                label="Category"
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
                input={<OutlinedInput label="Category" />}
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
            {/* <FormControl style={{ margin: '10px 0px' }} fullWidth size="small">
              <TextField
                onChange={(e) => {
                  setCode(e.target.value);
                }}
                name="codeFilter"
                id="standard-basic"
                value={code}
                label="Code"
                size="small"
                variant="outlined"
              />
            </FormControl>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <TextField
                onChange={(e) => {
                  setModel(e.target.value);
                }}
                name="modelFilter"
                value={model}
                id="standard-basic-model"
                label="Model"
                size="small"
                variant="outlined"
              />
            </FormControl> */}
            {/* 
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
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Process</InputLabel>
              <Select
                id="demo-simple-select"
                labelId="demo-simple-select-label"
                label="Process"
                multiple
                value={process}
                onChange={(event) => {
                  const {
                    target: { value }
                  } = event;
                  setProcess(
                    // On autofill we get a stringified value.
                    typeof value === 'string' ? value.split(',') : value
                  );
                }}
                input={<OutlinedInput label="Process" />}
                renderValue={(selected) => {
                  let result = selected
                    ?.map((id) => {
                      let catefind = processes?.find((cate) => cate.processId === id);
                      return catefind?.processName;
                    })
                    .join(' ,');
                  return result;
                }}
              >
                {processes?.map((item) => (
                  <MenuItem key={item?.processId} value={item?.processId}>
                    <Checkbox checked={process.indexOf(item?.processId) > -1} />
                    <ListItemText primary={item?.processName} />
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
                  label="From"
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
                  label="To"
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
            <Button
              startIcon={<IconSearch />}
              onClick={() => {
                onClickAdvanceSearch({ startDate, endDate, process, category: categoryFilter });
                onCloseMenuFilter();
              }}
              variant="contained"
              size="small"
            >
              Search
            </Button>
          </Stack>
          {/* </Grid>
          </Grid> */}
        </Paper>
      </Menu>
    </>
  );
};

export default MoreSearch;
