import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { Alert, FormControl, Grid, IconButton, Paper, Portal, Snackbar, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { isMobile } from 'react-device-detect';
import { useEffect } from 'react';
import config from 'config';
import { formatDateFromDB } from 'utils/helper';
import { IconEye, IconUser } from '@tabler/icons-react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));
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
const initvalidate = { error: false, msg: '' };
export default function ModalHistory({ open, onClose, selected }) {
  const [histories, setHistories] = useState([]);


  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    onClose();
  };
  const getHistory = async () => {
    const res = await restApi.post(RouterApi.conceptHistory, { conceptId: selected?.conceptId });
    console.log('res', res);
    if (res?.status === 200) {
      setHistories(res?.data)
    }
  }
  useEffect(() => {
    if (selected?.conceptId && open) {
      getHistory();
    }
  }, [open]);
  return (
    <>

      <BootstrapDialog fullScreen={isMobile} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          History
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={24}>
              <TableContainer sx={{ marginTop: '15px' }} component={Paper}>
                <Table  aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">#</StyledTableCell>
                      <StyledTableCell align="center">Type</StyledTableCell>
                      <StyledTableCell align="center">User</StyledTableCell>
                      <StyledTableCell align="center">Time</StyledTableCell>
                      <StyledTableCell>Content</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody
                    sx={{
                      '.MuiTableRow-root.Mui-selected': { backgroundColor: config.colorSelected },
                      '.MuiTableRow-root.Mui-selected:hover': { backgroundColor: config.colorSelected }
                    }}
                  >
                    {histories?.map((row, index) => (
                      <StyledTableRow
                        key={row.conceptId}
                      >
                        <StyledTableCell align="center">{index + 1}</StyledTableCell>
                        <StyledTableCell align="center">{row?.historyType}</StyledTableCell>
                        <StyledTableCell align="center" component="th" scope="row">
                          {row?.historyUsername}
                        </StyledTableCell>
                        <StyledTableCell align="center" component="th" scope="row">
                          {row?.historyTime?  formatDateFromDB(row?.historyTime) : null}
                        </StyledTableCell>
                        <StyledTableCell>{row?.historyRemark}</StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                  {/* <TableFooter>
                    <TableRow>
                      <TablePagination
                        color="primary"
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                        colSpan={10}
                        count={total}
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
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter> */}
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
