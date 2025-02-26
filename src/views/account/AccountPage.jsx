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
  Alert,
  TextField
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
import { padding } from '@mui/system';
import { cssScrollbar } from 'utils/helper';
import { IconLockCog } from '@tabler/icons-react';
import ModalRole from 'ui-component/modals/ModalRole/ModalRole';
import UnauthorizedPage from 'ui-component/UnauthorizedPage';

// ==============================|| SAMPLE PAGE ||============================== //

const AccountPage = () => {
  const auth = useSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [isRoot, setIsRoot] = useState(false);
  const [users, setUsers] = useState([]);
  const [listUser, setListUser] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [typeModal, setTypeModal] = useState('ADD');
  const [search, setSearch] = useState('');
  const [openModalRole, setOpenModalRole] = useState(false);
  const theme = useTheme();
  const [roles, setRoles] = useState([]);

  const getUsers = async () => {
    const res = await restApi.post(RouterApi.userAll, { search: '' });
    if (res?.status === 200) {
      setIsRoot(true)
      setListUser(res?.data);
    }
  };
  useEffect(() => {
    onSearch(search);
  }, [listUser]);

  const getAllRole = async () => {
    const response = await restApi.get(RouterApi.roleAll);
    if (response?.status === 200) {
      setIsRoot(true);
      setRoles(response?.data);
    }
  };
  const afterSaveRole = () => {
    getAllRole();
  };
  useEffect(() => {
    getAllRole();
    getUsers();
  }, []);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
      padding: '7px'
    }
  }));

  const onSearch = (value) => {
    const userNew = listUser.filter((item) => {
      const newSearch = value.trim().toLocaleLowerCase();
      return (
        `${item?.userName}`.toLocaleLowerCase().indexOf(newSearch) > -1 ||
        `${item?.department}`.toLocaleLowerCase().indexOf(newSearch) > -1 ||
        `${item?.fullName}`.indexOf(newSearch) > -1
      );
    });
    setSelectedRow(null);
    setUsers(userNew);
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0
    }
  }));
  if(!isRoot) {
    return <UnauthorizedPage/>
  }
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <SubCard contentSX={{ padding: '13px !important' }}>
            <Stack direction="row" justifyContent="space-between" spacing={1}>
              <Button
                sx={{ marginRight: '10px' }}
                onClick={() => {
                  // setTypeModal('ADD');
                  setOpenModalRole(true);
                }}
                size="small"
                startIcon={<IconLockCog />}
                variant="custom"
              >
                Role
              </Button>
              <Stack spacing={2} direction={'row'}>
                <FormControl size="small" sx={{ maxWidth: '220px' }} variant="outlined">
                  {/* <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel> */}
                  <OutlinedInput
                    onChange={(e) => {
                      onSearch(e.target.value);
                      setSearch(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSearch();
                      }
                    }}
                    value={search}
                    placeholder="Search..."
                    id="outlined-adornment-password"
                    type={'text'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton color="primary" aria-label="search" onClick={onSearch} onMouseDown={onSearch} edge="end">
                          <IconSearch />
                        </IconButton>
                      </InputAdornment>
                    }
                    // label="Search"
                  />
                </FormControl>
                <Button
                  sx={{ marginRight: '10px' }}
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
                  disabled={!selectedRow || selectedRow?.isRoot || auth?.dataUser?.userId === selectedRow?.userId}
                  size="small"
                  startIcon={<IconEdit />}
                  variant="outlined"
                >
                  Edit
                </Button>
              </Stack>
            </Stack>
          </SubCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard contentSX={{ padding: '10px' }}>
            <TableContainer sx={{ marginTop: '15px', ...cssScrollbar, height: `calc(100vh - 240px)`, width: '100%' }} component={Paper}>
              <Table stickyHeader sx={{ minWidth: 700, ...cssScrollbar }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell align="left">Full Name</StyledTableCell>
                    <StyledTableCell align="left">User Name</StyledTableCell>
                    <StyledTableCell align="center">Deparment</StyledTableCell>
                    <StyledTableCell align="center">Role</StyledTableCell>
                    <StyledTableCell align="right">Korean(ACC)</StyledTableCell>
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
                      <StyledTableRow
                        sx={{ cursor: 'pointer' }}
                        selected={selectedRow?.userId === row?.userId}
                        onClick={() => setSelectedRow(row)}
                        key={index}
                      >
                        <StyledTableCell align="center">{index + 1}</StyledTableCell>
                        <StyledTableCell align="left" component="th" scope="row">
                          {row?.fullName}
                        </StyledTableCell>
                        <StyledTableCell align="left">{row?.userName}</StyledTableCell>
                        <StyledTableCell align="center">{row?.department}</StyledTableCell>
                        <StyledTableCell align="center">{row?.role?.roleName}</StyledTableCell>
                        <StyledTableCell align="right">{row?.isKorean && <IconCheck />}</StyledTableCell>
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
      <ModalRole
        roles={roles}
        open={openModalRole}
        onClose={() => {
          setOpenModalRole(false);
        }}
        afterSave={afterSaveRole}
      />
      <ModalAccount
        roles={roles}
        typeModal={typeModal}
        selected={selectedRow}
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
