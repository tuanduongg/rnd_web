import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import {
  Alert,
  Chip,
  FormControl,
  Grid,
  IconButton,
  Paper,
  Portal,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { isMobile } from 'react-device-detect';
import { useEffect } from 'react';
import config from 'config';
import { formatDateFromDB } from 'utils/helper';
import { IconEye, IconFileSpreadsheet, IconUser } from '@tabler/icons-react';
import IMAGE_EMPTYDATA from '../../../assets/images/backgrounds/empty-box.png';
import toast from 'react-hot-toast';
import { minWidth } from '@mui/system';

const renderHistoryText = (str) => {
  if (!str) return '';
  // Xoá ' - ' nếu nó đứng đầu
  if (str.startsWith(' - ')) {
    str = str.substring(3);
  } else if (str.startsWith('  - ')) {
    str = str.substring(4);
  }
  // Thay thế tất cả các ' - ' khác thành <br>
  let replacedStr = str.replace(/ - /g, '<br>');
  return replacedStr;
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    borderBottom: 'none',
    padding: theme.spacing(2),
    minWidth:'600px'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },
  '& .MuiDialogTitle-root': {
    padding: '10px 15px'
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

const getChip = (text, color) => {
  return text ? <Chip sx={{ marginLeft: '10px' }} size="small" label={text} variant="outlined" color={color} /> : null;
};
const initvalidate = { error: false, msg: '' };
export default function ModalHistory({ open, onClose, selected, typeModal }) {
  const [histories, setHistories] = useState([]);
  const theme = useTheme();

  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    onClose();
  };
  const getHistory = async () => {
    let url = '';
    let body = {};
    switch (typeModal) {
      case 'CONCEPT':
        url = RouterApi.conceptHistory;
        body['conceptId'] = selected?.conceptId;
        break;
      case 'MOLD':
        url = RouterApi.outputJigHistory;
        body['outputJigID'] = selected?.outputJigID;
        break;

      default:
        break;
    }
    const res = await restApi.post(url, body);
    if (res?.status === 200) {
      setHistories(res?.data);
    }
  };

  useEffect(() => {
    if (open) {
      getHistory();
    }
  }, [open]);

  const onClickExportExcelReport = async () => {
    // setLoading(true);
    const response = await restApi.post(
      RouterApi.outputJigExportHistory,
      {
        outputJigID: selected?.outputJigID
      },
      {
        responseType: 'arraybuffer'
      }
    );
    // setLoading(false);
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
      saveAs(blob, `History_${selected?.model?.model}_${selected?.model?.type}_${selected?.moldNo}.xlsx`);
    } else {
      toast.error('Download file fail!');
    }
  };
console.log('selected',selected);

  return (
    <>
      <BootstrapDialog maxWidth={'lg'} fullScreen={isMobile} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          History
          {getChip(selected?.model?.model, 'primary')}
          {getChip(selected?.model?.type, 'primary')}
          {getChip(selected?.model?.description, 'primary')}
          {getChip(selected?.moldNo ? `#${selected?.moldNo}` : '', 'info')}


          {getChip(selected?.category?.categoryName, 'primary')}
          {getChip(selected?.modelName, 'primary')}
          {getChip(selected?.code, 'success')}
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
              <TableContainer sx={{ marginTop: '15px', maxHeight: { xs: '100vh', sm: '60vh' } }} component={Paper}>
                <Table stickyHeader aria-label="customized table">
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
                    {histories?.length > 0 ? (
                      histories?.map((row, index) => (
                        <StyledTableRow key={row.conceptId}>
                          <StyledTableCell align="center">{index + 1}</StyledTableCell>
                          <StyledTableCell>{row?.historyType}</StyledTableCell>
                          <StyledTableCell scope="row">{row?.historyUsername}</StyledTableCell>
                          <StyledTableCell align="center" scope="row">
                            {row?.historyTime ? formatDateFromDB(row?.historyTime) : null}
                          </StyledTableCell>
                          <StyledTableCell>
                            <span dangerouslySetInnerHTML={{ __html: renderHistoryText(row?.historyRemark) }}></span>
                          </StyledTableCell>
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack direction={'row'} justifyContent={ typeModal === 'MOLD' ? 'space-between' : 'flex-end'} width={'100%'}>
            {typeModal === 'MOLD' && (<Button onClick={onClickExportExcelReport} startIcon={<IconFileSpreadsheet />} size="small" variant="outlined">
              Excel
            </Button>)}
            <Button variant="custom" onClick={handleClose}>
              Close
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
