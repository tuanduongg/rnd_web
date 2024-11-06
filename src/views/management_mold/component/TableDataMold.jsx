import {
  Box,
  Table,
  TableBody,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  Menu,
  Button,
  TablePagination,
  MenuItem,
  ListItemText,
  Checkbox,
  Tooltip,
  Grid,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Chip
} from '@mui/material';
import { limitCharacter, LIST_COL_MOLD, LIST_STATUS } from '../management_mold.service';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';
import { cssScrollbar, formatDateFromDB, getDataUserFromLocal } from 'utils/helper';
import config from 'config';
import { Stack } from '@mui/system';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconFileSpreadsheet,
  IconAdjustmentsAlt,
  IconTableOptions
} from '@tabler/icons-react';
import ModalSettingMold from 'ui-component/modals/ModalSettingMold/ModalSettingMold';
import ModalAddMold from 'ui-component/modals/ModalAddMold/ModalAddMold';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { ShowConfirm } from 'ui-component/ShowDialog';
import toast from 'react-hot-toast';
import './tabledata.css';
import ModalDetailMold from 'ui-component/modals/ModalDetailMold/ModalDetailMold';
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import AdvanceSearchMold from './AdvanceSearchMold';
import { useRef } from 'react';
import dayjs from 'dayjs';
import MenuStatus from './MenuStatusMold';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { saveAs } from 'file-saver';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IconColumns } from '@tabler/icons-react';
import { useSelector } from 'react-redux';
import CustomChip from 'ui-component/extended/CustomChip';

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
  categoryFilter: [],
  modelFilter: [],
  statusFilter: []
};
const listColDefault = [];
const dataUser = getDataUserFromLocal();
const arrShowKr = ['manufacturer', 'shipArea', 'shipDate', 'moldNo'];
const arrShowVn = ['productionStatus'];
LIST_COL_MOLD.map((col) => {
  if (dataUser?.isKorean && arrShowKr.includes(col?.id)) {
    listColDefault.push(col?.id);
  } else {
    if (col?.canHide === false || arrShowVn.includes(arrShowVn)) {
      listColDefault.push(col?.id);
    }
  }
});

const getWidthById = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const { offsetWidth } = element;
    return offsetWidth - 0.2;
  }
  return 100;
};

const TableDataMold = ({ categories, setLoading, role }) => {
  const [currentFilter, setCurrentFilter] = useState(initFilter);
  const [modelMolds, setModelMolds] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [currentShowCol, setCurrentShowCol] = useState(listColDefault);
  const [listData, setListData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [total, setTotal] = useState(0);
  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [page, setPage] = useState(0);
  const [maxWidthCell, setMaxWidthCell] = useState({});

  const [rowsPerPageModel, setRowsPerPageModel] = useState(10);
  const [pageModel, setPageModel] = useState(0);
  const [totalModel, setTotalModel] = useState(0);
  const [searchModel, setSearchModel] = useState('');
  const [searchModelSend, setSearchModelSend] = useState('');

  const [rowsPerPageCompany, setRowsPerPageCompany] = useState(10);
  const [pageCompany, setPageCompany] = useState(0);
  const [totalCompany, setTotalCompany] = useState(0);
  const [searchCompany, setSearchCompany] = useState('');
  const [searchCompanySend, setSearchCompanySend] = useState('');
  const [search, setSearch] = useState('');

  const [openModalDetail, setOpenModalDetail] = useState(false);
  const [arrChipFilter, setArrChipFilter] = useState([]);

  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [typeModalSetting, setTypeModalSetting] = useState('');
  const [tabModalSetting, setTabModalSetting] = useState('');
  const [currentPropChoose, setCurrentPropChoose] = useState('');

  const [formValues, setFormValues] = useState({});
  const [anchorElMenuSearch, setAnchorElMenuSearch] = useState(null);
  const openMenuSearch = Boolean(anchorElMenuSearch);
  const inputSearchRef = useRef('');

  const [typeModalAdd, setTypeModalAdd] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [hightLightIndex, setHightLightIndex] = useState([]);

  const [anchorElMenuStatus, setAnchorElMenuStatus] = useState(null);
  const openMenuStatus = Boolean(anchorElMenuStatus);
  const parentRef = useRef();

  const leftDrawerOpened = useSelector((state) => state.customization.opened);

  // Thiết lập virtualizer
  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: listData.length, // Tổng số hàng
    estimateSize: () => 55 // Chiều cao ước lượng của mỗi hàng
  });

  useLayoutEffect(() => {
    setTimeout(() => {
      const obj = {};
      currentShowCol?.map((col) => {
        if (col) {
          const width = getWidthById(`TH${col}`);
          obj[col] = width;
        }
      });
      setMaxWidthCell(obj);
    }, 150);
  }, [currentShowCol, leftDrawerOpened]);

  const handleOpenMenuStatus = (event) => {
    event.preventDefault();
    setAnchorElMenuStatus(event.currentTarget);
  };
  const handleCloseMenuStatus = () => {
    setAnchorElMenuStatus(null);
  };
  const getChipStatus = (item) => {
    const status = item?.productionStatus;
    let text = '';
    let color = '';
    switch (status) {
      case 'RISK':
        text = 'Risk양산';
        color = 'secondary';
        break;
      case 'DEV_EDIT':
        text = '개발수정';
        color = 'warning';
        break;
      case 'EDIT':
        text = '양산수정';
        color = 'orange';
        break;
      case 'DEV':
        text = '개발중';
        color = 'primary';
        break;
      case 'USE':
        text = '양산중';
        color = 'success';
        break;
      case 'STOP':
        text = '사용중지';
        color = 'error';
        break;

      default:
        return '';
    }
    return (
      <>
        <CustomChip
          id="cell-menu"
          aria-controls={openMenuStatus ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={openMenuStatus ? 'true' : undefined}
          onClick={handleOpenMenuStatus}
          variant={'filled'}
          label={
            <>
              <Stack direction={'row'} alignItems={'center'}>
                {text}
                <ExpandMoreIcon />
              </Stack>
            </>
          }
          size="small"
          chipcolor={color}
        />
      </>
    );
  };

  const getAllReport = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.allOutputJig, {
      ...currentFilter,
      modelFilter: currentFilter?.modelFilter?.map((item) => item?.modelID),
      page,
      rowsPerPage,
      search
    });
    setLoading(false);
    if (res?.status === 200) {
      setListData(res?.data?.data);
      setTotal(res?.data?.total);
    }
  };
  const getModelMolds = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.allModelMold, {
      page: pageModel,
      rowsPerPage: rowsPerPageModel,
      search: searchModelSend?.trim()
    });
    setLoading(false);
    if (res?.status === 200) {
      setModelMolds(res?.data?.data);
      setTotalModel(res?.data?.total);
    }
  };
  const getAllCompany = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.allCompany, {
      page: pageCompany,
      rowsPerPage: rowsPerPageCompany,
      search: searchCompanySend?.trim()
    });
    setLoading(false);
    if (res?.status === 200) {
      setTotalCompany(res?.data?.total);
      setCompanies(res?.data?.data);
    }
  };

  useEffect(() => {
    let currentArrShowColLocal = [];
    const currentShowColLocal = localStorage.getItem('SHOW_COLUMS_MOLD');
    if (currentShowColLocal) {
      currentArrShowColLocal = JSON.parse(currentShowColLocal);
    }
    if (currentArrShowColLocal?.length > 0) {
      setCurrentShowCol(currentArrShowColLocal);
    }
  }, []);
  useEffect(() => {
    getModelMolds();
  }, [pageModel, rowsPerPageModel, searchModelSend]);
  useEffect(() => {
    if (currentFilter) {
      const arrChipResult = [];
      const labelCate = [];
      const labelModel = [];
      categories?.filter((cate) => {
        if (currentFilter?.categoryFilter.includes(cate?.categoryId)) {
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

      if (currentFilter?.modelFilter.length > 0) {
        currentFilter?.modelFilter.map((option) => {
          labelModel.push(`${option?.model}(${option?.type})`);
        });
        arrChipResult.push({
          label: `Model: ${labelModel.join(' ,')})`,
          onDelete: 'model'
        });
      }

      const labelStatus = [];
      LIST_STATUS?.filter((item) => {
        if (currentFilter?.statusFilter.includes(item?.value)) {
          labelStatus.push(item?.name);
          return true;
        }
        return false;
      });
      if (labelStatus.length > 0) {
        arrChipResult.push({
          label: `Status: ${labelStatus.join(', ')}`,
          onDelete: 'status'
        });
      }

      setArrChipFilter(arrChipResult);
      getAllReport();
    }
  }, [currentFilter]);

  useEffect(() => {
    getAllCompany();
  }, [pageCompany, rowsPerPageCompany, searchCompanySend]);

  useEffect(() => {
    if (listData?.length > 0) {
      const arrModel = [];
      const arrModelIndex = [];
      listData?.map((item, index) => {
        const mixModelType = item?.model?.type + item?.model?.model + item?.model?.category?.categoryId;
        if (!arrModel?.includes(mixModelType)) {
          arrModel.push(mixModelType);
          arrModelIndex.push(index);
        }
      });
      setHightLightIndex(arrModelIndex);
    }
  }, [listData]);
  useEffect(() => {
    getAllReport();
  }, [page, rowsPerPage]);

  const open = Boolean(anchorEl);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onClickSearchReport = () => {
    getAllReport();
  };

  const onChangeCheckedCol = (e, item) => {
    const check = e.target.checked;
    switch (check) {
      case false:
        const newArr = currentShowCol.map((i) => {
          if (i) {
            if (i !== item?.id) {
              return i;
            }
          }
        });
        setCurrentShowCol(newArr);
        break;
      case true:
        setCurrentShowCol([...currentShowCol, item?.id]);
        break;

      default:
        break;
    }
  };

  const onSelectedItem = (e, data) => {
    if (data?.outputJigID === selectedRow?.outputJigID) {
      setSelectedRow(null);
    } else {
      setSelectedRow(data);
    }
  };
  const onClickShowDetail = () => {
    if (selectedRow) {
      setOpenModalDetail(true);
    }
  };
  const onClickSelectAll = () => {
    setCurrentShowCol(LIST_COL_MOLD.map((item) => item.id));
  };
  const onOpenModalSetting = (type, value) => {
    setCurrentPropChoose(value);
    setTypeModalSetting('PICK');
    setTabModalSetting(type);
    setOpenModalSetting(true);
    // setTypeModalSetting(type)
  };

  const onClickDelete = () => {
    if (selectedRow) {
      ShowConfirm({
        title: 'Delete',
        message: 'Do you want to delete?',
        onOK: async () => {
          setLoading(true);
          const res = await restApi.post(RouterApi.deleteOutputJig, { outputJigID: selectedRow?.outputJigID });
          setLoading(false);
          if (res?.status === 200) {
            toast.success('Successfully deleted!');
            afterSaveDataModalAdd();
          } else {
            toast.error(res?.data?.message || 'Delete fail!');
          }
        }
      });
    } else {
      toast.error('Please choose a row in table!');
    }
  };
  const onChooseItem = (item, type) => {
    setFormValues({ prop: currentPropChoose, value: item });
    onCloseModalSetting();
  };
  const afterSaveDataModalAdd = () => {
    setSelectedRow(null);
    getAllReport();
  };
  const onCloseModalDetail = () => {
    setOpenModalDetail(false);
  };
  const onCloseModalSetting = () => {
    setOpenModalSetting(false);
  };
  const onCloseModalAdd = () => {
    setOpenModalAdd(false);
  };
  const onClickSearch = (type) => {
    switch (type) {
      case 'COMPANY':
        setPageCompany(0);
        setSearchCompanySend(searchCompany);
        break;
      case 'MODEL':
        setPageModel(0);
        setSearchModelSend(searchModel);
        break;

      default:
        break;
    }
  };
  const onDeleteChip = async (type) => {
    switch (type) {
      case 'status':
        setCurrentFilter((pre) => ({
          ...pre,
          statusFilter: []
        }));
        break;
      case 'category':
        setCurrentFilter((pre) => ({
          ...pre,
          categoryFilter: []
        }));
        break;
      case 'model':
        setCurrentFilter((pre) => ({ ...pre, modelFilter: [] }));
        break;

      default:
        break;
    }
  };
  const onCloseMenuShowCol = () => {
    setAnchorEl(null);
    const arrStore = currentShowCol?.map((item) => {
      if (item) {
        return item;
      }
    });
    localStorage.setItem('SHOW_COLUMS_MOLD', JSON.stringify(arrStore));
  };
  const afterSave = (type) => {
    switch (type) {
      case 'COMPANY':
        getAllCompany();
        break;
      case 'MODEL':
        getModelMolds();
        break;

      default:
        break;
    }
  };
  const onCloseMenuFilter = () => {
    setAnchorElMenuSearch(null);
  };
  const onClickUnSelectAll = () => {
    const newArr = LIST_COL_MOLD.map((item) => {
      if (!item?.canHide) {
        return item.id;
      }
    });
    setCurrentShowCol(newArr);
  };
  const handleClickApplyFiler = (data) => {
    const newObj = {
      categoryFilter: data?.categoryFilter || [],
      modelFilter: data?.modelFilter || [],
      statusFilter: data?.statusFilter || []
    };
    setCurrentFilter(newObj);
    onCloseMenuFilter();
  };
  const onClickExportExcelReport = async () => {
    setLoading(true);
    const response = await restApi.post(
      RouterApi.exportExcelOutputJig,
      {
        ...currentFilter,
        modelFilter: currentFilter?.modelFilter?.map((item) => item?.modelID),
        search
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
      saveAs(blob, `Export_List_${hour}_${minus}_${year}${month}${day}.xlsx`);
    } else {
      toast.error('Download file fail!');
    }
  };

  return (
    <>
      <SubCard contentSX={{ padding: '13px !important' }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" justifyContent="space-between">
            {role?.create || role?.update ? (
              <Button
                onClick={() => {
                  setTabModalSetting('MODEL');
                  setTypeModalSetting('EDIT');
                  setOpenModalSetting(true);
                }}
                startIcon={<IconTableOptions />}
                size="small"
                variant="outlined"
              >
                Model & Places
              </Button>
            ) : null}
          </Stack>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            {role?.export && (
              <Button
                disabled={listData?.length < 1}
                onClick={onClickExportExcelReport}
                startIcon={<IconFileSpreadsheet />}
                size="small"
                variant="outlined"
              >
                Excel
              </Button>
            )}
            {role?.create && (
              <Button
                onClick={() => {
                  setTypeModalAdd('ADD');
                  setOpenModalAdd(true);
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
                onClick={() => {
                  setTypeModalAdd('EDIT');
                  setOpenModalAdd(true);
                }}
                size="small"
                disabled={!selectedRow}
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

            <Button disabled={!selectedRow} size="small" onClick={onClickShowDetail} startIcon={<IconEye />} variant="custom">
              Detail
            </Button>
          </Stack>
        </Stack>
      </SubCard>

      <MainCard sx={{ marginTop: '10px' }} contentSX={{ padding: '10px !important' }}>
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
                  defaultValue={inputSearchRef?.current?.value}
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
                        aria-controls={openMenuSearch ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMenuSearch ? 'true' : undefined}
                        onClick={(event) => {
                          setAnchorElMenuSearch(event.currentTarget);
                        }}
                        aria-label="search"
                        edge="end"
                      >
                        <IconAdjustmentsAlt />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button
                variant="contained"
                startIcon={<IconSearch />}
                onClick={() => {
                  onClickSearchReport();
                }}
                size="small"
                sx={{ marginLeft: '10px' }}
              >
                Search
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Box mt={2}>
          <TableContainer
            sx={{
              height: `calc(100vh - 315px)`,
              ...cssScrollbar
            }}
            component={Paper}
            ref={parentRef}
          >
            <Table stickyHeader sx={{ maxHeight: 200 }} aria-label="customized table">
              <TableHead>
                <StyledTableRow sx={{}}>
                  {LIST_COL_MOLD?.map(
                    (col, index) =>
                      currentShowCol.includes(col.id) && (
                        <StyledTableCell
                          dangerouslySetInnerHTML={{ __html: col.name }}
                          key={index}
                          {...col}
                          id={`TH${col?.id}`}
                          sx={{ ...col?.sx, minWidth: col?.width, flex: 1 }}
                        ></StyledTableCell>
                      )
                  )}
                </StyledTableRow>
              </TableHead>
              <TableBody
                style={{ position: 'relative', height: rowVirtualizer.getTotalSize() }}
                sx={{
                  '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                  '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
                }}
              >
                {rowVirtualizer?.getVirtualItems()?.length > 0 ? (
                  rowVirtualizer?.getVirtualItems()?.map((virtualRow) => {
                    const item = listData[virtualRow.index];
                    const index = virtualRow.index;
                    return (
                      <StyledTableRow
                        key={virtualRow.index}
                        ref={virtualRow.measureRef}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          transform: `translateY(${virtualRow.start}px)`,
                          height: `${virtualRow.size}px`,
                          maxWidth: `100%`,
                          width: `100%`,
                          display: 'flex' // Bố trí flex
                        }}
                        sx={{ cursor: 'pointer' }}
                        selected={item?.outputJigID === selectedRow?.outputJigID}
                      >
                        {currentShowCol?.includes('#') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`#`] || 100,
                              minWidth: -1.2 + maxWidthCell[`#`] || 100
                            }}
                            align="center"
                          >
                            {index + 1}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('category') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`category`],
                              minWidth: -1 + maxWidthCell[`category`] || 100
                            }}
                            className={!hightLightIndex?.includes(index) ? 'no-hight-linght' : ''}
                            align="center"
                          >
                            {item?.model?.category?.categoryName}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('project') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`project`],
                              minWidth: -1 + maxWidthCell[`project`] || 100
                            }}
                            className={!hightLightIndex?.includes(index) ? 'no-hight-linght' : ''}
                            align="center"
                          >
                            {item?.model?.projectName}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('type') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`type`],
                              minWidth: -1 + maxWidthCell[`type`] || 100
                            }}
                            className={!hightLightIndex?.includes(index) ? 'no-hight-linght' : ''}
                            align="center"
                          >
                            {item?.model?.type}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('model') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`model`],
                              minWidth: -1 + maxWidthCell[`model`] || 100
                            }}
                            className={!hightLightIndex?.includes(index) ? 'no-hight-linght' : ''}
                            align="center"
                          >
                            <Tooltip placement="right" title={item?.model?.description}>
                              {item?.model?.model}
                            </Tooltip>
                          </StyledTableCell>
                        )}
                        {/* {currentShowCol?.includes('description') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`description`],
                              minWidth: -1 + maxWidthCell[`description`] || 100
                            }}
                            align="center"
                          >
                            {item?.model?.description ? (
                              <Tooltip placement="right" title={item?.model?.description}>
                                {limitCharacter(item?.model?.description, 18, true)}
                              </Tooltip>
                            ) : (
                              ''
                            )}
                          </StyledTableCell>
                        )} */}
                        {currentShowCol?.includes('moldNo') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`moldNo`],
                              minWidth: -1 + maxWidthCell[`moldNo`] || 100
                            }}
                            align="center"
                          >
                            {item?.moldNo ? `#${item?.moldNo}` : ''}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('manufacturer') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`manufacturer`],
                              minWidth: -1 + maxWidthCell[`manufacturer`] || 100
                            }}
                            align="center"
                          >
                            <Tooltip placement="right" title={item?.manufacturer?.companyName}>
                              {item?.manufacturer?.companyCode}
                            </Tooltip>
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('shipArea') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`shipArea`],
                              minWidth: -1 + maxWidthCell[`shipArea`] || 100
                            }}
                            align="center"
                          >
                            <Tooltip placement="right" title={item?.shipArea?.companyName}>
                              {item?.shipArea?.companyCode}
                            </Tooltip>
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('shipDate') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`shipDate`],
                              minWidth: -1 + maxWidthCell[`shipDate`] || 100
                            }}
                            align="center"
                          >
                            {formatDateFromDB(item?.shipDate, false)}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('massCompany') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`massCompany`],
                              minWidth: -1 + maxWidthCell[`massCompany`] || 100
                            }}
                            align="center"
                          >
                            {item?.massCompany ? (
                              <Tooltip placement="right" title={item?.massCompany?.companyName}>
                                {item?.massCompany?.companyCode}
                              </Tooltip>
                            ) : (
                              ''
                            )}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('developDate') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`developDate`],
                              minWidth: -1 + maxWidthCell[`developDate`] || 100
                            }}
                            align="center"
                          >
                            {formatDateFromDB(item?.developDate, false)}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('shipMassCompany') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`shipMassCompany`],
                              minWidth: -1 + maxWidthCell[`shipMassCompany`] || 100
                            }}
                            align="center"
                          >
                            {formatDateFromDB(item?.shipMassCompany, false)}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('modificationCompany') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`modificationCompany`],
                              minWidth: -1 + maxWidthCell[`modificationCompany`] || 100
                            }}
                            align="center"
                          >
                            {item?.historyTryNo[0] ? (
                              <Tooltip placement="right" title={item?.historyTryNo[0]?.modificationCompany?.companyName}>
                                {item?.historyTryNo[0]?.modificationCompany?.companyCode}
                              </Tooltip>
                            ) : (
                              ''
                            )}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('outputEdit') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`outputEdit`],
                              minWidth: -1 + maxWidthCell[`outputEdit`] || 100
                            }}
                            align="center"
                          >
                            {item?.historyTryNo[0] ? formatDateFromDB(item?.historyTryNo[0]?.outputEdit, false) : ''}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('wearingPlan') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`wearingPlan`],
                              minWidth: -1 + maxWidthCell[`wearingPlan`] || 100
                            }}
                            align="center"
                          >
                            {item?.historyTryNo[0] ? formatDateFromDB(item?.historyTryNo[0]?.wearingPlan, false) : ''}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('receivingCompleted') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`receivingCompleted`],
                              minWidth: -1 + maxWidthCell[`receivingCompleted`] || 100
                            }}
                            align="center"
                          >
                            {item?.historyTryNo[0] ? formatDateFromDB(item?.historyTryNo[0]?.receivingCompleted, false) : ''}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('tryNo') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              textAlign: 'center',
                              maxWidth: maxWidthCell[`tryNo`],
                              minWidth: -1 + maxWidthCell[`tryNo`] || 100
                            }}
                            align="center"
                          >
                            {item?.historyTryNo[0]?.tryNum ? `T${item?.historyTryNo[0]?.tryNum}` : ''}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('historyEdit') && (
                          <StyledTableCell
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`historyEdit`],
                              minWidth: -1 + maxWidthCell[`historyEdit`] || 100
                            }}
                            align="center"
                          >
                            {item?.historyTryNo[0] ? (
                              <Tooltip placement="right" title={item?.historyTryNo[0]?.remark}>
                                {limitCharacter(item?.historyTryNo[0]?.remark, 18, true)}
                              </Tooltip>
                            ) : (
                              ''
                            )}
                          </StyledTableCell>
                        )}
                        {currentShowCol?.includes('productionStatus') && (
                          <StyledTableCell
                            onClick={(e) => {
                              // e.stopPropagation();
                              setSelectedRow(item);
                              // onSelectedItem(e, item);
                            }}
                            sx={{
                              alignContent: 'center',
                              flex: 1,
                              maxWidth: maxWidthCell[`productionStatus`],
                              minWidth: -1 + maxWidthCell[`productionStatus`] || 100
                            }}
                            align="center"
                          >
                            {getChipStatus(item)}
                          </StyledTableCell>
                        )}
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <TableRow sx={{ textAlign: 'center' }}>
                    <StyledTableCell
                      colSpan={
                        currentShowCol.filter((_i) => {
                          if (_i) return true;
                          return false;
                        }).length
                      }
                      align="center"
                    >
                      <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                      <div>NO DATA</div>
                    </StyledTableCell>
                  </TableRow>
                )}
                {/* {listData?.length <= 0 ? (
                  <TableRow sx={{ textAlign: 'center' }}>
                    <StyledTableCell
                      colSpan={
                        currentShowCol.filter((_i) => {
                          if (_i) return true;
                          return false;
                        }).length
                      }
                      align="center"
                    >
                      <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                      <div>NO DATA</div>
                    </StyledTableCell>
                  </TableRow>
                ) : (
                  listData.map((item, index) => (
                    <StyledTableRow
                      sx={{ cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedRow(item);
                      }}
                      selected={item?.outputJigID === selectedRow?.outputJigID}
                      key={index}
                    >
                      {currentShowCol?.includes('#') && <StyledTableCell align="center">{page * rowsPerPage + index + 1}</StyledTableCell>}
                      {currentShowCol?.includes('category') && (
                        <StyledTableCell className={!hightLightIndex?.includes(index) ? 'no-hight-linght' : ''} align="center">
                          {item?.model.category?.categoryName}
                        </StyledTableCell>
                      )}
                      {currentShowCol?.includes('project') && (
                        <StyledTableCell className={!hightLightIndex?.includes(index) ? 'no-hight-linght' : ''} align="center">
                          {item?.model?.projectName}
                        </StyledTableCell>
                      )}
                      {currentShowCol?.includes('type') && (
                        <StyledTableCell className={!hightLightIndex?.includes(index) ? 'no-hight-linght' : ''} align="center">
                          {item?.model?.type}
                        </StyledTableCell>
                      )}
                      {currentShowCol?.includes('model') && (
                        <StyledTableCell className={!hightLightIndex?.includes(index) ? 'no-hight-linght' : ''} align="center">
                          {item?.model?.model}
                        </StyledTableCell>
                      )}
                      {currentShowCol?.includes('description') && (
                        <StyledTableCell align="center">{item?.model?.description}</StyledTableCell>
                      )}
                      {currentShowCol?.includes('moldNo') && <StyledTableCell align="center">{item?.moldNo}</StyledTableCell>}
                      {currentShowCol?.includes('manufacturer') && (
                        <StyledTableCell align="center">
                          <Tooltip title={item?.manufacturer?.companyName}>{item?.manufacturer?.companyCode}</Tooltip>
                        </StyledTableCell>
                      )}
                      {currentShowCol?.includes('shipArea') && (
                        <StyledTableCell align="center">
                          <Tooltip title={item?.shipArea?.companyName}>{item?.shipArea?.companyCode}</Tooltip>
                        </StyledTableCell>
                      )}
                      {currentShowCol?.includes('shipDate') && (
                        <StyledTableCell align="center">{formatDateFromDB(item?.shipDate, false)}</StyledTableCell>
                      )}
                      {currentShowCol?.includes('massCompany') && (
                        <StyledTableCell align="center">
                          {item?.massCompany ? (
                            <Tooltip title={item?.massCompany?.companyName}>{item?.massCompany?.companyCode}</Tooltip>
                          ) : (
                            ''
                          )}
                        </StyledTableCell>
                      )}
                      {currentShowCol?.includes('shipMassCompany') && (
                        <StyledTableCell align="center">{formatDateFromDB(item?.shipMassCompany, false)}</StyledTableCell>
                      )}
                      {currentShowCol?.includes('modificationCompany') && (
                        <StyledTableCell align="center">
                          {item?.modificationCompany ? (
                            <Tooltip title={item?.modificationCompany?.companyName}>{item?.modificationCompany?.companyCode}</Tooltip>
                          ) : (
                            ''
                          )}
                        </StyledTableCell>
                      )}
                      {currentShowCol?.includes('outputEdit') && (
                        <StyledTableCell align="center">{formatDateFromDB(item?.outputEdit, false)}</StyledTableCell>
                      )}
                      {currentShowCol?.includes('wearingPlan') && (
                        <StyledTableCell align="center">
                          {item?.wearingPlan ? (
                            <Tooltip title={item?.wearingPlan?.companyName}>{item?.wearingPlan?.companyCode}</Tooltip>
                          ) : (
                            ''
                          )}
                        </StyledTableCell>
                      )}
                      {currentShowCol?.includes('receivingCompleted') && (
                        <StyledTableCell align="center">{formatDateFromDB(item?.receivingCompleted, false)}</StyledTableCell>
                      )}
                      {currentShowCol?.includes('tryNo') && <StyledTableCell align="center">{item?.tryNo}</StyledTableCell>}
                      {currentShowCol?.includes('historyEdit') && <StyledTableCell align="center">{item?.historyEdit}</StyledTableCell>}
                      {currentShowCol?.includes('productionStatus') && (
                        <StyledTableCell align="center">{getChipStatus(item?.productionStatus)}</StyledTableCell>
                      )}
                    </StyledTableRow>
                  ))
                )} */}
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
              onClick={(event) => {
                setAnchorEl(event.currentTarget);
              }}
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
              rowsPerPageOptions={[50, 100, 150, 200]}
              // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={20}
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
        </Box>
      </MainCard>

      <Menu anchorEl={anchorEl} open={open} onClose={onCloseMenuShowCol} dense>
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
          {LIST_COL_MOLD.map((item, index) => {
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
      <ModalDetailMold setLoading={setLoading} selected={selectedRow} open={openModalDetail} onClose={onCloseModalDetail} />
      <ModalAddMold
        afterSave={afterSaveDataModalAdd}
        typeModal={typeModalAdd}
        selected={selectedRow}
        setFormValues={formValues}
        onOpenModalSetting={onOpenModalSetting}
        categories={categories}
        onClose={onCloseModalAdd}
        open={openModalAdd}
      />
      <ModalSettingMold
        role={role}
        onChooseItem={onChooseItem}
        onClickSearch={onClickSearch}
        searchModel={searchModel}
        setSearchModel={setSearchModel}
        searchCompany={searchCompany}
        setSearchCompany={setSearchCompany}
        rowsPerPageModel={rowsPerPageModel}
        setRowsPerPageModel={setRowsPerPageModel}
        pageModel={pageModel}
        setPageModel={setPageModel}
        totalModel={totalModel}
        setTotalModel={setTotalModel}
        rowsPerPageCompany={rowsPerPageCompany}
        setRowsPerPageCompany={setRowsPerPageCompany}
        pageCompany={pageCompany}
        setPageCompany={setPageCompany}
        totalCompany={totalCompany}
        setTotalCompany={setTotalCompany}
        afterSave={afterSave}
        modelMolds={modelMolds}
        companies={companies}
        valueTabProp={tabModalSetting}
        typeModal={typeModalSetting}
        categories={categories}
        open={openModalSetting}
        onClose={onCloseModalSetting}
      />
      <AdvanceSearchMold
        currentFilter={currentFilter}
        anchorEl={anchorElMenuSearch}
        open={openMenuSearch}
        onCloseMenuFilter={onCloseMenuFilter}
        categories={categories}
        handleClickApplyFiler={handleClickApplyFiler}
      />
      <MenuStatus
        afterSave={afterSaveDataModalAdd}
        selected={selectedRow}
        anchorElMenuStatus={anchorElMenuStatus}
        open={openMenuStatus}
        handleClose={handleCloseMenuStatus}
      />
    </>
  );
};

export default TableDataMold;
