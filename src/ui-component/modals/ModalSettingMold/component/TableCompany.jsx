import { useState } from 'react';
import {
  Table,
  TableBody,
  styled,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  tableCellClasses,
  IconButton,
  Box,
  Grid,
  Button,
  TextField,
  Stack,
  FormControl,
  OutlinedInput,
  InputAdornment,
  TablePagination,
  Tooltip
} from '@mui/material';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';
import { cssScrollbar } from 'utils/helper';
import config from 'config';
import { IconCheckbox, IconCircleX, IconDeviceFloppy, IconEdit, IconPlus, IconSearch } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import SubCard from 'ui-component/cards/SubCard';
import { RouterApi } from 'utils/router-api';
import restApi from 'utils/restAPI';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { ShowConfirm } from 'ui-component/ShowDialog';

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

const TableCompany = ({
  role,
  typeModal,
  companies,
  afterSave,
  rowsPerPageCompany,
  setRowsPerPageCompany,
  pageCompany,
  setPageCompany,
  totalCompany,
  setTotalCompany,
  searchCompany,
  setSearchCompany,
  onChooseItem,
  onClickSearch
}) => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState('');
  const {
    watch,
    handleSubmit,
    clearErrors,
    control,
    setValue,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      codeCompany: '',
      nameCompany: ''
    }
  });

  useEffect(() => {
    setData(companies);
  }, [companies]);

  const onClickCancel = (company) => {
    setIsEditing('');
    reset();
  };
  const onClickEdit = (company) => {
    const { companyID, companyCode, companyName } = company;
    setIsEditing(companyID);
    setValue('codeCompany', companyCode);
    setValue('nameCompany', companyName);
  };
  const onSaveData = async (data) => {
    if (!isEditing && !role?.create) {
      toast.error(`You don't have permission!`);
      return;
    }
    ShowConfirm({
      title: isEditing ? 'Update' : 'Create new',
      message: 'Do you want to save changes?',
      onOK: async () => {
        const url = isEditing ? RouterApi.updateCompany : RouterApi.addCompany;
        const res = await restApi.post(url, { ...data, companyID: isEditing });
        if (res?.status === 200) {
          if (!isEditing) {
            reset();
          }
          afterSave('COMPANY');
          toast.success('Saved changes successful!');
        } else {
          toast.error(res?.data?.message || 'Server Error!');
        }
      }
    });
  };

  const handleChangePage = (event, newPage) => {
    setPageCompany(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPageCompany(parseInt(event.target.value, 10));
    setPageCompany(0);
  };
  return (
    <>
      {/* <SubCard sx={{ marginTop: '10px' }} > */}
      {typeModal !== 'PICK' && (
        <Box mt={2}>
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit((data) => onSaveData(data))}>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Controller
                  name="codeCompany"
                  control={control}
                  rules={{ required: ' ' }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...field}
                      label="Code"
                      variant="outlined"
                      placeholder="Code..."
                      error={!!errors.codeCompany}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <Controller
                  name="nameCompany"
                  control={control}
                  rules={{ required: ' ' }}
                  render={({ field }) => (
                    <TextField
                      fullWidth
                      size="small"
                      {...field}
                      label="Description"
                      placeholder="Description..."
                      variant="outlined"
                      error={!!errors.nameCompany}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3} sx={{ marginTop: '2px' }} textAlign={'right'}>
                <Button startIcon={isEditing ? <IconDeviceFloppy /> : <IconPlus />} type="submit" variant="contained">
                  {isEditing ? 'Save Changes' : 'Add New'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
      {/* </SubCard> */}
      <SubCard sx={{ marginTop: '15px', padding: '10px' }}>
        <Stack direction={'row'} justifyContent={'flex-end'}>
          <FormControl size="small" variant="outlined">
            <OutlinedInput
              defaultValue={searchCompany}
              onBlur={(e) => {
                setSearchCompany(e.target.value);
              }}
              placeholder="Search..."
              type={'text'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    color="primary"
                    aria-label="search"
                    onClick={() => {
                      onClickSearch('COMPANY');
                    }}
                    edge="end"
                  >
                    <IconSearch />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>
        <TableContainer
          sx={{
            ...cssScrollbar,
            marginTop: '10px',
            maxHeight: 350
          }}
          component={Paper}
        >
          <Table style={{ tableLayout: 'fixed' }} stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" width={50}>
                  #
                </StyledTableCell>
                <StyledTableCell align="center" width={130}>
                  Code
                </StyledTableCell>
                <StyledTableCell align="center">Description</StyledTableCell>
                <StyledTableCell align="center" width={50}></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
              }}
            >
              {data?.length > 0 ? (
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
            // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            colSpan={4}
            count={totalCompany}
            rowsPerPage={rowsPerPageCompany}
            page={pageCompany}
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
      </SubCard>
    </>
  );
};
export default TableCompany;
