import {
  Box,
  Button,
  Divider,
  IconButton,
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
  TableRow
} from '@mui/material';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import config from 'config';
import { useEffect, useState } from 'react';
import ModalAddNewData from './ModalAddNewData';
import { LIST_TAB } from '../ModalDetailMold';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';
import { formatDateFromDB } from 'utils/helper';
import { ShowConfirm } from 'ui-component/ShowDialog';
import toast from 'react-hot-toast';

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
  cursor: 'pointer',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));
export const TABLE_ADD_BEFORE = 'TABLE_ADD_BEFORE';
export const TABLE_ADD_AFTER = 'TABLE_ADD_AFTER';

const ListTab = ({ dataHistoryTryNo, valueTab, selectedRow, setLoading }) => {
  const [typeTableAdd, setTypeTableAdd] = useState('');
  const [typeModalAdd, setTypeModalAdd] = useState('ADD');
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [selectedRowBefore, setSelectedRowBefore] = useState(null);
  const [selectedRowAfter, setSelectedRowAfter] = useState(null);

  const [dataBefore, setDataBefore] = useState([]);
  const [pageBefore, setPageBefore] = useState(0);
  const [totalPageBefore, setTotalPageBefore] = useState(0);
  const [rowPerPageBefore, setRowPerPageBefore] = useState(10);

  const [dataAfter, setDataAfter] = useState([]);
  const [pageAfter, setPageAfter] = useState(0);
  const [totalPageAfter, setTotalPageAfter] = useState(0);
  const [rowPerPageAfter, setRowPerPageAfter] = useState(10);

  const getAllDetailMoldBefore = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.detailMoldBeforeAll, { page: pageBefore, rowsPerPage: rowPerPageBefore });
    if (res?.status === 200) {
      setLoading(false);
      setTotalPageBefore(res?.data?.total);
      setDataBefore(res?.data.data);
    }
  };
  const getAllDetailMoldAfter = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi.detailMoldAfterAll, { page: pageAfter, rowsPerPage: rowPerPageAfter });
    if (res?.status === 200) {
      setLoading(false);
      setTotalPageAfter(res?.data?.total);
      setDataAfter(res?.data.data);
    }
  };
  useEffect(() => {
    getAllDetailMoldBefore();
  }, [pageBefore, rowPerPageBefore]);
  useEffect(() => {
    getAllDetailMoldAfter();
  }, [pageAfter, rowPerPageAfter]);

  const afterSave = () => {
    switch (typeTableAdd) {
      case TABLE_ADD_BEFORE:
        getAllDetailMoldBefore();
        setSelectedRowBefore(null);
        break;
      case TABLE_ADD_AFTER:
        getAllDetailMoldAfter();
        setSelectedRowAfter(null);
        break;

      default:
        break;
    }
  };
  const onCloseModalAdd = () => {
    setOpenModalAdd(false);
    // setTypeTableAdd('');
  };

  const handleChangePageAfter = (event, newPage) => {
    setPageAfter(newPage);
  };
  const handleChangeRowsPerPageAfter = (event) => {
    setRowPerPageAfter(parseInt(event.target.value, 10));
    setPageAfter(0);
  };

  const handleChangePageBefore = (event, newPage) => {
    setPageBefore(newPage);
  };
  const onDeleteAfter = () => {
    if (selectedRowAfter) {
      ShowConfirm({
        title: 'Delete',
        message: 'Do you want to delete?',
        onOK: async () => {
          setLoading(true);
          const res = await restApi.post(RouterApi.detailMoldAfterDelete, { afterID: selectedRowAfter?.afterID });
          setLoading(false);
          if (res?.status === 200) {
            toast.success('Successfully deleted!');
            getAllDetailMoldAfter();
            setSelectedRowAfter(null);
          } else {
            toast.error(res?.data?.message || 'Delete fail!');
          }
        }
      });
    } else {
      toast.error('Please choose a row in table!');
    }
  };
  const onDeleteBefore = () => {
    if (selectedRowBefore) {
      ShowConfirm({
        title: 'Delete',
        message: 'Do you want to delete?',
        onOK: async () => {
          setLoading(true);
          const res = await restApi.post(RouterApi.detailMoldBeforeDelete, { beforeID: selectedRowBefore?.beforeID });
          setLoading(false);
          if (res?.status === 200) {
            toast.success('Successfully deleted!');
            getAllDetailMoldBefore();
            setSelectedRowBefore(null);
          } else {
            toast.error(res?.data?.message || 'Delete fail!');
          }
        }
      });
    } else {
      toast.error('Please choose a row in table!');
    }
  };
  const handleChangeRowsPerPageBefore = (event) => {
    setRowPerPageBefore(parseInt(event.target.value, 10));
    setPageBefore(0);
  };

  const onShowModalAdd = (value, type) => {
    setTypeTableAdd(value);
    setTypeModalAdd(type);
    setOpenModalAdd(true);
  };
  return (
    <>
      <Box
        sx={{
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
        }}
      >
        <Stack sx={{ position: 'absolute', top: 35, right: 20 }} direction={'row'} justifyContent={'flex-end'} mb={2} spacing={1}>
          <Button
            sx={{ maxHeight: 40 }}
            onClick={() => {
              onShowModalAdd(TABLE_ADD_BEFORE, 'ADD');
            }}
            size="small"
            startIcon={<IconPlus />}
            variant="contained"
          >
            New
          </Button>
          <Button
            disabled={!selectedRowBefore}
            sx={{ maxHeight: 40 }}
            onClick={() => {
              onShowModalAdd(TABLE_ADD_BEFORE, 'EDIT');
            }}
            size="small"
            startIcon={<IconEdit />}
            variant="outlined"
          >
            Edit
          </Button>
          <Button
            disabled={!selectedRowBefore}
            onClick={onDeleteBefore}
            sx={{ maxHeight: 40 }}
            size="small"
            startIcon={<IconTrash />}
            variant="outlined"
            color="error"
          >
            Delete
          </Button>
        </Stack>
        <TableContainer
          sx={{
            maxHeight: 350
          }}
          component={Paper}
        >
          <Table style={{ tableLayout: 'fixed' }} stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">타입</StyledTableCell>
                <StyledTableCell align="center">Project</StyledTableCell>
                <StyledTableCell align="center" width={120}>
                  모델명
                </StyledTableCell>
                <StyledTableCell align="center">품명</StyledTableCell>
                <StyledTableCell align="center">차수</StyledTableCell>
                <StyledTableCell align="center">자산 번호</StyledTableCell>
                <StyledTableCell align="center">CVT</StyledTableCell>
                <StyledTableCell align="center">양산처</StyledTableCell>
                <StyledTableCell align="center">현위치</StyledTableCell>
                <StyledTableCell align="center" width={100}>
                  입고일
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
              }}
            >
              {dataBefore?.length > 0 ? (
                dataBefore.map((item, index) => (
                  <StyledTableRow
                    selected={item?.beforeID === selectedRowBefore?.beforeID}
                    onClick={() => {
                      setSelectedRowBefore(item);
                    }}
                    key={index}
                  >
                    <StyledTableCell align="center">{item?.type}</StyledTableCell>
                    <StyledTableCell align="center">{item?.project}</StyledTableCell>
                    <StyledTableCell align="center">{item?.model}</StyledTableCell>
                    <StyledTableCell align="center">{item?.productName}</StyledTableCell>
                    <StyledTableCell align="center">{item?.level}</StyledTableCell>
                    <StyledTableCell align="center">{item?.asset}</StyledTableCell>
                    <StyledTableCell align="center">{item?.cvt}</StyledTableCell>
                    <StyledTableCell align="center">{item?.massProduct}</StyledTableCell>
                    <StyledTableCell align="center">{item?.currentLocation}</StyledTableCell>
                    <StyledTableCell align="center">{formatDateFromDB(item?.date, false)}</StyledTableCell>
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
            {/* {data?.length > 0 ? (
                data.map((company, index) => (
                  <StyledTableRow selected={isEditing === company?.companyID} key={index}>
                    <StyledTableCell align="center">{pageCompany * rowsPerPageCompany + index + 1}</StyledTableCell>
                    <StyledTableCell align="center">{company?.companyCode}</StyledTableCell>
                    <StyledTableCell align="left">{company?.companyName}</StyledTableCell>
                    <StyledTableCell align="center">
                      {typeModal === 'PICK' ? (
                        <Tooltip title="Click to choose item">
                          <IconButton
                            onClick={() => {
                              onChooseItem(company, 'MODEL');
                            }}
                            size="small"
                            color="primary"
                          >
                            <IconCheckbox />
                          </IconButton>
                        </Tooltip>
                      ) : isEditing === company?.companyID ? (
                        <Tooltip title="Cancel edit">
                          <IconButton
                            color="error"
                            onClick={() => {
                              onClickCancel(company);
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
                            onClickEdit(company);
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
                  <StyledTableCell colSpan={4} align="center">
                    <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                    <div>NO DATA</div>
                  </StyledTableCell>
                </TableRow>
              )} */}
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
            colSpan={10}
            count={totalPageBefore}
            rowsPerPage={rowPerPageBefore}
            page={pageBefore}
            slotProps={{
              select: {
                inputProps: {
                  'aria-label': 'rows per page'
                }
                // native: true
              }
            }}
            onPageChange={handleChangePageBefore}
            onRowsPerPageChange={handleChangeRowsPerPageBefore}
          />
        </Stack>
      </Box>

      <Stack direction={'row'} justifyContent={'flex-end'} mt={6} mb={2} spacing={1}>
        <Button
          sx={{ maxHeight: 40 }}
          onClick={() => {
            onShowModalAdd(TABLE_ADD_AFTER, 'ADD');
          }}
          size="small"
          startIcon={<IconPlus />}
          variant="contained"
        >
          New
        </Button>
        <Button
          disabled={!selectedRowAfter}
          sx={{ maxHeight: 40 }}
          onClick={() => {
            onShowModalAdd(TABLE_ADD_AFTER, 'EDIT');
          }}
          size="small"
          startIcon={<IconEdit />}
          variant="outlined"
        >
          Edit
        </Button>
        <Button
          onClick={onDeleteAfter}
          disabled={!selectedRowAfter}
          sx={{ maxHeight: 40 }}
          size="small"
          startIcon={<IconTrash />}
          variant="outlined"
          color="error"
        >
          Delete
        </Button>
      </Stack>

      <Box
        sx={{
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 350
          }}
          component={Paper}
        >
          <Table style={{ tableLayout: 'fixed' }} stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" width={50}>
                  No
                </StyledTableCell>
                <StyledTableCell align="center">수정처</StyledTableCell>
                <StyledTableCell align="center">일정</StyledTableCell>
                <StyledTableCell align="center">수리 내용</StyledTableCell>
                <StyledTableCell align="center">구분</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
              }}
            >
              {dataAfter?.length > 0 ? (
                dataAfter.map((item, index) => (
                  <StyledTableRow
                    selected={item?.afterID === selectedRowAfter?.afterID}
                    onClick={() => {
                      setSelectedRowAfter(item);
                    }}
                    key={index}
                  >
                    <StyledTableCell align="center">{item?.no}</StyledTableCell>
                    <StyledTableCell align="center">{item?.modification}</StyledTableCell>
                    <StyledTableCell align="center">{item?.schedule}</StyledTableCell>
                    <StyledTableCell align="center">{item?.detailEdit}</StyledTableCell>
                    <StyledTableCell align="center">{item?.division}</StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow sx={{ textAlign: 'center' }}>
                  <StyledTableCell colSpan={5} align="center">
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
            colSpan={10}
            count={totalPageAfter}
            rowsPerPage={rowPerPageAfter}
            page={pageAfter}
            slotProps={{
              select: {
                inputProps: {
                  'aria-label': 'rows per page'
                }
                // native: true
              }
            }}
            onPageChange={handleChangePageAfter}
            onRowsPerPageChange={handleChangeRowsPerPageAfter}
          />
        </Stack>
      </Box>
      <ModalAddNewData
        setLoading={setLoading}
        afterSave={afterSave}
        selectedRowBefore={selectedRowBefore}
        selectedRowAfter={selectedRowAfter}
        typeModal={typeModalAdd}
        typeTable={typeTableAdd}
        open={openModalAdd}
        onClose={onCloseModalAdd}
      />
    </>
  );
};
export default ListTab;
