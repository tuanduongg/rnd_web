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
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from 'react-device-detect';
import { cssScrollbar, formatDateFromDB } from 'utils/helper';
import { IconCaretDown } from '@tabler/icons-react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
    borderBottom: 'none'
  },
  '.MuiPaper-root': {
    maxWidth: '700px',
    minWidth: '500px'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },

  '& .MuiDialogTitle-root': {
    padding: '10px 15px'
  }
}));
const getChipStatus = (status,sx={}) => {
  let text = '';
  let color = '';
  switch (status) {
    case 'DEV':
      text = '개발중';
      color = 'info';
      break;
    case 'USE':
      text = '양산';
      color = 'success';
      break;
    case 'STOP':
      text = '사용중지';
      color = 'error';
      break;

    default:
      return '';
  }
  return (<Chip sx={sx} variant={color === 'success' ? 'filled' : "outlined"} label={text} size="small" color={color} />);

}
const getChip = (text, color) => {
  return (
    text ? <Chip sx={{ marginLeft: '10px' }} size='small' label={text} variant='outlined' color={color} /> : null
  )
}
export default function ModalDetailMold({ open, onClose, selected }) {

  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    onClose();
  };

  return (
    <>
      <BootstrapDialog fullScreen={isMobile} maxWidth={'md'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          <Stack direction={'row'} alignItems={'center'}>
            {'Detail '}
            {getChip(selected?.model?.model, 'primary')}
            {getChip(selected?.model?.type, 'primary')}
            {getChip(selected?.moldNo, 'info')}
            {getChip(selected?.tryNo, 'secondary')}
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
        <DialogContent sx={{ ...cssScrollbar }}>

          
          <Accordion defaultExpanded sx={{ backgroundColor: '#fafafa' }}>
            <AccordionSummary
              expandIcon={<IconCaretDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography color={'primary'} variant="h5">
                &bull; 일반 정보(Thông tin chung)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    Catgory
                  </Typography>
                  <Typography variant="h5">{selected?.model?.category?.categoryName}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    Model
                  </Typography>
                  <Typography variant="h5">{selected?.model?.model}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography minWidth={50} fontSize={'0.875rem'} variant="subtitle2">
                    Project Name
                  </Typography>
                  <Typography variant="h5">{selected?.model?.projectName}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    구분
                  </Typography>
                  <Typography variant="h5">{selected?.model?.type}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    Description
                  </Typography>
                  <Typography variant="h5">{selected?.model?.description}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'}  variant="subtitle2">
                    Mold No.
                  </Typography>
                  <Typography color={'primary'} fontWeight={'bold'} variant="h5">{selected?.moldNo}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    양산적용(Trạng thái)
                  </Typography>
                  <Typography variant="h5">{getChipStatus(selected?.productionStatus,{ marginBottom: '5px'})}</Typography>
                </Stack>
                <Divider />
              </Stack>


            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded sx={{ backgroundColor: '#fafafa' }}>
            <AccordionSummary
              expandIcon={<IconCaretDown />}
              aria-controls="panel2content"
              id="panel2-header"
            >
              <Typography color={'primary'} variant="h5">
                &bull; 금형 출고(Giao khuôn)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    제작업체(NSX)
                  </Typography>
                  <Typography variant="h5">
                    <Tooltip placement='right' title={selected?.manufacturer?.companyName}>
                      {selected?.manufacturer?.companyCode}
                    </Tooltip>
                  </Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    발송지역(Nơi VC)
                  </Typography>
                  <Typography variant="h5">
                    <Tooltip placement='right' title={selected?.shipArea?.companyName}>

                      {selected?.shipArea?.companyCode}
                    </Tooltip>
                  </Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography minWidth={50} fontSize={'0.875rem'} variant="subtitle2">
                    출고 계획(Thời gian)
                  </Typography>
                  <Typography variant="h5">{formatDateFromDB(selected?.shipDate, false)}</Typography>
                </Stack>
                <Divider />
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded sx={{ backgroundColor: '#fafafa' }}>

            <AccordionSummary

              expandIcon={<IconCaretDown />}
              aria-controls="panel2content"
              id="panel2-header"
            >
              <Typography color={'primary'} variant="h5">
                &bull; 금형 입고(Kho Khuôn)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    양산업체(Cty SX)
                  </Typography>
                  <Typography variant="h5">
                    <Tooltip placement='right' title={selected?.massCompany?.companyName}>
                      {selected?.massCompany?.companyCode}
                    </Tooltip>
                  </Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    양산업체입고(Thời gian)
                  </Typography>
                  <Typography variant="h5">{formatDateFromDB(selected?.shipMassCompany, false)}</Typography>
                </Stack>
                <Divider />
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion defaultExpanded sx={{ backgroundColor: '#fafafa' }}>

            <AccordionSummary

              expandIcon={<IconCaretDown />}
              aria-controls="panel2content"
              id="panel2-header"
            >
              <Typography color={'primary'} variant="h5">
                &bull; 금형 수리(Sửa Chữa Khuôn)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    수정업체(Nơi sửa)
                  </Typography>
                  <Typography variant="h5">
                    <Tooltip placement='right' title={selected?.modificationCompany?.companyName}>
                      {selected?.modificationCompany?.companyCode}
                    </Tooltip>
                  </Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    수리 출고(Xuất kho sửa)
                  </Typography>
                  <Typography variant="h5">{formatDateFromDB(selected?.outputEdit, false)}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    입고 계획(Xuất tới)
                  </Typography>
                  <Typography variant="h5">
                    <Tooltip placement='right' title={selected?.wearingPlan?.companyName}>
                      {selected?.wearingPlan?.companyCode}
                    </Tooltip>
                  </Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    입고 완료(Thời gian)
                  </Typography>
                  <Typography variant="h5">{formatDateFromDB(selected?.receivingCompleted, false)}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    TRY NO.
                  </Typography>
                  <Typography color={'primary'}  fontWeight={'bold'} variant="h5">{selected?.tryNo}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    수정내역(Lịch sử chỉnh sửa)
                  </Typography>
                  <Typography variant="h5">{selected?.historyEdit}</Typography>
                </Stack>
                <Divider />

              </Stack>
            </AccordionDetails>
          </Accordion>

        </DialogContent>
        <DialogActions>
          <Button variant="custom" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
