// material-ui
import {
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
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import config from 'config';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { styled } from '@mui/material/styles';
import { IconPlus, IconEdit, IconCheck, IconFilter, IconSearch, IconCircleCheck } from '@tabler/icons-react';
import SubCard from 'ui-component/cards/SubCard';
import ModalAccount from 'ui-component/modals/ModalAccount/ModalAccount';
import IMAGE_EMPTYDATA from '../../assets/images/backgrounds/empty-box.png';

// ==============================|| SAMPLE PAGE ||============================== //
const names = ['ACC', 'RUBBER', 'CONVERTING', 'INJECTION', 'METAL KEY 5개중 택'];
const AccountPage = () => {
  const auth = useSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [typeModal, setTypeModal] = useState('ADD');
  const theme = useTheme();
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: '',
    type: true
  });
  const getUsers = async () => {
    const res = await restApi.get(RouterApi.userAll + '?screen=account');
    if (res?.status === 200) {
      setUsers(res?.data);
    }
  };
  useEffect(() => {
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
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <SubCard contentSX={{ padding: '13px !important' }}>
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
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
                onClick={() => {
                  setTypeModal('EDIT');

                  setOpenModal(true);
                }}
                disabled={!selectedRow || auth?.dataUser?.userId === selectedRow?.userId}
                size="small"
                startIcon={<IconEdit />}
                variant="outlined"
              >
                Edit
              </Button>
            </Stack>
            {/* </Stack> */}
          </SubCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard contentSX={{ padding: '10px' }}>
            <TableContainer sx={{ marginTop: '15px' }} component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell align="left">Full Name</StyledTableCell>
                    <StyledTableCell align="left">User Name</StyledTableCell>
                    <StyledTableCell align="center">Role</StyledTableCell>
                    <StyledTableCell align="right">Admin</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                    '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
                  }}
                >
                  {users?.length > 0 ? (
                    users?.map((row, index) => (
                      <StyledTableRow selected={selectedRow?.userId === row?.userId} onClick={() => setSelectedRow(row)} key={index}>
                        <StyledTableCell align="center">{index + 1}</StyledTableCell>
                        <StyledTableCell align="left" component="th" scope="row">
                          {row?.fullName}
                        </StyledTableCell>
                        <StyledTableCell align="left">{row?.userName}</StyledTableCell>
                        <StyledTableCell align="center">{row?.role?.roleName}</StyledTableCell>
                        <StyledTableCell align="right">{row?.isRoot && <IconCheck />}</StyledTableCell>
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
          </MainCard>
        </Grid>
      </Grid>
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
      <ModalAccount
        typeModal={typeModal}
        selected={selectedRow}
        setSnackBar={setSnackBar}
        afterSave={() => {
          getUsers();
        }}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
    </>
  );
};

export default AccountPage;
