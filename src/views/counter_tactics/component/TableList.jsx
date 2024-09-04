import {
  InputAdornment,
  Button,
  FormControl,
  Grid,
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
  Typography,
  useTheme,
  Tooltip,
  InputLabel,
  Select,
  ListItemText,
  Checkbox,
  MenuItem,
  MenuList,
  Divider,
  Menu,
  ImageListItem,
  ImageList,
  Box
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconPlus, IconInfoCircle, IconSearch, IconEdit, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { getShift, ITEM_HEIGHT, itemData, LIST_COL, srcset } from './tablelist.service';
import { IconCheck } from '@tabler/icons-react';
import { IconPhotoScan } from '@tabler/icons-react';
import ModalShowPhoto from 'ui-component/modals/ModalShowPhoto/ModalShowPhoto';
import { IconFile } from '@tabler/icons-react';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';
import config from 'config';
import { formatDateFromDB, formatNumberWithCommas } from 'utils/helper';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import toast from 'react-hot-toast';
import { ShowConfirm } from 'ui-component/ShowDialog';
import { useEffect } from 'react';
import ModalCounterTactics from 'ui-component/modals/ModalCounterTactics/ModalCounterTactics';

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
const TableList = ({ setLoading, listProcess, statistic }) => {
  const [currentShowCol, setCurrentShowCol] = useState(
    LIST_COL.map((item) => {
      return !item.canHide ? item.id : null;
    })
  );
  const [valueTabPhoto, setValueTabPhoto] = useState('IMAGE_TAB');
  const [openModalPhoto, setOpenModalPhoto] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [search, setSearch] = useState('');
  const [reports, setReports] = useState([]);
  const [typeModal, setTypeModal] = useState('ADD');
  const open = Boolean(anchorEl);

  const getAllReportQC = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.allReportQC, { search });
    setLoading(false);
    if (res?.status === 200) {
      setReports(res?.data);
    }
  };
  useEffect(() => {
    getAllReportQC();
  }, []);

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
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <MainCard contentSX={{ padding: '10px' }}>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} mb={2}>
          <Typography variant="h4" component={'h4'}>
            List
          </Typography>
          <Stack direction={'row'} spacing={4}>
            <FormControl fullWidth sx={{ maxWidth: '220px' }} size="small" ariant="outlined">
              <OutlinedInput
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSelectedRow(null);
                    getAllReportQC();
                  }
                }}
                placeholder="Search..."
                id="outlined-adornment-password"
                type={'text'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setSelectedRow(null);
                        getAllReportQC();
                      }}
                      color="primary"
                      aria-label="search"
                      edge="end"
                    >
                      <IconSearch />
                    </IconButton>
                  </InputAdornment>
                }
                // label="Search"
              />
            </FormControl>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
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

              <Button
                disabled={!selectedRow}
                size="small"
                onClick={onClickDelete}
                startIcon={<IconTrash />}
                variant="outlined"
                color="error"
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Stack>
        <TableContainer
          sx={{
            height: `calc(100vh - 240px)`
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
                  <StyledTableCell colSpan={10} align="center">
                    <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                    <div>NO DATA</div>
                  </StyledTableCell>
                </TableRow>
              ) : (
                reports.map((item, index) => (
                  <StyledTableRow onClick={() => setSelectedRow(item)} selected={selectedRow?.reportId === item?.reportId} key={index}>
                    {currentShowCol?.includes('#') && <StyledTableCell align="center">{index + 1}</StyledTableCell>}
                    {currentShowCol?.includes('time') && (
                      <StyledTableCell align="center">
                        <div>
                          {getShift(item?.shift)} - {item?.week ? `w${item.week}` : ''}
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
                    {currentShowCol?.includes('NG_name') && <StyledTableCell align="center">{item?.nameNG}</StyledTableCell>}
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
                    {currentShowCol?.includes('tech_NG') && <StyledTableCell align="center">{item?.techNG}</StyledTableCell>}
                    {/* request date */}
                    {currentShowCol?.includes('tempSolution') && <StyledTableCell align="center">{item?.tempSolution}</StyledTableCell>}
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
                    {currentShowCol?.includes('file') && (
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
                    )}
                    {currentShowCol?.includes('replyDate') && (
                      <StyledTableCell align="center">{item?.dateReply ? formatDateFromDB(item?.dateReply, false) : ''}</StyledTableCell>
                    )}
                    {currentShowCol?.includes('author') && <StyledTableCell align="center">{item?.author}</StyledTableCell>}
                    {currentShowCol?.includes('remark') && <StyledTableCell align="center">{item?.remark}</StyledTableCell>}
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
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            colSpan={10}
            count={100}
            rowsPerPage={10}
            page={0}
            slotProps={{
              select: {
                inputProps: {
                  'aria-label': 'rows per page'
                }
                // native: true
              }
            }}
            // onPageChange={handleChangePage}
            // onRowsPerPageChange={handleChangeRowsPerPage}
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
      <ModalCounterTactics
        listProcess={listProcess}
        afterSave={() => {
          statistic();
          getAllReportQC();
        }}
        typeModal={typeModal}
        selected={selectedRow}
        setLoading={setLoading}
        open={openModal}
        onClose={() => {
          setSelectedRow(null);
          setTypeModal('ADD');
          setOpenModal(false);
        }}
      />
      <ModalShowPhoto
        selected={selectedRow}
        valueTabProp={valueTabPhoto}
        images={itemData}
        open={openModalPhoto}
        onClose={() => {
          setValueTabPhoto('');
          setOpenModalPhoto(false);
        }}
      />
    </>
  );
};

export default TableList;
