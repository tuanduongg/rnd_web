import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
// material-ui
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
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
  Tooltip,
  Typography
} from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { IconSearch } from '@tabler/icons-react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { DatePicker } from '@mui/x-date-pickers';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { LIST_STATUS } from '../management_mold.service';

const AdvanceSearchMold = ({ anchorEl, open, onCloseMenuFilter, categories, handleClickApplyFiler, currentFilter }) => {
  const [categoryFilter, setCategoryFiler] = useState([]);
  const [modelFilter, setModelFilter] = useState([]);
  const [optionModels, setOptionModels] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);

  const [openSelect, setOpenSelect] = useState(false);

  const handleOpenSelect = () => {
    setOpenSelect(true);
  };

  const onClickResetAll = () => {
    setCategoryFiler([]);
    setModelFilter([]);
  };
  const onChangeSelectModel = (event, value) => {
    // Extract and store only the modelID values
    setModelFilter(value); // Do something with selectedModelIDs
  };
  const handleCloseSelect = async () => {
    setOpenSelect(false);
    const res = await restApi.post(RouterApi.findByCategoryModelMold, { category: categoryFilter });
    if (res?.status === 200) {
      const data = res?.data;
      setOptionModels(data);
    }
  };
  const onClose = () => {
    onCloseMenuFilter();
  };
  useEffect(() => {
    if (open && currentFilter) {
      const { categoryFilter, modelFilter, statusFilter } = currentFilter;
      setCategoryFiler(categoryFilter);
      setStatusFilter(statusFilter);
      setModelFilter(modelFilter);
    }
  }, [open]);
  const isSelected = (option) => {
    const find = modelFilter.find((o) => o.modelID === option.modelID);
    if (find) {
      return true;
    }
    return false;
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
        <Paper sx={{ width: { xs: 340, sm: 400 }, padding: '10px' }}>
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
          <Box sx={{ margin: '10px 0px 0px 0px', overflowY: 'auto', maxHeight: '300px' }}>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <InputLabel htmlFor="demo-multiple-checkbox-category">Category</InputLabel>
              <Select
                open={openSelect}
                onOpen={handleOpenSelect}
                onClose={handleCloseSelect}
                label="Category"
                labelId="demo-multiple-checkbox-category"
                multiple
                value={categoryFilter}
                onChange={(event) => {
                  const {
                    target: { value }
                  } = event;
                  setCategoryFiler(typeof value === 'string' ? value.split(',') : value);
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
            <Autocomplete
              groupBy={(option) => {
               return option.projectName;
              }}
              sx={{ margin: '10px  0px' }}
              value={modelFilter}
              multiple
              disableCloseOnSelect
              size="small"
              isOptionEqualToValue={(option, value) => option?.modelID === value?.modelID}
              getOptionLabel={(option) => `${option.model}(${option.type})`}
              onChange={onChangeSelectModel}
              options={optionModels}
              renderOption={(props, option, { selected }) => (
                <Box component="li" {...props}>
                  <Checkbox
                    checked={isSelected(option)} // Check if the option is selected
                    style={{ marginRight: 8 }}
                  />
                  <Tooltip title={option?.description}>
                    <span>{`${option?.model}(${option?.type})`}</span>
                  </Tooltip>
                </Box>
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Tooltip key={option?.modelID} title={option?.description}>
                    <Chip
                      placement="left"
                      label={`${option.model}(${option.type})`} // Label for the tag
                      {...getTagProps({ index })}
                    />
                  </Tooltip>
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Model"
                  onKeyDown={(event) => {
                    // Prevent removal of chips when pressing the Delete or Backspace key
                    if (event.key === 'Backspace' || event.key === 'Delete') {
                      event.stopPropagation();
                    }
                  }}
                  slotProps={{
                    input: {
                      ...params.InputProps
                    }
                  }}
                />
              )}
            />
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <InputLabel htmlFor="demo-multiple-checkbox-status">Status</InputLabel>
              <Select
                label="Status"
                labelId="demo-multiple-checkbox-status"
                multiple
                value={statusFilter}
                onChange={(event) => {
                  const {
                    target: { value }
                  } = event;
                  setStatusFilter(typeof value === 'string' ? value.split(',') : value);
                }}
                input={<OutlinedInput label="Status" />}
                renderValue={(selected) => {
                  let result = selected
                    ?.map((id) => {
                      let find = LIST_STATUS?.find((cate) => cate?.value === id);
                      return find?.name;
                    })
                    .join(' ,');
                  return result;
                }}
              >
                {LIST_STATUS?.length > 0 ? (
                  LIST_STATUS?.map((item) => (
                    <MenuItem key={item?.id} value={item?.value}>
                      <Checkbox checked={statusFilter?.includes(item?.value)} />
                      <ListItemText primary={`${item?.name}`} />
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem>
                    <ListItemText primary={'No data'} />
                  </MenuItem>
                )}
              </Select>
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
                handleClickApplyFiler({ categoryFilter, modelFilter, statusFilter });
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

export default AdvanceSearchMold;
