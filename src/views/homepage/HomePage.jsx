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
  OutlinedInput,
  Paper,
  Portal,
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
import DoneIcon from '@mui/icons-material/Done';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { styled } from '@mui/material/styles';
import { IconPlus, IconEdit, IconCheck, IconFilter, IconCircleCheckFilled, IconCircleCheck, IconUser, IconEye } from '@tabler/icons-react';
import SubCard from 'ui-component/cards/SubCard';
import { IconX } from '@tabler/icons-react';
import { maxHeight, padding } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import ModalConcept from 'ui-component/modals/ModalConcept/ModalConcept';
import { formatDateFromDB } from 'utils/helper';
import dayjs from 'dayjs';
import Loading from 'ui-component/Loading';
import { useTheme } from '@mui/material/styles';
import config from 'config';
import IMAGE_EMPTYDATA from '../../assets/images/backgrounds/empty-box.png';
import './homepage.css';
import { ShowConfirm } from 'ui-component/ShowDialog';
import ModalHistory from 'ui-component/modals/ModalHistory/ModalHistory';
import { IconTrash } from '@tabler/icons-react';
import { isMobile } from 'react-device-detect';
import { IconFileDownload } from '@tabler/icons-react';

// ==============================|| SAMPLE PAGE ||============================== //
const currentDate = dayjs();
// Lấy ngày đầu tiên của tháng hiện tại
const firstDayOfCurrentMonth = currentDate.startOf('month');

// Lấy ngày đầu tiên của tháng trước
const firstDayOfLastMonth = firstDayOfCurrentMonth.subtract(1, 'month');

// Lấy ngày đầu tiên của tháng sau
const firstDayOfNextMonth = firstDayOfCurrentMonth.add(1, 'month');

// const firstDayOfNextMonth = currentDate.add(10, 'day');
// const firstDayOfLastMonth = currentDate.subtract(20, 'day');
const initFilter = {
  personName: [],
  categoryFilter: [],
  startDate: firstDayOfLastMonth,
  endDate: firstDayOfNextMonth,
  codeFilter: '',
  plNameFilter: '',
  modelFilter: '',
  productNameFilter: ''
};
const HomePage = () => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [personName, setPersonName] = useState([]);
  const [categoryFilter, setCategoryFiler] = useState([]);
  const [arrChipFilter, setArrChipFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [startDate, setStartDate] = useState(firstDayOfLastMonth);
  const [endDate, setEndDate] = useState(firstDayOfNextMonth);
  const [codeFilter, setCodeFilter] = useState('');
  const [plNameFilter, setPlNameFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [productNameFilter, setProductNameFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [currentFilter, setCurrentFilter] = useState(initFilter);
  const [typeModal, setTypeModal] = useState('');
  const [total, setTotal] = useState(0);
  const [role, setRole] = useState({});
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: '',
    type: true
  });
  const [selectedRow, setSelectedRow] = useState(null);

  const [users, setUsers] = useState([]);
  const [openModalConcept, setOpenModalConcept] = useState(false);

  const checkRole = async () => {
    setLoading(true);
    const res = await restApi.get(RouterApi.checkRole);
    setLoading(false);
    if (res?.status === 200) {
      setRole(res?.data);
      const is_create = res?.data?.create;
      const is_update = res?.data?.update;
      const is_delete = res?.data?.delete;
      const is_import = res?.data?.import;
      const is_export = res?.data?.export;
      const is_accept = res?.data?.accept;
      if (
        (is_create && is_update && !is_delete && !is_import && !is_export && !is_accept) ||
        (is_create && is_update && is_delete && !is_import && !is_export && !is_accept)
      ) {
        const currentUser = auth?.dataUser?.userId;
        setCurrentFilter({ ...initFilter, personName: [currentUser] });
        setPersonName([currentUser]);
      }
    }
  };
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
    const res = await restApi.get(RouterApi.userPublic);
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
    const res = await restApi.post(RouterApi.conceptAll, {
      ...data,
      page,
      rowsPerPage,
      startDate: data?.startDate?.hour(0).minute(0).second(0),
      endDate: data?.endDate?.hour(23).minute(59).second(59)
    });
    setLoading(false);
    if (res?.status === 200) {
      setConcepts(res?.data?.data);
      setTotal(res?.data?.total);
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
          label: `Registration Date: ${currentFilter?.startDate.format('YYYY/MM/DD')} ~ ${currentFilter?.endDate.format('YYYY/MM/DD')}`,
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
    setPage(0);
  }, [currentFilter]);

  useEffect(() => {
    getAllConcept(currentFilter);
  }, [page, rowsPerPage, arrChipFilter]);

  useEffect(() => {
    getUsers();
    getCategories();
    // getAllConcept();
    checkRole();
  }, []);

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
    setStartDate(firstDayOfLastMonth);
    setEndDate(firstDayOfNextMonth);
    setCodeFilter('');
    setPlNameFilter('');
    setModelFilter('');
    setProductNameFilter('');
  };
  const handleAccept = async () => {
    const res = await restApi.post(RouterApi.conceptAccept, { conceptId: selectedRow?.conceptId });
    if (res?.status === 200) {
      setSelectedRow(null);
      afterSave();
      setSnackBar({ open: true, message: 'Saved changes successful!', type: true });
    } else {
      setSnackBar({ open: true, message: res?.data?.message || 'Server Error!', type: false });
    }
  };
  const onClickAccept = async () => {
    ShowConfirm({
      title: 'Accept',
      message: 'Do you want to accept it?',
      onOK: () => {
        handleAccept();
      }
    });
  };
  const afterSave = () => {
    setSelectedRow(null);
    getAllConcept(currentFilter);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const onCloseMenuFilter = () => {
    if (currentFilter?.personName || Array.isArray(currentFilter?.personName)) {
      setPersonName(currentFilter?.personName || []);
    } else {
      setPersonName([]);
    }
    if (currentFilter?.categoryFilter || Array.isArray(currentFilter?.categoryFilter)) {
      setCategoryFiler(currentFilter?.categoryFilter || []);
    } else {
      setPersonName([]);
    }
    setStartDate(currentFilter?.startDate);
    setEndDate(currentFilter?.endDate);
    setCodeFilter(currentFilter?.codeFilter);
    setPlNameFilter(currentFilter?.plNameFilter);
    setModelFilter(currentFilter?.modelFilter);
    setProductNameFilter(currentFilter?.productNameFilter);

    setAnchorEl(null);
  };

  const onClickDelete = () => {
    ShowConfirm({
      title: 'Delete',
      message: 'Do you want to delete it ?',
      onOK: () => {
        onDelete();
      }
    });
  };
  const onDelete = async () => {
    if (selectedRow && selectedRow?.conceptId) {
      const res = await restApi.post(RouterApi.conceptDelete, { conceptId: selectedRow?.conceptId });
      if (res?.status === 200) {
        afterSave();
        setSnackBar({ open: true, message: res?.data?.message || 'Delete successful !', type: true });
      } else {
        setSnackBar({ open: true, message: res?.data?.message || 'Server Error!', type: false });
      }
    }
  };
  const handleChangePage = (event, newPage) => {
    setSelectedRow(null);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setSelectedRow(null);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      <Grid container spacing={1}>
        {(role?.create || role?.accept || role?.update) && (
          <Grid item xs={12}>
            <SubCard contentSX={{ padding: '13px !important' }}>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                {role?.create && (
                  <Button
                    onClick={() => {
                      setTypeModal('ADD');
                      setOpenModalConcept(true);
                    }}
                    size="small"
                    startIcon={<IconPlus />}
                    variant="contained"
                  >
                    New
                  </Button>
                )}
                {role?.accept && (
                  <Button
                    size="small"
                    disabled={!selectedRow || selectedRow?.approval || selectedRow?.isMe}
                    onClick={onClickAccept}
                    startIcon={<IconCheck />}
                    variant="outlined"
                  >
                    Accept
                  </Button>
                )}
                {role?.update && (
                  <Button
                    onClick={() => {
                      setTypeModal('EDIT');
                      setOpenModalConcept(true);
                    }}
                    disabled={!selectedRow?.isMe}
                    size="small"
                    startIcon={<IconEdit />}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                )}

                {role?.delete && (
                  <Button
                    onClick={onClickDelete}
                    disabled={!selectedRow}
                    size="small"
                    startIcon={<IconTrash />}
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                )}
              </Stack>
              {/* </Stack> */}
            </SubCard>
          </Grid>
        )}
        <Grid item xs={12}>
          <MainCard contentSX={{ padding: '10px !important' }}>
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
            <TableContainer
              sx={{
                marginTop: '15px',
                maxHeight:
                  !role || (!role?.create && !role?.update && !role?.accept && !role?.delete)
                    ? `calc(100vh - 250px)`
                    : `calc(100vh - 215px)`
              }}
              component={Paper}
            >
              <Table stickyHeader sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell>
                      <p className="name-colum">카테고리</p>
                      <p className="name-colum">(Category)</p>
                    </StyledTableCell>
                    <StyledTableCell  sx={{ minWidth: '100px' }}>
                      <p className="name-colum">모델명</p>
                      <p className="name-colum">(Model)</p>
                    </StyledTableCell>
                    <StyledTableCell  align="center">P/L NAME</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: '130px' }}>
                      <p className="name-colum">코드</p>
                      <p className="name-colum">(Code)</p>
                    </StyledTableCell>
                    <StyledTableCell>
                      <p className="name-colum">품명</p>
                      <p className="name-colum">(Product Name)</p>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <p className="name-colum">등록일자</p>
                      <p className="name-colum">(Regis Date)</p>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <p className="name-colum">등록자</p>
                      <p className="name-colum"> (Registrant)</p>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <p className="name-colum">승인원</p>
                      <p className="name-colum">(Approval)</p>
                    </StyledTableCell>
                    <StyledTableCell sx={{ width: '20px' }} align="right"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                    '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
                  }}
                >
                  {concepts?.length > 0 ? (
                    concepts?.map((row, index) => (
                      <StyledTableRow
                        selected={selectedRow?.conceptId === row?.conceptId}
                        onClick={() => setSelectedRow(row)}
                        key={row.conceptId}
                      >
                        <StyledTableCell align="center">{page * rowsPerPage + index + 1}</StyledTableCell>
                        <StyledTableCell align="center" component="th" scope="row">
                          {row?.category?.categoryName}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row?.modelName}</StyledTableCell>
                        <StyledTableCell align="center">{row?.plName}</StyledTableCell>
                        <StyledTableCell align="center">{row?.code}</StyledTableCell>
                        <StyledTableCell sx={{wordBreak:'break-all'}}>{row?.productName}</StyledTableCell>
                        <StyledTableCell align="center">{row?.regisDate ? formatDateFromDB(row?.regisDate, false) : null}</StyledTableCell>
                        <StyledTableCell align="center">
                          <Tooltip arrow title={row?.user?.fullName}>
                            {row?.isMe ? <IconUser /> : row?.user?.userName}
                          </Tooltip>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <span style={{ fontWeight: '500' }}>{row?.approval}</span>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {/* <Tooltip arrow placement='left' title="Download"> */}
                          <IconButton
                            color="primary"
                            onClick={() => {
                              setSelectedRow(row);
                              setTypeModal('VIEW');
                              setOpenModalConcept(true);
                            }}
                            size="small"
                            aria-label="Download"
                          >
                            <IconFileDownload />
                          </IconButton>
                          {/* </Tooltip> */}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow sx={{ textAlign: 'center' }}>
                      <StyledTableCell colSpan={10} align="center">
                        <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                        <div>NO DATA</div>
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {concepts?.length > 0 && (
              <Stack direction={'row'} sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }} justifyContent={'flex-end'}>
                <TablePagination
                  sx={{
                    '.MuiTablePagination-toolbar': { padding: '0px' },
                    borderBottom: 'none'
                  }}
                  color="primary"
                  rowsPerPageOptions={[5, 10, 25, 100,500,1000]}
                  // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={10}
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={page}
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
            )}
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
        <Paper sx={{ width: '100%', maxWidth: { xs: 340, sm: 400 }, padding: '10px' }}>
          {/* <Grid container spacing={2}>
            <Grid item xs={12}> */}
          <Stack direction="row" alignItems={'center'} justifyContent="space-between">
            <Typography color={'primary'} variant="h4" component="h4">
              Filter
            </Typography>
            <IconButton onClick={onCloseMenuFilter} size="small" aria-label="close">
              <IconX />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ margin: '10px 0px 0px 0px', height: { xs: '380px' }, overflowY: 'auto' }}>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <InputLabel htmlFor="demo-multiple-checkbox">카테고리(Category)</InputLabel>
              <Select
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
            </FormControl>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <InputLabel id="demo-simple-select-label">카테고리(Registrant)</InputLabel>
              <Select
                id="demo-simple-select"
                labelId="demo-simple-select-label"
                label="카테고리(Registrant)"
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
            <Button startIcon={<IconCircleCheck />} onClick={handleClickApplyFiler} variant="contained" size="small">
              Apply
            </Button>
          </Stack>
          {/* </Grid>
          </Grid> */}
        </Paper>
      </Menu>
      {loading && <Loading open={loading} />}
      <Portal>
        <Snackbar
          autoHideDuration={2000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackBar?.open}
          onClose={() => {
            setSnackBar({ open: false, message: '', type: snackBar?.type });
          }}
        >
          <Alert
            onClose={() => {
              setSnackBar({ open: false, message: '', type: snackBar?.type });
            }}
            severity={snackBar?.type ? 'success' : 'error'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackBar?.message}
          </Alert>
        </Snackbar>
      </Portal>
      <ModalHistory
        selected={selectedRow}
        open={openModalHistory}
        onClose={() => {
          setOpenModalHistory(false);
        }}
      />
      <ModalConcept
        showModalHistory={() => {
          setOpenModalHistory(true);
        }}
        setLoading={setLoading}
        selected={selectedRow}
        typeModal={typeModal}
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
