import { useState } from 'react';
import {
  Table,
  TableBody,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
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
  TablePagination,
  Tooltip
} from '@mui/material';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';
import { cssScrollbar } from 'utils/helper';
import config from 'config';
import { IconCheckbox, IconCircleX, IconDeviceFloppy, IconEdit, IconPlus, IconSearch } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import SubCard from 'ui-component/cards/SubCard';
import { ShowConfirm } from 'ui-component/ShowDialog';
import toast from 'react-hot-toast';
import { RouterApi } from 'utils/router-api';
import restApi from 'utils/restAPI';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: '12px'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '10px'
  }
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

const TableModel = ({
  role,
  categories,
  typeModal,
  modelMolds,
  rowsPerPageModel,
  setRowsPerPageModel,
  pageModel,
  setPageModel,
  totalModel,
  setTotalModel,
  searchModel,
  setSearchModel,
  afterSave,
  onChooseItem,
  onClickSearch
}) => {
  const [isEditing, setIsEditing] = useState('');
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
      model: '',
      category: '',
      description: ''
    }
  });
  const onSaveData = (data) => {
    if (!isEditing && !role?.create) {
      toast.error(`You don't have permission!`);
      return;
    }
    ShowConfirm({
      title: isEditing ? 'Update' : 'Create new',
      message: 'Do you want to save changes?',
      onOK: async () => {
        const url = isEditing ? RouterApi.updateModelMold : RouterApi.addModelMold;
        const res = await restApi.post(url, { ...data, modelID: isEditing });
        if (res?.status === 200) {
          if (!isEditing) {
            reset();
          }
          afterSave('MODEL');
          toast.success('Saved changes successful!');
        } else {
          toast.error(res?.data?.message || 'Server Error!');
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPageModel(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageModel(parseInt(event.target.value, 10));
    setPageModel(0);
  };

  const onClickCancel = (item) => {
    setIsEditing('');
    reset();
  };
  const onClickEdit = (item) => {
    const {
      modelID,
      projectName,
      type,
      model,
      description,
      category: { categoryId, categoryName }
    } = item;
    setIsEditing(modelID);
    setValue('project', projectName);
    setValue('type', type);
    setValue('model', model);
    setValue('category', categoryId);
    setValue('description', description);
  };

  return (
    <>
      {typeModal !== 'PICK' && (
        <Box mt={2}>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit((data) => onSaveData(data))}>
            <Grid container spacing={2}>
              <Grid item xs={3}>
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
              <Grid item xs={3}>
                <Controller
                  name="project"
                  control={control}
                  rules={{ required: ' ' }}
                  render={({ field }) => (
                    <TextField size="small" {...field} label="Project name" variant="outlined" error={!!errors.project} />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: ' ' }}
                  render={({ field }) => <TextField size="small" {...field} label="구분" variant="outlined" error={!!errors.type} />}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name="model"
                  control={control}
                  rules={{ required: ' ' }}
                  render={({ field }) => <TextField size="small" {...field} label="Model" variant="outlined" error={!!errors.model} />}
                />
              </Grid>
              <Grid item xs={12} textAlign={'right'}>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: ' ' }}
                  render={({ field }) => (
                    <TextField fullWidth size="small" {...field} label="Description" variant="outlined" error={!!errors.description} />
                  )}
                />
              </Grid>
              <Grid item xs={12} textAlign={'right'}>
                <Button type="submit" startIcon={isEditing ? <IconDeviceFloppy /> : <IconPlus />} variant="contained">
                  {isEditing ? 'Save Changes' : 'Add New'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
      <SubCard sx={{ marginTop: '15px', padding: '10px' }}>
        <Stack direction={'row'} justifyContent={'flex-end'}>
          <FormControl size="small" variant="outlined">
            <OutlinedInput
              defaultValue={searchModel}
              onBlur={(e) => {
                setSearchModel(e.target.value);
              }}
              placeholder="Search..."
              type={'text'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    aria-label="search"
                    onClick={() => {
                      onClickSearch('MODEL');
                    }}
                    edge="end"
                  >
                    <IconSearch />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
        <TableContainer
          sx={{
            ...cssScrollbar,
            marginTop: '10px',
            maxHeight: 290
          }}
          component={Paper}
        >
          <Table style={{ tableLayout: 'fixed' }} stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" width={50}>
                  #
                </StyledTableCell>
                <StyledTableCell align="center" width={100}>
                  Category
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: '120px' }}>
                  Project Name
                </StyledTableCell>
                <StyledTableCell align="center" width={100}>
                  구분
                </StyledTableCell>
                <StyledTableCell align="center" width={100}>
                  Model
                </StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="right" width={50}>
                  {' '}
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
              }}
            >
              {modelMolds?.length > 0 ? (
                modelMolds.map((item, index) => (
                  <StyledTableRow selected={isEditing === item?.modelID} key={index}>
                    <StyledTableCell align="center">{pageModel * rowsPerPageModel + index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{item?.category?.categoryName}</StyledTableCell>
                    <StyledTableCell align="center">{item?.projectName}</StyledTableCell>
                    <StyledTableCell align="center">{item?.type}</StyledTableCell>
                    <StyledTableCell align="center">{item?.model}</StyledTableCell>
                    <StyledTableCell align="center">{item?.description}</StyledTableCell>
                    <StyledTableCell align="right">
                      {typeModal === 'PICK' ? (
                        <Tooltip title="Click to choose item">
                          <IconButton
                            size="small"
                            onClick={() => {
                              onChooseItem(item, 'MODEL');
                            }}
                            color="primary"
                          >
                            <IconCheckbox />
                          </IconButton>
                        </Tooltip>
                      ) : isEditing === item?.modelID ? (
                        <Tooltip title="Cancel edit">
                          <IconButton
                            color="error"
                            onClick={() => {
                              onClickCancel(item);
                            }}
                            size="small"
                          >
                            <IconCircleX />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <IconButton
                          disabled={!role?.update}
                          onClick={() => {
                            onClickEdit(item);
                          }}
                          size="small"
                        >
                          <IconEdit />
                        </IconButton>
                      )}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow sx={{ textAlign: 'center' }}>
                  <StyledTableCell colSpan={7} align="center">
                    <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                    <div>NO DATA</div>
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction={'row'} sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }} justifyContent={'flex-end'}>
          <TablePagination
            sx={{
              '.MuiTablePagination-toolbar': { padding: '0px' },
              borderBottom: 'none',
              marginLeft: '10px'
            }}
            color="primary"
            rowsPerPageOptions={config.arrRowperpages}
            // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            colSpan={7}
            count={totalModel}
            rowsPerPage={rowsPerPageModel}
            page={pageModel}
            slotProps={{
              select: {
                inputProps: {
                  'aria-label': 'rows per page'
                }
                // native: true
              }
            }}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Stack>
      </SubCard>
    </>
  );
};
export default TableModel;
