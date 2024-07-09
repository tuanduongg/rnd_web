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
  TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { styled } from '@mui/material/styles';
import { IconPlus, IconEdit, IconCheck, IconFilter, IconSearch, IconCircleCheck } from '@tabler/icons-react';
import SubCard from 'ui-component/cards/SubCard';
import { IconX } from '@tabler/icons-react';
import { maxHeight } from '@mui/system';
import { DatePicker } from '@mui/x-date-pickers';
import ModalConcept from 'ui-component/modals/ModalConcept/ModalConcept';
// ==============================|| SAMPLE PAGE ||============================== //
const names = ['ACC', 'RUBBER', 'CONVERTING', 'INJECTION', 'METAL KEY 5개중 택'];
const AccountPage = () => {
  const auth = useSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModalConcept, setOpenModalConcept] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const theme = useTheme();

  const getUsers = async () => {
    const res = await restApi.get(RouterApi.userAll);
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
                  setOpenModalConcept(true);
                }}
                size="small"
                startIcon={<IconPlus />}
                variant="contained"
              >
                New
              </Button>
              <Button disabled={!selectedRow} size="small" startIcon={<IconEdit />} variant="outlined">
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
                    <StyledTableCell align="left">Role</StyledTableCell>
                    <StyledTableCell align="left">Root</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '.MuiTableRow-root.Mui-selected': { backgroundColor: theme?.palette.action.selected },
                    '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: theme?.palette.action.selected }
                  }}
                >
                  {users?.map((row, index) => (
                    <StyledTableRow selected={selectedRow?.userId === row?.userId} onClick={() => setSelectedRow(row)} key={index}>
                      <StyledTableCell align="center">{index + 1}</StyledTableCell>
                      <StyledTableCell align="left" component="th" scope="row">
                        {row?.fullName}
                      </StyledTableCell>
                      <StyledTableCell align="left">{row?.userName}</StyledTableCell>
                      <StyledTableCell align="left">{row?.role?.roleName}</StyledTableCell>
                      <StyledTableCell align="left">{row?.isRoot}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        </Grid>
      </Grid>
      <ModalConcept
        open={openModalConcept}
        onClose={() => {
          setOpenModalConcept(false);
        }}
      />
    </>
  );
};

export default AccountPage;
