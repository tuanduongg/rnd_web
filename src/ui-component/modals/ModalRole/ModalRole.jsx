import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  DialogActions,
  IconButton,
  Stack,
  styled,
  Button,
  TableCell,
  tableCellClasses,
  Paper,
  Switch,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Checkbox
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import toast from 'react-hot-toast';
import config from 'config';
import { CheckBox } from '@mui/icons-material';
import { ShowConfirm } from 'ui-component/ShowDialog';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
    borderBottom: 'none'
  },
  '.MuiPaper-root': {
    // maxWidth: 970,
    minWidth: '660px'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },

  '& .MuiDialogTitle-root': {
    padding: '10px 15px'
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
const label = { inputProps: { 'aria-label': 'Switch' } };
export default function ModalRole({ open, onClose, roles, afterSave }) {
  const [arrRole, setArrRole] = useState([]);
  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    
    onClose();
  };
  useEffect(() => {
    if (open) setArrRole(roles);
  }, [roles, open]);
  const onSave = () => {
    let urlAPI = RouterApi.roleUpdate;
    ShowConfirm({
      title: 'Update',
      message: 'Do you want to save changes?',
      onOK: async () => {
        const res = await restApi.post(urlAPI, {
          data: JSON.stringify(arrRole)
        });
        if (res?.status === 200) {
          toast.success('Saved changes successful!');
          afterSave();
        } else {
          toast.error(res?.data?.message || 'Server Error!');
        }
      }
    });
  };
  const onChangeChecked = (e, index, type) => {
    const checked = e?.target?.checked;
    const newData = arrRole.map((item, _i) => {
      if (index === _i) {
        item[type] = checked;
        return item;
      }
      return item;
    });
    setArrRole(newData);
  };
  return (
    <>
      <BootstrapDialog maxWidth={'md'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          <Stack direction={'row'} alignItems={'center'}>
            {'Role '}
          </Stack>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 6,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box>
            <TableContainer sx={{ marginTop: '15px', height: `calc(100vh - 240px)`, width: '100%' }} component={Paper}>
              <Table stickyHeader sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell align="left">Role</StyledTableCell>
                    <StyledTableCell align="left">Create</StyledTableCell>
                    <StyledTableCell align="center">Update</StyledTableCell>
                    <StyledTableCell align="center">Delete</StyledTableCell>
                    <StyledTableCell align="right">Import</StyledTableCell>
                    <StyledTableCell align="right">Export</StyledTableCell>
                    <StyledTableCell align="right">Accept</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                    '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
                  }}
                >
                  {arrRole?.length > 0
                    ? arrRole.map((item, index) => (
                        <StyledTableRow key={index} sx={{ cursor: 'pointer' }}>
                          <StyledTableCell align="center">{index + 1}</StyledTableCell>
                          <StyledTableCell align="left">{item?.roleName}</StyledTableCell>
                          <StyledTableCell align="left">
                            <Checkbox
                              size="small"
                              onChange={(e) => {
                                onChangeChecked(e, index, 'create');
                              }}
                              {...label}
                              checked={item?.create}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Checkbox
                              size="small"
                              onChange={(e) => {
                                onChangeChecked(e, index, 'update');
                              }}
                              {...label}
                              checked={item?.update}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Checkbox
                              size="small"
                              onChange={(e) => {
                                onChangeChecked(e, index, 'delete');
                              }}
                              {...label}
                              checked={item?.delete}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Checkbox
                              size="small"
                              onChange={(e) => {
                                onChangeChecked(e, index, 'import');
                              }}
                              {...label}
                              checked={item?.import}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Checkbox
                              size="small"
                              onChange={(e) => {
                                onChangeChecked(e, index, 'export');
                              }}
                              {...label}
                              checked={item?.export}
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Checkbox
                              size="small"
                              onChange={(e) => {
                                onChangeChecked(e, index, 'accept');
                              }}
                              {...label}
                              checked={item?.accept}
                            />
                          </StyledTableCell>
                        </StyledTableRow>
                      ))
                    : null}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack width={'100%'} direction={'row'} justifyContent={'flex-end'} spacing={2}>
            <Button variant="custom" onClick={handleClose}>
              Close
            </Button>
            <Button variant="contained" onClick={onSave}>
              Save Changes
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
