// material-ui
import {
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { styled } from '@mui/material/styles';
import { IconPlus, IconEdit, IconCheck, IconUser } from '@tabler/icons-react';
import SubCard from 'ui-component/cards/SubCard';
import ModalConcept from 'ui-component/modals/ModalConcept/ModalConcept';
import { cssScrollbar, END_OF_CURRENT_MONTH, formatDateFromDB, START_OF_CURRENT_MONTH } from 'utils/helper';
import dayjs from 'dayjs';
import Loading from 'ui-component/Loading';
import { useTheme } from '@mui/material/styles';
import config from 'config';
import IMAGE_EMPTYDATA from '../../assets/images/backgrounds/empty-box.png';
import './homepage.css';
import { ShowConfirm } from 'ui-component/ShowDialog';
import ModalHistory from 'ui-component/modals/ModalHistory/ModalHistory';
import { IconTrash } from '@tabler/icons-react';
import { IconFileDownload } from '@tabler/icons-react';
import { IconSearch } from '@tabler/icons-react';
import { IconAdjustmentsAlt } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import AdvanceSearch from './component/AdvanceSearch';
import AllInboxIcon from '@mui/icons-material/AllInbox';

// ==============================|| SAMPLE PAGE ||============================== //
const initFilter = {
  personName: [],
  categoryFilter: [],
  startDate: START_OF_CURRENT_MONTH,
  endDate: END_OF_CURRENT_MONTH,
  codeFilter: '',
  plNameFilter: '',
  modelFilter: '',
  productNameFilter: '',
  search: ''
};
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

const HomePage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [arrChipFilter, setArrChipFilter] = useState([]);
  const [categories, setCategories] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [codeFilter, setCodeFilter] = useState('');
  const [plNameFilter, setPlNameFilter] = useState('');
  const [modelFilter, setModelFilter] = useState('');
  const [productNameFilter, setProductNameFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const [currentFilter, setCurrentFilter] = useState(initFilter);
  const [search, setSearch] = useState('');
  const [typeModal, setTypeModal] = useState('');
  const [total, setTotal] = useState(0);
  const [role, setRole] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [users, setUsers] = useState([]);
  const [openModalConcept, setOpenModalConcept] = useState(false);
  const inputSearchRef = useRef('');

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
        // setPersonName([currentUser]);
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
      case 'search':
        setCurrentFilter((pre) => ({ ...pre, search: '' }));
        setSearch(' ');

        inputSearchRef.current = { ...inputSearchRef.current, value: ' ' };
        break;
      case 'personName':
        // setPersonName([]);
        setCurrentFilter((pre) => ({
          ...pre,
          personName: []
        }));
        break;
      case 'categoryFilter':
        setCurrentFilter((pre) => ({ ...pre, categoryFilter: [] }));
        break;
      case 'codeFilter':
        setCurrentFilter((pre) => ({ ...pre, codeFilter: '' }));
        break;
      case 'plNameFilter':
        setCurrentFilter((pre) => ({ ...pre, plNameFilter: '' }));
        break;
      case 'modelFilter':
        setCurrentFilter((pre) => ({ ...pre, modelFilter: '' }));
        break;
      case 'productNameFilter':
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
    if (currentFilter?.startDate && currentFilter?.endDate) {
      if (currentFilter?.startDate?.isValid() && currentFilter?.endDate?.isValid()) {
        arrChip.push({
          label: `Registration Date: ${currentFilter?.startDate.format('YYYY/MM/DD')} ~ ${currentFilter?.endDate.format('YYYY/MM/DD')}`,
          onDelete: ''
        });
      }
    }
    // if (currentFilter?.search) {
    //   arrChip.push({
    //     label: `Search: ${currentFilter?.search}`,
    //     onDelete: 'search'
    //   });
    // }
    if (labelCate.length > 0) {
      arrChip.push({
        label: `카테고리: ${labelCate.join(', ')}`,
        onDelete: 'categoryFilter'
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
        onDelete: 'personName'
      });
    }
    if (currentFilter?.codeFilter) {
      arrChip.push({
        label: `코드: ${currentFilter?.codeFilter}`,
        onDelete: 'codeFilter'
      });
    }
    if (currentFilter?.plNameFilter) {
      arrChip.push({
        label: `P/L Name: ${currentFilter?.plNameFilter}`,
        onDelete: 'plNameFilter'
      });
    }
    if (currentFilter?.modelFilter) {
      arrChip.push({
        label: `모델명: ${currentFilter?.modelFilter}`,
        onDelete: 'modelFilter'
      });
    }
    if (currentFilter?.productNameFilter) {
      arrChip.push({
        label: `품명: ${currentFilter?.productNameFilter}`,
        onDelete: 'productNameFilter'
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

  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClickApplyFiler = (data) => {
    const newObj = {
      personName: data?.personName,
      categoryFilter: data?.categoryFilter,
      startDate: data?.startDate,
      endDate: data?.endDate,
      codeFilter: codeFilter,
      plNameFilter: plNameFilter,
      modelFilter: modelFilter,
      productNameFilter: productNameFilter,
      search
    };
    setCurrentFilter(newObj);
    onCloseMenuFilter();
  };

  const handleAccept = async () => {
    const res = await restApi.post(RouterApi.conceptAccept, { conceptId: selectedRow?.conceptId });
    if (res?.status === 200) {
      setSelectedRow(null);
      afterSave();
      toast.success('Saved changes successful!');
    } else {
      toast.error(res?.data?.message || 'Sever error!');
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
  const onClickSearch = (e) => {
    setCurrentFilter({ ...currentFilter, search });
  };
  const onCloseMenuFilter = () => {
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
        toast.success('Successfully deleted!');
      } else {
        toast.error(res?.data?.message || 'Delete fail!');
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
              <Grid item xs={8}>
                {arrChipFilter?.length > 0
                  ? arrChipFilter.map((chip, index) => (
                      <Chip
                        key={index}
                        sx={{ marginRight: '5px', marginTop: '5px' }}
                        variant="outlined"
                        label={chip?.label}
                        onDelete={() => {
                          onDeleteChip(chip?.onDelete);
                        }}
                      />
                    ))
                  : null}
              </Grid>
              <Grid item sx={{ textAlign: 'right' }} xs={4}>
                <Stack direction={'row'} justifyContent={'flex-end'}>
                  <FormControl fullWidth sx={{ maxWidth: '220px' }} size="small" ariant="outlined">
                    <OutlinedInput
                      ref={inputSearchRef}
                      value={inputSearchRef.current.value}
                      onBlur={(e) => {
                        const { value } = e.target;
                        setSearch(value);
                        // inputSearchRef?.current?.value = value;
                      }}
                      placeholder="Search..."
                      id="outlined-adornment-password"
                      type={'text'}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleOpenMenu}
                            aria-label="search"
                            edge="end"
                          >
                            <IconAdjustmentsAlt />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                  <Button variant="contained" startIcon={<IconSearch />} onClick={onClickSearch} size="small" sx={{ marginLeft: '10px' }}>
                    Search
                  </Button>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ margin: '10px 0px' }} />
            <TableContainer
              sx={{
                marginTop: '15px',
                maxHeight:
                  !role || (!role?.create && !role?.update && !role?.accept && !role?.delete)
                    ? `calc(100vh - 250px)`
                    : `calc(100vh - 215px)`,
                ...cssScrollbar
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
                    <StyledTableCell sx={{ minWidth: '100px' }}>
                      <p className="name-colum">모델명</p>
                      <p className="name-colum">(Model)</p>
                    </StyledTableCell>
                    <StyledTableCell align="center">P/L NAME</StyledTableCell>
                    <StyledTableCell sx={{ minWidth: '150px' }}>
                      <p className="name-colum">코드</p>
                      <p className="name-colum">(Code)</p>
                    </StyledTableCell>
                    <StyledTableCell>
                      <p className="name-colum">품명</p>
                      <p className="name-colum">(Product Name)</p>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <p className="name-colum">등록일자</p>
                      <p className="name-colum">(Date)</p>
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
                        sx={{ cursor: 'pointer' }}
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
                        <StyledTableCell sx={{ wordBreak: 'break-all' }}>{row?.productName}</StyledTableCell>
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
                  rowsPerPageOptions={config.arrRowperpages}
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
      <AdvanceSearch
        currentFilter={currentFilter}
        anchorEl={anchorEl}
        open={open}
        onCloseMenuFilter={onCloseMenuFilter}
        categories={categories}
        handleClickApplyFiler={handleClickApplyFiler}
        users={users}
      />
      {loading && <Loading open={loading} />}
      <ModalHistory
        typeModal={'CONCEPT'}
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
