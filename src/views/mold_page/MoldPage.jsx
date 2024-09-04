// material-ui
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Alert,
  TextField,
  Stack,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormControl,
  Button,
  Menu,
  Box,
  MenuItem,
  ListItemText,
  Checkbox
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import config from 'config';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { styled } from '@mui/material/styles';
import { IconPlus, IconEdit, IconSearch } from '@tabler/icons-react';
import IMAGE_EMPTYDATA from '../../assets/images/backgrounds/empty-box.png';
import { DATA, LIST_COL } from './moldingpage.service.js';
import ModalInfoMold from 'ui-component/modals/ModalInfoMold/ModalInfoMold';
import toast from 'react-hot-toast';
import { IconTrash } from '@tabler/icons-react';
import ModalEditMold from 'ui-component/modals/ModalEditMold/ModalEditMold';
import Loading from 'ui-component/Loading';
import { formatDateFromDB } from 'utils/helper';
import { ShowConfirm } from 'ui-component/ShowDialog';

// ==============================|| SAMPLE PAGE ||==============================
const MoldPage = () => {
  const auth = useSelector((state) => state.auth);
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dataShow, setDataShow] = useState([]);
  const [selected, setSelected] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeModal, setTypeModal] = useState('ADD');
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataJIG, setDataJIG] = useState([]);
  const open = Boolean(anchorEl);

  const [currentShowCol, setCurrentShowCol] = useState(
    LIST_COL.map((item) => {
      return !item.canHide ? item.id : null;
    })
  );

  //   const inputRef = useRef(null);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '10px'
    }
  }));

  const getAllData = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.allJIG, {
      search,
      page,
      rowsPerPage
    });
    setLoading(false);
    if (res?.status === 200) {
      setDataJIG(res?.data);
    }
  };
  useEffect(() => {
    getAllData();
  }, [page, rowsPerPage]);

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    }
  }));
  const onScanSearch = async () => {
    if (!search) {
      return;
    }
    let newSearch = search;
    if (newSearch?.length > 6) {
      newSearch = search.slice(0, 6);
    }
    setLoading(true);
    const res = await restApi.post(RouterApi.findByAssetNoJIG, { assetNo: newSearch });
    setLoading(false);
    if (res?.status === 200) {
      if (res?.data) {
        setSelected(res?.data);
        setOpenModal(true);
      }
    } else {
      toast.error('No find:' + search, { duration: 4000 });
    }
  };
  const onSearch = () => {
    getAllData();
  };
  const onChangeCheckedCol = (e, item) => {
    const check = e.target.checked;
    switch (check) {
      case false:
        const newArr = currentShowCol.filter((i) => i !== item?.id);
        setCurrentShowCol(newArr);
        break;
      case true:
        setCurrentShowCol([...currentShowCol, item?.id]);
        break;

      default:
        break;
    }
  };
  const handleChangePage = (event, newPage) => {
    setSelectedRow(null);
    setPage(newPage);
  };

  const handleDelete = () => {
    ShowConfirm({
      title: 'Delete',
      message: 'Do you want to delete?',
      onOK: async () => {
        setLoading(true);
        const res = await restApi.post(RouterApi.deleteJIG, { jigId: selectedRow?.jigId });
        setLoading(false);
        if (res?.status === 200) {
          toast.success('Deleted successful!');
          getAllData();
        } else {
          toast.error(res?.data?.message || 'Server Error!');
        }
      }
    });
  };
  const handleChangeRowsPerPage = (event) => {
    setSelectedRow(null);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleClickShowColumn = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const onClickSelectAll = () => {
    setCurrentShowCol(LIST_COL.map((item) => item.id));
  };
  const onClickUnSelectAll = () => {
    const newArr = LIST_COL.map((item) => {
      if (!item?.canHide) {
        return item.id;
      }
    });
    setCurrentShowCol(newArr);
  };
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <MainCard contentSX={{ padding: '10px' }}>
            <Stack direction={'row'} justifyContent={'right'} spacing={2}>
              <FormControl size="small" sx={{ maxWidth: '220px' }} variant="outlined">
                <OutlinedInput
                  ref={function (input) {
                    if (input != null) {
                      input.focus();
                    }
                  }}
                  autoFocus
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onScanSearch();
                    }
                  }}
                  value={search}
                  placeholder="Search..."
                  id="outlined-adornment-password"
                  type={'text'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton color="primary" aria-label="search" onClick={onSearch} edge="end">
                        <IconSearch />
                      </IconButton>
                    </InputAdornment>
                  }
                  // label="Search"
                />
              </FormControl>
              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button
                  onClick={() => {
                    setTypeModal('ADD');
                    setTypeModal('ADD');
                    setOpenModalEdit(true);
                  }}
                  size="small"
                  startIcon={<IconPlus />}
                  variant="contained"
                >
                  New
                </Button>
                <Button
                  disabled={!selectedRow?.assetNo}
                  onClick={() => {
                    setTypeModal('EDIT');
                    setOpenModalEdit(true);
                  }}
                  size="small"
                  startIcon={<IconEdit />}
                  variant="outlined"
                >
                  Edit
                </Button>

                <Button
                  disabled={!selectedRow?.assetNo}
                  onClick={() => {
                    handleDelete();
                  }}
                  size="small"
                  startIcon={<IconTrash />}
                  variant="outlined"
                  color="error"
                >
                  Delete
                </Button>
              </Stack>
            </Stack>
            <TableContainer
              sx={{
                marginTop: '15px',
                maxHeight: `calc(100vh - 250px)`
              }}
              component={Paper}
            >
              <Table stickyHeader sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    {LIST_COL?.map(
                      (col, index) =>
                        currentShowCol.includes(col.id) && (
                          <StyledTableCell dangerouslySetInnerHTML={{ __html: col.name }} key={index} {...col}></StyledTableCell>
                        )
                    )}
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                    '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
                  }}
                >
                  {dataJIG?.length > 0 ? (
                    dataJIG?.map((row, index) => (
                      <StyledTableRow selected={selectedRow?.assetNo === row?.assetNo} onClick={() => setSelectedRow(row)} key={index}>
                        <StyledTableCell align="center">{page * rowsPerPage + index + 1}</StyledTableCell>
                        <StyledTableCell align="center" component="th" scope="row">
                          {row?.assetNo}
                        </StyledTableCell>
                        <StyledTableCell align="center">{row?.category}</StyledTableCell>
                        <StyledTableCell align="center">{row?.model}</StyledTableCell>
                        <StyledTableCell align="center">{row?.productName}</StyledTableCell>
                        <StyledTableCell align="center">{row?.version}</StyledTableCell>
                        <StyledTableCell align="center">{row?.edition}</StyledTableCell>
                        <StyledTableCell align="center">{row?.SFC}</StyledTableCell>
                        <StyledTableCell align="center">{row?.code}</StyledTableCell>
                        <StyledTableCell align="center">{row?.company}</StyledTableCell>
                        <StyledTableCell align="center">
                          {row?.inOutJig[0]?.date ? formatDateFromDB(row?.inOutJig[0]?.date, false) : ''}
                        </StyledTableCell>

                        {currentShowCol?.includes('weight') && <StyledTableCell align="center">{row?.weight}</StyledTableCell>}
                        {currentShowCol?.includes('size') && <StyledTableCell align="center">{row?.size}</StyledTableCell>}
                        {currentShowCol?.includes('maker') && <StyledTableCell align="center">{row?.maker}</StyledTableCell>}
                        {currentShowCol?.includes('type') && <StyledTableCell align="center">{row?.type}</StyledTableCell>}
                        {currentShowCol?.includes('material') && <StyledTableCell align="center">{row?.material}</StyledTableCell>}
                        {currentShowCol?.includes('location') && (
                          <StyledTableCell align="center">{row?.inOutJig[0]?.location}</StyledTableCell>
                        )}
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow sx={{ textAlign: 'center' }}>
                      <StyledTableCell colSpan={20} align="center">
                        <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                        <div>NO DATA</div>
                      </StyledTableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Stack direction={'row'} spacing={2} justifyContent={'right'}>
              <Button
                size="small"
                variant="text"
                id="demo-positioned-button"
                aria-controls={open ? 'demo-positioned-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClickShowColumn}
              >
                Show colums
              </Button>
              <TablePagination
                sx={{
                  '.MuiTablePagination-toolbar': { padding: '0px' },
                  borderBottom: 'none'
                }}
                color="primary"
                rowsPerPageOptions={[10, 20, 30]}
                // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={10}
                count={DATA.length}
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
          </MainCard>
        </Grid>
      </Grid>
      <ModalEditMold
        afterSave={() => {
          getAllData();
        }}
        typeModal={typeModal}
        selectedRow={selectedRow}
        open={openModalEdit}
        setLoading={setLoading}
        onClose={() => {
          setOpenModalEdit(false);
          setSelected(null);
        }}
      />
      <ModalInfoMold
        selectedProp={selected}
        open={openModal}
        onClose={() => {
          setSearch('');
          setOpenModal(false);
          setSelected(null);
          //   inputRef?.current?.focus();
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
        }}
        dense
      >
        <Stack pl={1} pr={1} direction={'row'} justifyContent={'space-between'}>
          <Button
            onClick={() => {
              onClickSelectAll();
            }}
            size="small"
          >
            Select all
          </Button>
          <Button
            onClick={() => {
              onClickUnSelectAll();
            }}
            size="small"
            color="error"
          >
            Unselect
          </Button>
        </Stack>
        <Box sx={{ overflowY: 'auto', maxHeight: '300px' }}>
          {LIST_COL.map((item, index) => {
            return item?.canHide ? (
              <MenuItem>
                <ListItemText key={index}>
                  <Checkbox
                    onChange={(e) => {
                      onChangeCheckedCol(e, item);
                    }}
                    checked={currentShowCol.includes(item.id)}
                  />
                  {item?.name?.replaceAll('<br/>', '')}
                </ListItemText>
              </MenuItem>
            ) : null;
          })}
        </Box>
      </Menu>
      {loading && <Loading open={loading} />}
    </>
  );
};

export default MoldPage;
