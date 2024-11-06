import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  DialogActions,
  IconButton,
  Stack,
  styled,
  Button,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Tooltip,
  Tab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from 'react-device-detect';
import { cssScrollbar, formatDateFromDB, getDepartmentEditMold } from 'utils/helper';
import { IconCaretDown, IconEdit, IconFileSpreadsheet, IconId, IconPlus } from '@tabler/icons-react';
import { IconHistory } from '@tabler/icons-react';
import ModalHistory from '../ModalHistory/ModalHistory';
import { useEffect, useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { IconList } from '@tabler/icons-react';
import DetailTab from './component/DetailTab';
import ListTab from './component/ListTab';
import { IconTrash } from '@tabler/icons-react';

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

const getChipStatus = (status, sx = {}) => {
  let text = '';
  let color = '';

  switch (status) {
    case 'RISK':
      text = 'Risk양산';
      color = 'secondary';
      break;
    case 'DEV_EDIT':
      text = '개발수정';
      color = 'warning';
      break;
    case 'EDIT':
      text = '양산수정';
      color = 'orange';
      break;
    case 'DEV':
      text = '개발중';
      color = 'primary';
      break;
    case 'USE':
      text = '양산중';
      color = 'success';
      break;
    case 'STOP':
      text = '사용중지';
      color = 'error';
      break;

    default:
      return '';
  }
  return <Chip sx={sx} variant={color === 'success' ? 'filled' : 'outlined'} label={text} size="small" color={color} />;
  // return <Typography sx={sx} color={color} >{text}</Typography>;
};
const getChip = (text, color) => {
  return text ? <Chip sx={{ marginLeft: '10px' }} size="small" label={text} variant="outlined" color={color} /> : null;
};
export const DETAIL_TAB = 'DETAIL_TAB';
export const LIST_TAB = 'LIST_TAB';

export default function ModalDetailMold({ open, onClose, selected, setLoading }) {
  const [openModalHis, setOpenModalHis] = useState(false);
  const [valueTab, setValueTab] = useState(DETAIL_TAB);
  const [dataHistoryTryNo, setDataHistoryTryNo] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    setDataHistoryTryNo([]);
    setValueTab(DETAIL_TAB);
    onClose();
  };

  const handleChangeTab = (e, tab) => {
    setValueTab(tab);
  };

  useEffect(() => {
    if (open && selected) {
      getAllHistoryTryNo();
    }
  }, [open]);

  const getAllHistoryTryNo = async () => {
    setLoading(true);
    const res = await restApi.post(RouterApi?.outputJigHistoryTryNo, { outputJigID: selected?.outputJigID });
    setLoading(false);
    if (res?.status === 200) {
      setDataHistoryTryNo(res?.data);
    }
  };
  const onChangeExpandedHistoryTryNo = (e, expanded) => {
    if (expanded && dataHistoryTryNo?.length < 1) {
      getAllHistoryTryNo();
    }
  };
  const onClickExportExcelReport = async () => {
    let url = '';
    let body = {};
    switch (valueTab) {
      case DETAIL_TAB:
        url = RouterApi.outputJigExportID;
        body = {
          outputJigID: selected?.outputJigID
        };
        break;
        case LIST_TAB:
        url = RouterApi.outputJigExportExcelDetailList;
        break;

      default:
        break;
    }
    setLoading(true);
    const response = await restApi.post(url, body, {
      responseType: 'arraybuffer'
    });
    setLoading(false);
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
      saveAs(blob, `Export_${hour}_${minus}_${year}${month}${day}.xlsx`);
    } else {
      toast.error('Download file fail!');
    }
  };

  return (
    <>
      <BootstrapDialog fullScreen={isMobile} maxWidth={'md'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          <Stack direction={'row'} alignItems={'center'}>
            {'Detail '}
            {getChip(selected?.model?.model, 'primary')}
            {getChip(selected?.model?.type, 'primary')}
            {getChip(selected?.moldNo ? `#${selected?.moldNo}` : '', 'info')}
            {getChip(selected?.historyTryNo[0]?.tryNum ? `T${selected?.historyTryNo[0]?.tryNum}` : '', 'secondary')}
            {getChipStatus(selected?.productionStatus, { marginLeft: '10px' })}
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
        <DialogContent sx={{ ...cssScrollbar, overflowX: 'hidden', position: 'relative' }}>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={valueTab}>
              <Stack direction={'row'} justifyContent={'space-between'} alignItems={'flex-end'} mb={2} pr={3}>
                <Box>
                  <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                    <Tab icon={<IconId />} iconPosition="start" label="Detail" value={DETAIL_TAB} />
                    <Tab icon={<IconList />} label="List" iconPosition="start" value={LIST_TAB} />
                  </TabList>
                </Box>
              </Stack>
              <TabPanel sx={{ padding: 0 }} value={DETAIL_TAB}>
                <DetailTab dataHistoryTryNo={dataHistoryTryNo} />
              </TabPanel>
              <TabPanel sx={{ padding: 0 }} value={LIST_TAB}>
                <ListTab setLoading={setLoading} valueTab={valueTab} dataHistoryTryNo={dataHistoryTryNo} />
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>
        <DialogActions>
          <Stack width={'100%'} direction={'row'} justifyContent={'space-between'}>
            <Stack direction={'row'} spacing={2}>
              <Button onClick={onClickExportExcelReport} startIcon={<IconFileSpreadsheet />} size="small" variant="outlined">
                Excel
              </Button>
              <Button
                variant="outlined"
                startIcon={<IconHistory />}
                onClick={() => {
                  setOpenModalHis(true);
                }}
              >
                History
              </Button>
            </Stack>
            <Button variant="custom" onClick={handleClose}>
              Close
            </Button>
          </Stack>
        </DialogActions>
      </BootstrapDialog>

      <ModalHistory
        typeModal={'MOLD'}
        selected={selected}
        open={openModalHis}
        onClose={() => {
          setOpenModalHis(false);
        }}
      />
    </>
  );
}
