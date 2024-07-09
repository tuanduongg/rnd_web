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
const HomePage = () => {
  const auth = useSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [personName, setPersonName] = useState([]);
  const [openModalConcept, setOpenModalConcept] = useState(false);

  const getUsers = async () => {
    const res = await restApi.get(RouterApi.userAll);
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
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9)
  ];
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
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
              <Button size="small" startIcon={<IconCheck />} variant="outlined">
                Check
              </Button>
              <Button size="small" startIcon={<IconEdit />} variant="outlined">
                Edit
              </Button>
            </Stack>
            {/* </Stack> */}
          </SubCard>
        </Grid>
        <Grid item xs={12}>
          <MainCard contentSX={{ padding: '10px' }}>
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
                <Chip
                  sx={{ marginRight: '5px', marginTop: '5px' }}
                  variant="outlined"
                  //   color="secondary"
                  label="Filter A"
                  onDelete={() => {}}
                />
                <Chip
                  sx={{ marginRight: '5px', marginTop: '5px' }}
                  variant="outlined"
                  //   color="secondary"
                  label="Filter B"
                  onDelete={() => {}}
                />
                <Chip
                  sx={{ marginRight: '5px', marginTop: '5px' }}
                  variant="outlined"
                  //   color="secondary"
                  label="Filter C"
                  onDelete={() => {}}
                />
              </Grid>
            </Grid>
            <Divider sx={{ margin: '10px 0px' }} />
            <TableContainer sx={{ marginTop: '15px' }} component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell>카테고리</StyledTableCell>
                    <StyledTableCell align="right">모델명</StyledTableCell>
                    <StyledTableCell align="right">P/L NAME</StyledTableCell>
                    <StyledTableCell align="right">코드</StyledTableCell>
                    <StyledTableCell align="right">품명</StyledTableCell>
                    <StyledTableCell align="right">등록일자</StyledTableCell>
                    <StyledTableCell align="right">등록자</StyledTableCell>
                    <StyledTableCell align="right">승인원</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <StyledTableRow key={row.name}>
                      <StyledTableCell align="center">{index + 1}</StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.calories}</StyledTableCell>
                      <StyledTableCell align="right">{row.fat}</StyledTableCell>
                      <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                      <StyledTableCell align="right">{row.protein}</StyledTableCell>
                      <StyledTableCell align="right">{row.fat}</StyledTableCell>
                      <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                      <StyledTableCell align="right">{row.protein}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                      colSpan={9}
                      count={rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      slotProps={{
                        select: {
                          inputProps: {
                            'aria-label': 'rows per page'
                          },
                          native: true
                        }
                      }}
                      onPageChange={() => {}}
                      onRowsPerPageChange={() => {}}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
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
        <Paper sx={{ width: { xs: 340, sm: 400 }, padding: '10px' }}>
          {/* <Grid container spacing={2}>
            <Grid item xs={12}> */}
          <Stack direction="row" alignItems={'center'} justifyContent="space-between">
            <Typography variant="h5" component="h5">
              Filter
            </Typography>
            <IconButton
              onClick={() => {
                setAnchorEl(null);
              }}
              size="small"
              aria-label="close"
            >
              <IconX />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ margin: '10px 0px 0px 0px', height: '350px', overflowY: 'auto' }}>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <InputLabel id="demo-multiple-checkbox-label">카테고리</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
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
                renderValue={(selected) => selected.join(', ')}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={personName.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <TextField id="standard-basic" label="모델명" size="small" variant="outlined" />
            </FormControl>
            <FormControl style={{ margin: '10px 0px' }} fullWidth size="small">
              <TextField id="standard-basic" label="P/L NAME" size="small" variant="outlined" />
            </FormControl>
            <FormControl style={{ margin: '10px 0px' }} fullWidth size="small">
              <TextField id="standard-basic" label="코드" size="small" variant="outlined" />
            </FormControl>
            <FormControl style={{ margin: '10px  0px' }} fullWidth size="small">
              <TextField id="standard-basic" label="품명" size="small" variant="outlined" />
            </FormControl>
            <FormControl style={{ margin: '10px 0px' }} fullWidth size="small">
              <Stack spacing={2} direction="row" alignItems={'center'} justifyContent="space-between">
                <DatePicker slotProps={{ textField: { size: 'small' } }} label="Start Date" size="small" />
                <DatePicker slotProps={{ textField: { size: 'small' } }} label="End Date" size="small" />
              </Stack>
            </FormControl>
            <FormControl style={{ margin: '10px 0px' }} fullWidth size="small">
              <TextField id="standard-basic" label="등록자" size="small" variant="outlined" />
            </FormControl>
          </Box>
          <Divider />
          <Stack direction="row" alignItems={'center'} sx={{ marginTop: '10px' }} justifyContent="space-between">
            <Button size="small">Reset all</Button>
            <Button startIcon={<IconCircleCheck />} variant="contained" size="small">
              Apply
            </Button>
          </Stack>
          {/* </Grid>
          </Grid> */}
        </Paper>
      </Menu>
      <ModalConcept
        open={openModalConcept}
        onClose={() => {
          setOpenModalConcept(false);
        }}
      />
    </>
  );
};

export default HomePage;
