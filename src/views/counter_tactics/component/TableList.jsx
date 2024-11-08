import {
  InputAdornment,
  Button,
  FormControl,
  IconButton,
  OutlinedInput,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ListItemText,
  Checkbox,
  MenuItem,
  Menu,
  Box,
  Chip,
  Tooltip
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconPlus, IconSearch, IconEdit, IconTrash, IconEye, IconFileSpreadsheet, IconAdjustmentsAlt, IconColumns } from '@tabler/icons-react';
import { useState } from 'react';
import { getShift, LIST_COL } from './tablelist.service';
import ModalShowPhoto from 'ui-component/modals/ModalShowPhoto/ModalShowPhoto';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';
import config from 'config';
import { cssScrollbar, END_OF_CURRENT_MONTH, formatDateFromDB, formatNumberWithCommas, limitCharacter, START_OF_CURRENT_MONTH } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import toast from 'react-hot-toast';
import { ShowConfirm } from 'ui-component/ShowDialog';
import { useEffect } from 'react';
import ModalCounterTactics from 'ui-component/modals/ModalCounterTactics/ModalCounterTactics';
import MoreSearch from './MoreSearch';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: '7px'
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
const listColDefault = [];
LIST_COL.map((col) => {
  if (col?.canHide === false) {
    listColDefault.push(col?.id);
  }
});

const initFilter = {
  process: [],
  category: [],
  startDate: START_OF_CURRENT_MONTH,
  endDate: END_OF_CURRENT_MONTH
};

const TableList = ({ setLoading, listProcess, statistic, role }) => {
  const [currentShowCol, setCurrentShowCol] = useState(listColDefault);
  const [valueTabPhoto, setValueTabPhoto] = useState('IMAGE_TAB');
  const [typeModalPhoto, setTypeModalPhoto] = useState('');
  const [openModalPhoto, setOpenModalPhoto] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [lengthColShow, setLengthColShow] = useState(0);
  const [typeModal, setTypeModal] = useState('ADD');
  const [startDate, setStartDate] = useState(START_OF_CURRENT_MONTH);
  const [endDate, setEndDate] = useState(END_OF_CURRENT_MONTH);
  const [categories, setCategories] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(initFilter);
  const [arrChipFilter, setArrChipFilter] = useState([]);
  const [category, setCategory] = useState([]);
  const [anchorElMoreSearch, setAnchorElMoreSearch] = useState(null);
  const open = Boolean(anchorEl);
  const openMoreSearch = Boolean(anchorElMoreSearch);

  const getAllReportQC = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.allReportQC, {
      ...currentFilter,
      search,
      page,
      rowsPerPage,
      startDate: currentFilter?.startDate?.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endDate: currentFilter?.endDate?.endOf('day').format('YYYY-MM-DD HH:mm:ss')
    });
    setLoading(false);
    if (res?.status === 200) {
      setReports(res?.data?.data);
      setTotal(res?.data?.total);
    }
  };
  const getCategories = async () => {
    setLoading(true);
    const res = await restApi.get(RouterApi.cateConceptAll);
    setLoading(false);
    if (res?.status === 200) {
      setCategories(res?.data);
      setCategory(res?.data.map((item) => item?.categoryId));
    }
  };
  const onDeleteChip = async (type) => {
    switch (type) {
      case 'process':
        // setPersonName([]);
        setCurrentFilter((pre) => ({
          ...pre,
          process: []
        }));
        break;
      case 'category':
        setCurrentFilter((pre) => ({ ...pre, category: [] }));
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (currentFilter) {
      const arrChipResult = [];
      const labelCate = [];
      categories?.filter((cate) => {
        if (currentFilter?.category.includes(cate?.categoryId)) {
          labelCate.push(cate?.categoryName);
          return true;
        }
        return false;
      });
      if (labelCate.length > 0) {
        arrChipResult.push({
          label: `Category: ${labelCate.join(', ')}`,
          onDelete: 'category'
        });
      }

      const labelProcess = [];
      listProcess?.filter((cate) => {
        if (currentFilter?.process.includes(cate?.processId)) {
          labelProcess.push(cate?.processName);
          return true;
        }
        return false;
      });
      if (labelProcess.length > 0) {
        arrChipResult.push({
          label: `Process: ${labelProcess.join(', ')}`,
          onDelete: 'process'
        });
      }
      if (currentFilter?.startDate && currentFilter?.endDate) {
        if (currentFilter?.startDate?.isValid() && currentFilter?.endDate?.isValid()) {
          arrChipResult.push({
            label: `Date: ${currentFilter?.startDate.format('YYYY/MM/DD')} ~ ${currentFilter?.endDate.format('YYYY/MM/DD')}`,
            onDelete: ''
          });
        }
      }
      setArrChipFilter(arrChipResult);
      getAllReportQC();
    }
  }, [currentFilter]);

  useEffect(() => {
    const data = currentShowCol?.filter((item) => item);
    setLengthColShow(data?.length)
  }, [currentShowCol]);

  useEffect(() => {
    getCategories();
  }, []);
  useEffect(() => {
    getAllReportQC();
  }, [page, rowsPerPage, categories]);

  const handleClick = (event) => {
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
  const onClickDelete = async () => {
    if (selectedRow) {
      ShowConfirm({
        title: 'Delete',
        message: 'Do you want to delete?',
        onOK: async () => {
          setLoading(true);
          const res = await restApi.post(RouterApi.deleteReportQC, { reportId: selectedRow?.reportId });
          setLoading(false);
          if (res?.status === 200) {
            toast.success('Successfully deleted!');
            getAllReportQC();
            statistic();
            setSelectedRow(null);
          } else {
            toast.error(res?.data?.message || 'Delete fail!');
          }
        }
      });
    } else {
      toast.error('Please select a row in table!');
    }
  };
  const onClickExportExcel = async () => {
    setLoading(true);
    const response = await restApi.post(
      RouterApi.reportQCExportList,
      {
        search,
        page,
        rowsPerPage,
        startDate: currentFilter?.startDate?.startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        endDate: currentFilter?.endDate?.endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        category
      },
      {
        responseType: 'arraybuffer'
      }
    );
    setLoading(false);
    if (response?.status === 200) {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const date = new Date();
      const hour = date.getHours();
      const minus = date.getMinutes();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      saveAs(blob, `Export_List_${hour}${minus}_${year}${month}${day}.xlsx`);
    } else {
      toast.error('Download file fail!');
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChangeCategory = (event) => {
    const {
      target: { value }
    } = event;
    setCategory(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const handleChangePage = (event, newPage) => {
    setSelectedRow(null);
    setPage(newPage);
  };

  const onClickSearch = () => {
    getAllReportQC();
  };
  const onClickAdvanceSearch = (data) => {
    console.log('data', data);
    setCurrentFilter({
      process: data?.process,
      category: data?.category,
      startDate: data?.startDate,
      endDate: data?.endDate
    });
  };
  const handleChangeRowsPerPage = (event) => {
    setSelectedRow(null);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <MainCard contentSX={{ padding: '10px !important' }}>
        {/* <Stack spacing={2} direction={'row'} alignItems={'center'} justifyContent={'space-between'} mb={2}> */}
        <Stack spacing={1} direction="row" alignItems={'center'} justifyContent="space-between">
          <Stack spacing={1} direction="row" alignItems={'center'} justifyContent="flex-start">
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
          </Stack>

          <Stack spacing={1} direction="row" alignItems={'center'} justifyContent="flex-end">
            <FormControl fullWidth sx={{ maxWidth: '220px' }} size="small" ariant="outlined">
              {/* <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel> */}
              <OutlinedInput
                onBlur={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search..."
                id="outlined-adornment-password"
                type={'text'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-controls={openMoreSearch ? 'basic-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMoreSearch ? 'true' : undefined}
                      onClick={(event) => {
                        setAnchorElMoreSearch(event.currentTarget);
                      }}
                      aria-label="search"
                      edge="end"
                    >
                      <IconAdjustmentsAlt />
                    </IconButton>
                  </InputAdornment>
                }
              // label="Search"
              />
            </FormControl>
            <Button onClick={onClickSearch} startIcon={<IconSearch />} size="medium" variant="contained">
              Search
            </Button>
          </Stack>
        </Stack>
        {/* </Stack> */}
        <Stack mt={1.5} mb={1.5} direction={'row'} justifyContent={'flex-end'} spacing={4}>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Button
              disabled={reports?.length === 0}
              onClick={onClickExportExcel}
              startIcon={<IconFileSpreadsheet />}
              size="small"
              variant="outlined"
            >
              Excel
            </Button>
            {role?.create && (
              <Button
                onClick={() => {
                  setTypeModal('ADD');
                  setOpenModal(true);
                }}
                size="small"
                startIcon={<IconPlus />}
                variant="contained"
              >
                New
              </Button>
            )}

            {role?.update && (
              <Button
                disabled={!selectedRow}
                onClick={() => {
                  setTypeModal('EDIT');
                  setOpenModal(true);
                }}
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

            <Button
              disabled={!selectedRow}
              size="small"
              onClick={() => {
                setTypeModalPhoto('VIEW');
                setValueTabPhoto('REQUEST_TAB');
                setOpenModalPhoto(true);
              }}
              startIcon={<IconEye />}
              variant="custom"
            >
              Detail
            </Button>
          </Stack>
        </Stack>
        <TableContainer
          sx={{
            height: `calc(100vh - 270px)`,
            ...cssScrollbar
          }}
          component={Paper}
        >
          <Table style={{ tableLayout: 'fixed' }} stickyHeader sx={{ maxHeight: 200 }} aria-label="customized table">
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
              {reports?.length <= 0 ? (
                <TableRow sx={{ textAlign: 'center' }}>
                  <StyledTableCell colSpan={lengthColShow} align="center">
                    <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                    <div>NO DATA</div>
                  </StyledTableCell>
                </TableRow>
              ) : (
                reports.map((item, index) => (
                  <StyledTableRow
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setSelectedRow(item)}
                    selected={selectedRow?.reportId === item?.reportId}
                    key={index}
                  >
                    {currentShowCol?.includes('#') && <StyledTableCell align="center">{page * rowsPerPage + index + 1}</StyledTableCell>}
                    {currentShowCol?.includes('time') && (
                      <StyledTableCell align="center">
                        <div>
                          {getShift(item?.shift)} - {item?.week ? `W${item.week}` : ''}
                        </div>
                        <div>{item?.time ? formatDateFromDB(item?.time, false) : ''}</div>
                      </StyledTableCell>
                    )}

                    {currentShowCol?.includes('category') && (
                      <StyledTableCell align="center" component="th" scope="row">
                        {item?.category?.categoryName}
                      </StyledTableCell>
                    )}
                    {currentShowCol?.includes('model') && <StyledTableCell align="center">{item?.model}</StyledTableCell>}
                    {currentShowCol?.includes('code') && <StyledTableCell align="center">{item?.code}</StyledTableCell>}
                    {currentShowCol?.includes('item') && <StyledTableCell sx={{ wordBreak: 'break-all' }}>{item?.item}</StyledTableCell>}
                    {currentShowCol.includes('PL_name') && <StyledTableCell align="center">{item?.plName}</StyledTableCell>}
                    {currentShowCol?.includes('NG_name') && <StyledTableCell align="center">{
                      <span className='limit-text'>
                        {item?.nameNG}
                      </span>
                    }</StyledTableCell>}
                    {currentShowCol?.includes('percentage') && (
                      <StyledTableCell align="center">{item?.percentageNG ? item?.percentageNG + '%' : ''}</StyledTableCell>
                    )}
                    {currentShowCol?.includes('supplier') && <StyledTableCell align="center">{item?.supplier}</StyledTableCell>}
                    <StyledTableCell align="center">{item?.processQC?.processName}</StyledTableCell>
                    {currentShowCol?.includes('attributable') && <StyledTableCell align="center">{item?.attributable}</StyledTableCell>}
                    {currentShowCol?.includes('supplierRepresentative') && (
                      <StyledTableCell align="center">{item?.representative}</StyledTableCell>
                    )}
                    {/* <StyledTableCell align="center">
                      <Button
                        onClick={() => {
                          setValueTabPhoto('IMAGE_TAB');
                          setOpenModalPhoto(true);
                        }}
                        startIcon={<IconPhotoScan />}
                      >
                        Photos
                      </Button>
                      <ImageList sx={{ width: '100%', height: '100px' }} cols={2} rowHeight={100}>
                      {itemData.map((item) => (
                        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
                          <img {...srcset(item.img, 100, item.rows, item.cols)} alt={item.title} loading="lazy" />
                        </ImageListItem>
                      ))}
                    </ImageList>
                    </StyledTableCell> */}
                    {currentShowCol?.includes('tech_NG') && <StyledTableCell align="center">
                      <Tooltip title={item?.techNG}>
                        {

                          <span className='limit-text'>
                            {item?.techNG}
                          </span>
                        }
                      </Tooltip>
                    </StyledTableCell>}
                    {/* request date */}
                    {currentShowCol?.includes('tempSolution') && <StyledTableCell align="center">
                      <Tooltip title={item?.tempSolution}>
                        {

                          <span className='limit-text'>
                            {item?.tempSolution}
                          </span>
                        }
                      </Tooltip>
                    </StyledTableCell>}
                    {currentShowCol?.includes('SW_Stock') && (
                      <StyledTableCell align="center">{item?.seowonStock ? formatNumberWithCommas(item?.seowonStock) : ''}</StyledTableCell>
                    )}
                    {currentShowCol?.includes('vendorStock') && (
                      <StyledTableCell align="center">{item?.vendorStock ? formatNumberWithCommas(item?.vendorStock) : ''}</StyledTableCell>
                    )}
                    {currentShowCol?.includes('requestDate') && (
                      <StyledTableCell align="center">
                        {item?.dateRequest ? formatDateFromDB(item?.dateRequest, false) : ''}
                      </StyledTableCell>
                    )}
                    {/* reply date */}
                    {/* {currentShowCol?.includes('file') && (
                      <StyledTableCell align="center">
                        <Button
                          onClick={() => {
                            setValueTabPhoto('REQUEST_TAB');
                            setOpenModalPhoto(true);
                          }}
                          startIcon={<IconFile />}
                        >
                          Files
                        </Button>
                      </StyledTableCell>
                    )} */}
                    {currentShowCol?.includes('replyDate') && (
                      <StyledTableCell sx={{ color: '#005595' }} align="center">
                        {item?.dateReply ? formatDateFromDB(item?.dateReply, false) : ''}
                      </StyledTableCell>
                    )}
                    {currentShowCol?.includes('author') && <StyledTableCell align="center">{item?.author}</StyledTableCell>}
                    {currentShowCol?.includes('remark') && <StyledTableCell align="center">
                      <Tooltip title={item?.remark}>
                        {
                          <span className='limit-text'>

                            {item?.remark}
                          </span>
                        }
                      </Tooltip>
                    </StyledTableCell>}
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction={'row'} sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }} justifyContent={'flex-end'}>
          <Button
            size="small"
            variant="text"
            id="demo-positioned-button"
            aria-controls={open ? 'demo-positioned-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            startIcon={<IconColumns />}
            onClick={handleClick}
          >
            Show colums
          </Button>
          <TablePagination
            sx={{
              '.MuiTablePagination-toolbar': { padding: '0px' },
              borderBottom: 'none',
              marginLeft: '10px'
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
      </MainCard>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} dense>
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
              <MenuItem key={index}>
                <ListItemText>
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
      <ModalCounterTactics
        listProcess={listProcess}
        afterSave={() => {
          statistic();
          getAllReportQC();
          setSelectedRow(null);
        }}
        typeModal={typeModal}
        selected={selectedRow}
        setLoading={setLoading}
        open={openModal}
        onClose={() => {

          setTypeModal('ADD');
          setOpenModal(false);
        }}
      />
      <ModalShowPhoto
        typeModal={typeModalPhoto}
        selected={selectedRow}
        valueTabProp={valueTabPhoto}
        open={openModalPhoto}
        onClose={() => {
          setTypeModalPhoto('');
          setValueTabPhoto('');
          setOpenModalPhoto(false);
        }}
      />
      <MoreSearch
        currentFilter={currentFilter}
        processes={listProcess}
        categories={categories}
        anchorEl={anchorElMoreSearch}
        onCloseMenuFilter={() => {
          setAnchorElMoreSearch(null);
        }}
        onClickAdvanceSearch={onClickAdvanceSearch}
        open={openMoreSearch}
      />
    </>
  );
};

export default TableList;
