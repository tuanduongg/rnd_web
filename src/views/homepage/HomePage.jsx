// material-ui
import {
  Alert,
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
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  OutlinedInput,
  Paper,
  Select,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { styled } from '@mui/material/styles';
import { IconPlus, IconEdit, IconCheck, IconFilter, IconSearch, IconCircleCheck, IconUser } from '@tabler/icons-react';
import SubCard from 'ui-component/cards/SubCard';
import { IconX } from '@tabler/icons-react';
import { maxHeight } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import ModalConcept from 'ui-component/modals/ModalConcept/ModalConcept';
import { formatDateFromDB } from 'utils/helper';
import dayjs from 'dayjs';
import Loading from 'ui-component/Loading';

// ==============================|| SAMPLE PAGE ||============================== //
const currentDate = dayjs();
const tomorrow = currentDate.add(1, 'day');
const dayBefore20Days = currentDate.subtract(20, 'day');
const initFilter = {
  personName: [],
  categoryFilter: [],
  startDate: dayBefore20Days,
  endDate: tomorrow,
  codeFilter: '',
  plNameFilter: '',
  modelFilter: '',
  productNameFilter: ''
};
const HomePage = () => {
  const auth = useSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [personName, setPersonName] = useState([]);
  const [categoryFilter, setCategoryFiler] = useState([]);
  const [arrChipFilter, setArrChipFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [startDate, setStartDate] = useState(dayBefore20Days);
  const [endDate, setEndDate] = useState(tomorrow);
  const [codeFilter, setCodeFilter] = useState('');
  const [plNameFilter, setPlNameFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [productNameFilter, setProductNameFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState(initFilter);
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: '',
    type: true
  });
  const [users, setUsers] = useState([]);
  const [openModalConcept, setOpenModalConcept] = useState(false);

  const getCategories = async () => {
    setLoading(true);
    const res = await restApi.get(RouterApi.cateConceptAll);
    setLoading(false);
    if (res?.status === 200) {
      setCategories(res?.data);
    }
  };
  const getUsers = async () => {
    setLoading(true);
    const res = await restApi.get(RouterApi.userAll);
    setLoading(false);
    if (res?.status === 200) {
      setUsers(res?.data);
    }
  };
  const onDeleteChip = async (type) => {
    switch (type) {
      case 'personName':
        setPersonName([]);
        setCurrentFilter((pre) => ({ ...pre, personName: '' }));
        break;
      case 'categoryFilter':
        setCategoryFiler([]);
        setCurrentFilter((pre) => ({ ...pre, categoryFilter: '' }));
        break;
      case 'codeFilter':
        setCodeFilter('');
        setCurrentFilter((pre) => ({ ...pre, codeFilter: '' }));
        break;
      case 'plNameFilter':
        setPlNameFilter('');
        setCurrentFilter((pre) => ({ ...pre, plNameFilter: '' }));
        break;
      case 'modelFilter':
        setModelFilter('');
        setCurrentFilter((pre) => ({ ...pre, modelFilter: '' }));
        break;
      case 'productNameFilter':
        setProductNameFilter('');
        setCurrentFilter((pre) => ({ ...pre, productNameFilter: '' }));

        break;

      default:
        break;
    }
  };
  const getAllConcept = async (data) => {
    setLoading(true);
    const res = await restApi.post(RouterApi.conceptAll, data);
    setLoading(false);
    if (res?.status === 200) {
      setConcepts(res?.data);
    }
  };
  useEffect(() => {
    let labelCate = [];
    let labelUser = [];
    let arrChip = [];
    categories.filter((cate) => {
      if (currentFilter?.categoryFilter.includes(cate?.categoryId)) {
        labelCate.push(cate?.categoryName);
        return true;
      }
      return false;
    });
    if (labelCate.length > 0) {
      arrChip.push({
        label: `카테고리: ${labelCate.join(', ')}`,
        onDelete: (e) => {
          onDeleteChip('categoryFilter');
        }
      });
    }
    users.filter((userItem) => {
      if (currentFilter?.personName.includes(userItem?.userId)) {
        labelUser.push(userItem?.userName);
        return true;
      }
      return false;
    });
    if (labelUser?.length > 0) {
      arrChip.push({
        label: `등록자: ${labelUser.join(', ')}`,
        onDelete: (e) => {
          onDeleteChip('personName');
        }
      });
    }
    if (currentFilter?.startDate && currentFilter?.endDate) {
      if (currentFilter?.startDate?.isValid() && currentFilter?.endDate?.isValid()) {
        arrChip.push({
          label: `Date: ${currentFilter?.startDate.format('DD/MM/YYYY')} ~ ${currentFilter?.endDate.format('DD/MM/YYYY')}`,
          onDelete: false
        });
      }
    }
    if (currentFilter?.codeFilter) {
      arrChip.push({
        label: `코드: ${currentFilter?.codeFilter}`,
        onDelete: () => {
          onDeleteChip('codeFilter');
        }
      });
    }
    if (currentFilter?.plNameFilter) {
      arrChip.push({
        label: `P/L Name: ${currentFilter?.plNameFilter}`,
        onDelete: () => {
          onDeleteChip('plNameFilter');
        }
      });
    }
    if (currentFilter?.modelFilter) {
      arrChip.push({
        label: `모델명: ${currentFilter?.modelFilter}`,
        onDelete: () => {
          onDeleteChip('modelFilter');
        }
      });
    }
    if (currentFilter?.productNameFilter) {
      arrChip.push({
        label: `품명: ${currentFilter?.productNameFilter}`,
        onDelete: () => {
          onDeleteChip('productNameFilter');
        }
      });
    }
    setArrChipFilter(arrChip);
    getAllConcept(currentFilter);
  }, [currentFilter]);

  useEffect(() => {
    // getAllConcept();
    getCategories();
    getUsers();
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14
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
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickApplyFiler = () => {
    const newObj = {
      personName: personName,
      categoryFilter: categoryFilter,
      startDate: startDate,
      endDate: endDate,
      codeFilter: codeFilter,
      plNameFilter: plNameFilter,
      modelFilter: modelFilter,
      productNameFilter: productNameFilter
    };
    setCurrentFilter(newObj);
  };
  const onChangeInputFilter = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'codeFilter':
        setCodeFilter(value);
        break;
      case 'plNameFilter':
        setPlNameFilter(value);
        break;
      case 'modelFilter':
        setModelFilter(value);
        break;
      case 'productNameFilter':
        setProductNameFilter(value);
        break;

      default:
        break;
    }
  };
  const onClickResetAll = () => {
    setPersonName([]);
    setCategoryFiler([]);
    setStartDate(dayBefore20Days);
    setEndDate(tomorrow);
    setCodeFilter('');
    setPlNameFilter('');
    setModelFilter('');
    setProductNameFilter('');
  };
  const afterSave = () => {
    getAllConcept(currentFilter);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const onCloseMenuFilter = () => {
    setPersonName(currentFilter?.personName ?? []);
    setCategoryFiler(currentFilter?.categoryFilter ?? []);
    setStartDate(currentFilter?.startDate);
    setEndDate(currentFilter?.endDate);
    setCodeFilter(currentFilter?.codeFilter);
    setPlNameFilter(currentFilter?.plNameFilter);
    setModelFilter(currentFilter?.modelFilter);
    setProductNameFilter(currentFilter?.productNameFilter);

    setAnchorEl(null);
  };
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SubCard contentSX={{ padding: '13px !important' }}>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <Button
                onClick={() => {
                  setOpenModalConcept(true);
                }}
                size="small"
                startIcon={<IconPlus />}
                variant="contained"
              >
                New
              </Button>
              <Button size="small" startIcon={<IconCheck />} variant="outlined">
                Check
              </Button>
              <Button size="small" startIcon={<IconEdit />} variant="outlined">
                Edit
              </Button>
            </Stack>
            {/* </Stack> */}
          </SubCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard contentSX={{ padding: '10px' }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Button
                  sx={{ marginRight: '10px' }}
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleOpenMenu}
                  variant="text"
                  size="small"
                  startIcon={<IconFilter />}
                >
                  Filter
                </Button>
                {arrChipFilter?.length > 0
                  ? arrChipFilter.map((chip, index) => (
                      <Chip
                        key={index}
                        sx={{ marginRight: '5px', marginTop: '5px' }}
                        variant="outlined"
                        label={chip?.label}
                        onDelete={chip?.onDelete}
                      />
                    ))
                  : null}
              </Grid>
            </Grid>
            <Divider sx={{ margin: '10px 0px' }} />
            <TableContainer sx={{ marginTop: '15px' }} component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell>카테고리</StyledTableCell>
                    <StyledTableCell>모델명</StyledTableCell>
                    <StyledTableCell>P/L NAME</StyledTableCell>
                    <StyledTableCell>코드</StyledTableCell>
                    <StyledTableCell>품명</StyledTableCell>
                    <StyledTableCell align="center">등록일자</StyledTableCell>
                    <StyledTableCell align="center">등록자</StyledTableCell>
                    <StyledTableCell align="right">승인원</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {concepts?.map((row, index) => (
                    <StyledTableRow key={row.conceptId}>
                      <StyledTableCell align="center">{index + 1}</StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row?.category?.categoryName}
                      </StyledTableCell>
                      <StyledTableCell>{row?.modelName}</StyledTableCell>
                      <StyledTableCell>{row?.plName}</StyledTableCell>
                      <StyledTableCell>{row?.code}</StyledTableCell>
                      <StyledTableCell>{row?.productName}</StyledTableCell>
                      <StyledTableCell align="center">{row?.regisDate ? formatDateFromDB(row?.regisDate, false) : null}</StyledTableCell>
                      <StyledTableCell align="center">
                        <Tooltip title={row?.user?.fullName}>
                          {row?.isMe ? <IconUser />: row?.user?.userName}
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell align="right">{row?.status}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={9}
                      count={15}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            'aria-label': 'rows per page'
                          },
                          native: true
                        }
                      }}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>
      </Grid>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          //   setAnchorEl(null);
        }}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        // anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <Paper sx={{ width: { xs: 340, sm: 400 }, padding: '10px' }}>
          {/* <Grid container spacing={2}>
            <Grid item xs={12}> */}
          <Stack direction="row" alignItems={'center'} justifyContent="space-between">
            <Typography variant="h5" component="h5">
              Filter
            </Typography>
            <IconButton onClick={onCloseMenuFilter} size="small" aria-label="close">
              <IconX />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ margin: '10px 0px 0px 0px', height: '350px', overflowY: 'auto' }}>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <InputLabel id="demo-multiple-checkbox-label">카테고리</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
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
                input={<OutlinedInput label="Tag" />}
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
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <TextField
                onChange={onChangeInputFilter}
                name="modelFilter"
                value={modelFilter}
                id="standard-basic"
                label="모델명"
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
                label="코드"
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
                label="품명"
                size="small"
                variant="outlined"
              />
            </FormControl>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <InputLabel id="demo-multiple-checkbox-label">카테고리</InputLabel>
              <Select
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
                input={<OutlinedInput label="Tag" />}
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
                    <ListItemText primary={item?.userName} />
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
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { size: 'small' } }}
                  label="Start Date Registration"
                  size="small"
                />
                <DatePicker
                  autoOk={false}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  value={endDate}
                  views={['year', 'month', 'day']}
                  format="DD/MM/YYYY"
                  slotProps={{ textField: { size: 'small' } }}
                  label="End Date Registration"
                  size="small"
                />
              </Stack>
            </FormControl>
          </Box>
          <Divider />
          <Stack direction="row" alignItems={'center'} sx={{ marginTop: '10px' }} justifyContent="space-between">
            <Button onClick={onClickResetAll} size="small">
              Reset all
            </Button>
            <Button startIcon={<IconCircleCheck />} onClick={handleClickApplyFiler} variant="contained" size="small">
              Apply
            </Button>
          </Stack>
          {/* </Grid>
          </Grid> */}
        </Paper>
      </Menu>
      {loading && <Loading open={loading} />}
      <Snackbar
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={snackBar?.open}
        onClose={() => {
          setSnackBar({ open: false, message: '' });
        }}
      >
        <Alert
          onClose={() => {
            setSnackBar({ open: false, message: '' });
          }}
          severity={snackBar?.type ? 'success' : 'error'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackBar?.message}
        </Alert>
      </Snackbar>
      <ModalConcept
        afterSave={afterSave}
        setSnackBar={setSnackBar}
        categories={categories}
        open={openModalConcept}
        onClose={() => {
          setOpenModalConcept(false);
        }}
      />
    </>
  );
};

export default HomePage;
