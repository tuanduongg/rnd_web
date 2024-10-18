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
import { cssScrollbar, formatDateFromDB, getDepartmentEditMold } from 'utils/helper';
import { IconCaretDown, IconFileSpreadsheet } from '@tabler/icons-react';
import { IconHistory } from '@tabler/icons-react';
import ModalHistory from '../ModalHistory/ModalHistory';
import { useEffect, useState } from 'react';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import toast from 'react-hot-toast';
import { saveAs } from 'file-saver';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
    borderBottom: 'none'
  },
  '.MuiPaper-root': {
    // maxWidth: '0px',
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
export default function ModalDetailMold({ open, onClose, selected, setLoading }) {
  const [openModalHis, setOpenModalHis] = useState(false);
  const [dataHistoryTryNo, setDataHistoryTryNo] = useState([]);
  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    setDataHistoryTryNo([]);
    onClose();
  };

  useEffect(() => {

    if (open && selected) {
      getAllHistoryTryNo()
    }
  }, [open])


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
    setLoading(true);
    const response = await restApi.post(
      RouterApi.outputJigExportID,
      {
        outputJigID: selected?.outputJigID
      },
      {
        responseType: 'arraybuffer'
      }
    );
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
        <DialogContent sx={{ ...cssScrollbar, overflowX: 'hidden' }}>
          {/* <Stack direction={'row'} spacing={1}>
            <Box width={'50%'} sx={{ backgroundColor: '#fafafa' }} p={1}>
              <Typography mb={2} color={'primary'} variant="h5">
                &bull; 일반 정보(Thông tin chung)
              </Typography>
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
                  <Typography fontSize={'0.875rem'} minWidth={100} variant="subtitle2">
                    Description
                  </Typography>
                  <Typography textAlign={'right'} variant="h5">{selected?.model?.description}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    Mold No.
                  </Typography>
                  <Typography color={'primary'} fontWeight={'bold'} variant="h5">
                    {selected?.moldNo ? `#${selected?.moldNo}` : ''}
                  </Typography>
                </Stack>
                <Divider />

              </Stack>
            </Box>
            <Stack width={'50%'} sx={{ backgroundColor: '#fafafa' }} spacing={1}>
              <Box p={1}>
                <Typography mb={2} color={'primary'} variant="h5">
                  &bull; 금형 출고(Giao khuôn)
                </Typography>
                <Stack>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography fontSize={'0.875rem'} variant="subtitle2">
                      제작업체(NSX)
                    </Typography>
                    <Typography variant="h5">
                      <Tooltip placement="right" title={selected?.manufacturer?.companyName}>
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
                      <Tooltip placement="right" title={selected?.shipArea?.companyName}>
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
              </Box>
              <Box p={1}>
                <Typography color={'primary'} mb={1.5} variant="h5">
                  &bull; 금형 입고(Kho Khuôn)
                </Typography>
                <Stack>
                  <Stack direction={'row'} justifyContent={'space-between'}>
                    <Typography fontSize={'0.875rem'} variant="subtitle2">
                      양산업체(Cty SX)
                    </Typography>
                    <Typography variant="h5">
                      <Tooltip placement="right" title={selected?.massCompany?.companyName}>
                        {selected?.massCompany?.companyCode}
                      </Tooltip>
                    </Typography>
                  </Stack>
                  <Divider />
                  <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                    <Typography fontSize={'0.875rem'} variant="subtitle2">
                      양산업체입고
                    </Typography>
                    <Typography variant="h5">{formatDateFromDB(selected?.shipMassCompany, false)}</Typography>
                  </Stack>
                  <Divider />
                </Stack>
              </Box>
            </Stack>
          </Stack>
          <Accordion defaultExpanded sx={{ backgroundColor: '#fafafa', marginTop: '16px' }}>
            <AccordionSummary expandIcon={<IconCaretDown />} aria-controls="panel2content" id="panel2-header">
              <Typography color={'primary'} variant="h5">
                &bull; 금형 수리(Sửa Chữa Khuôn)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                <Stack direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    양산적용(Trạng thái)
                  </Typography>
                  <Typography variant="h5">{getChipStatus(selected?.productionStatus, { marginBottom: '5px' })}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    수정업체(Nơi sửa)
                  </Typography>
                  <Typography variant="h5">
                    <Tooltip placement="right" title={selected?.historyTryNo[0]?.modificationCompany?.companyName}>
                      {selected?.historyTryNo[0]?.modificationCompany?.companyCode}
                    </Tooltip>
                  </Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    수리 출고(Xuất kho sửa)
                  </Typography>
                  <Typography variant="h5">{formatDateFromDB(selected?.historyTryNo[0]?.outputEdit, false)}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    입고 계획(K.Hoach sửa xong)
                  </Typography>
                  <Typography variant="h5">{formatDateFromDB(selected?.historyTryNo[0]?.wearingPlan, false)}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    입고 완료(T.tế sửa xong)
                  </Typography>
                  <Typography variant="h5">{formatDateFromDB(selected?.historyTryNo[0]?.receivingCompleted, false)}</Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography fontSize={'0.875rem'} variant="subtitle2">
                    TRY NO.
                  </Typography>
                  <Typography color={'primary'} fontWeight={'bold'} variant="h5">
                    {selected?.historyTryNo[0]?.tryNum ? `T${selected?.historyTryNo[0]?.tryNum}` : ''}
                  </Typography>
                </Stack>
                <Divider />
                <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                  <Typography minWidth={170} fontSize={'0.875rem'} variant="subtitle2">
                    수정내역(Nội dung sửa)
                  </Typography>
                  <Typography variant="h5">{selected?.historyTryNo[0]?.remark ? `${selected?.historyTryNo[0]?.remark}` : ''}</Typography>
                </Stack>
                <Divider />
              </Stack>
            </AccordionDetails>
          </Accordion> */}
          {/* <Accordion onChange={onChangeExpandedHistoryTryNo} sx={{ backgroundColor: '#fafafa' }}>
            <AccordionSummary expandIcon={<IconCaretDown />} aria-controls="panel2content" id="panel2-header">
              <Typography color={'primary'} variant="h5">
                &bull; History(TRY NO.)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                <Grid pt={1} pb={1} container>
                  <Grid textAlign={'center'} item xs={1}>
                    <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                      Try No.
                    </Typography>
                  </Grid>
                  <Grid textAlign={'center'} item xs={1.5}>
                    <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                      수정업체
                      <br />
                      (Nơi sửa)
                    </Typography>
                  </Grid>
                  <Grid textAlign={'center'} item xs={2}>
                    <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                      수리 출고
                      <br />
                      (Xuất kho)
                    </Typography>
                  </Grid>
                  <Grid textAlign={'center'} item xs={2}>
                    <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                      입고 계획
                      <br />
                      (K.H xong)
                    </Typography>
                  </Grid>
                  <Grid textAlign={'center'} item xs={2}>
                    <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                      입고 완료
                      <br />
                      (T.tế xong)
                    </Typography>
                  </Grid>
                  <Grid textAlign={'center'} item xs={1.5}>
                    <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                      수정
                    </Typography>
                  </Grid>
                  <Grid textAlign={'center'} item xs={2}>
                    <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                      수정내역
                      <br />
                      (Nội dung)
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
                {dataHistoryTryNo?.length > 0
                  ? dataHistoryTryNo.map(
                    (his) =>
                      his?.tryNum && (
                        <>
                          <Grid pt={1} pb={1} container>
                            <Grid item xs={1}>
                              <Typography
                                color={his?.currentTry ? 'primary' : ''}
                                textAlign={'center'}
                                fontSize={'0.875rem'}
                                variant="h5"
                              >
                                {his?.tryNum ? `T${his?.tryNum}` : ''}
                              </Typography>
                            </Grid>

                            <Grid item xs={1.5}>
                              <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                                <Tooltip title={his?.modificationCompany?.companyName}>{his?.modificationCompany?.companyCode}</Tooltip>
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                                {his?.outputEdit ? formatDateFromDB(his?.outputEdit, false) : null}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                                {his?.wearingPlan ? formatDateFromDB(his?.wearingPlan, false) : null}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                                {his?.receivingCompleted ? formatDateFromDB(his?.receivingCompleted, false) : null}
                              </Typography>
                            </Grid>
                            <Grid item xs={1.5}>
                              <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                                {getDepartmentEditMold(his?.departEdit)}
                              </Typography>
                            </Grid>
                            <Grid item xs={2}>
                              <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                                {his?.remark}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Divider />
                        </>
                      )
                  )
                  : null}
              </Stack>
            </AccordionDetails>
          </Accordion> */}
          <Stack>
            <Grid pt={1} pb={1} container>
              <Grid textAlign={'center'} item xs={1}>
                <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                  Try No.
                </Typography>
              </Grid>
              <Grid textAlign={'center'} item xs={1.5}>
                <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                  수정업체
                  <br />
                  (Nơi sửa)
                </Typography>
              </Grid>
              <Grid textAlign={'center'} item xs={2}>
                <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                  수리 출고
                  <br />
                  (Xuất kho)
                </Typography>
              </Grid>
              <Grid textAlign={'center'} item xs={2}>
                <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                  입고 계획
                  <br />
                  (K.H xong)
                </Typography>
              </Grid>
              <Grid textAlign={'center'} item xs={2}>
                <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                  입고 완료
                  <br />
                  (T.tế xong)
                </Typography>
              </Grid>
              <Grid textAlign={'center'} item xs={1.5}>
                <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                  수정
                </Typography>
              </Grid>
              <Grid textAlign={'center'} item xs={2}>
                <Typography textAlign={'center'} fontSize={'0.875rem'} variant="subtitle2">
                  수정내역
                  <br />
                  (Nội dung)
                </Typography>
              </Grid>
              {/* <Grid textAlign={'right'} item xs={1}>
                    <Typography textAlign={'right'} fontSize={'0.875rem'} variant="subtitle2">
                      Time
                    </Typography>
                  </Grid> */}
            </Grid>
            <Divider />
            {dataHistoryTryNo?.length > 0
              ? dataHistoryTryNo.map(
                (his) =>
                  his?.tryNum && (
                    <>
                      <Grid pt={1} pb={1} container>
                        <Grid item xs={1}>
                          <Typography
                            color={his?.currentTry ? 'primary' : ''}
                            textAlign={'center'}
                            fontSize={'0.875rem'}
                            variant="h5"
                          >
                            {his?.tryNum ? `T${his?.tryNum}` : ''}
                          </Typography>
                        </Grid>

                        <Grid item xs={1.5}>
                          <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                            <Tooltip title={his?.modificationCompany?.companyName}>{his?.modificationCompany?.companyCode}</Tooltip>
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                            {his?.outputEdit ? formatDateFromDB(his?.outputEdit, false) : null}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                            {his?.wearingPlan ? formatDateFromDB(his?.wearingPlan, false) : null}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                            {his?.receivingCompleted ? formatDateFromDB(his?.receivingCompleted, false) : null}
                          </Typography>
                        </Grid>
                        <Grid item xs={1.5}>
                          <Typography fontWeight={'bold'} textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                            {getDepartmentEditMold(his?.departEdit)}
                          </Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Typography textAlign={'center'} fontSize={'0.875rem'} variant="h5">
                            {his?.remark}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                    </>
                  )
              )
              : (
                <Box textAlign={'center'}>
                  <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                  <div>NO DATA</div>
                </Box>
              )}
          </Stack>
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
