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
  ImageListItem,
  Tab,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import TabList from '@mui/lab/TabList';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import CloseIcon from '@mui/icons-material/Close';
import { isMobile } from 'react-device-detect';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import './modal_show_photo.css';
import { useEffect, useState } from 'react';
import ImageTab from './component/ImageTab';
import { TabContext, TabPanel } from '@mui/lab';
import ListFileShow from './component/ListFileShow';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import IMAGE_EMPTYDATA from 'assets/images/backgrounds/empty-box.png';
import { useTheme } from '@mui/material/styles';
import { cssScrollbar, formatDateFromDB, formatNumberWithCommas } from 'utils/helper';
import { getShift } from 'views/counter_tactics/component/tablelist.service';
import { IconCaretDown } from '@tabler/icons-react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
    borderBottom: 'none'
  },
  '.MuiPaper-root': {
    maxWidth: '700px',
    // minWidth: '700px'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },

  '& .MuiDialogTitle-root': {
    padding: '10px 15px'
  }
}));

const getChip = (text, color) => {
  return (
    text ? <Chip sx={{ marginLeft: '10px' }} size='small' label={text} variant='outlined' color={color} /> : null
  )
}
export const VALUE_TAB = {
  image: 'IMAGE_TAB',
  request: 'REQUEST_TAB',
  reply: 'REPLY_TAB'
};
export default function ModalShowPhoto({ open, onClose, valueTabProp, selected, typeModal }) {
  const [valueTab, setValueTab] = useState(VALUE_TAB.image);
  const [images, setImages] = useState([]);
  const [filesRequest, setFilesRequest] = useState([]);
  const [filesReply, setFilesReply] = useState([]);
  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    onClose();
  };

  const getImags = async () => {
    const res = await restApi.post(RouterApi.getImagesByReportQC, { reportId: selected?.reportId });
    if (res?.status === 200) {
      const data = res?.data;
      const imageArr = [];
      const fileRequestArr = [],
        fileReplyArr = [];
      data.map((item) => {
        switch (item?.type) {
          case 'FRQ':
            fileRequestArr.push(item);
            break;
          case 'FRL':
            fileReplyArr.push(item);
            break;
          case 'IMG':
            imageArr.push(item);
            break;
          default:
            break;
        }
      });
      setImages(imageArr);
      setFilesRequest(fileRequestArr);
      setFilesReply(fileReplyArr);
    }
  };
  useEffect(() => {
    if (open && selected?.reportId) {
      setValueTab(valueTabProp);
      getImags();
    }
  }, [valueTabProp]);

  return (
    <>
      <BootstrapDialog fullScreen={isMobile} maxWidth={'md'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
          <Stack direction={'row'} alignItems={'center'}>
            {'Detail '}
            {getChip(selected?.category?.categoryName, 'primary')}
            {getChip(selected?.code, 'success')}
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
          {/* {typeModal === 'VIEW' && (
            <Grid item mb={2} xs={12}>
              <Typography color={'primary'} variant="h5">
                &bull; Thông tin chung
              </Typography>
            </Grid>
          )} */}

          <Accordion defaultExpanded sx={{ backgroundColor: '#fafafa' }}>
            <AccordionSummary
              expandIcon={<IconCaretDown />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography color={'primary'} variant="h5">
                &bull; Thông tin chung
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>

                      <Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'}>

                        <Typography fontSize={'0.875rem'} sx={{marginRight:'5px'}} variant="subtitle2">
                          Shift:
                        </Typography>
                        <Typography variant="h5">{getShift(selected?.shift)}</Typography>
                      </Stack>
                      <Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'}>
                        <Typography fontSize={'0.875rem'} sx={{marginRight:'5px'}} variant="subtitle2">
                          Week:
                        </Typography>
                        <Typography variant="h5">{selected?.week}</Typography>
                      </Stack>
                      <Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'}>
                        <Typography fontSize={'0.875rem'} sx={{marginRight:'5px'}} variant="subtitle2">
                          Date:
                        </Typography>
                        <Typography variant="h5">{formatDateFromDB(selected?.time, false)}</Typography>
                      </Stack>
                      <Stack alignItems={'center'} direction={'row'} justifyContent={'space-between'}>
                        <Typography fontSize={'0.875rem'} sx={{marginRight:'5px'}} variant="subtitle2">
                          등록자(Người đăng ký):
                        </Typography>
                        <Typography variant="h5">{selected?.author}</Typography>
                      </Stack>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        Code
                      </Typography>
                      <Typography variant="h5">{selected?.code}</Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        Model
                      </Typography>
                      <Typography variant="h5">{selected?.model}</Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={50} fontSize={'0.875rem'} variant="subtitle2">
                        Item
                      </Typography>
                      <Typography variant="h5">{selected?.item}</Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        PL/NAME
                      </Typography>
                      <Typography variant="h5">{selected?.plName}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        요청 일자(Request)
                      </Typography>
                      <Typography color={'primary'} variant="h5">
                        {formatDateFromDB(selected?.dateRequest, false)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        회신 일자(Reply)
                      </Typography>
                      <Typography color={'primary'} variant="h5">
                        {formatDateFromDB(selected?.dateReply, false)}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded sx={{ backgroundColor: '#fafafa' }}>

            <AccordionSummary
              expandIcon={<IconCaretDown />}
              aria-controls="panel2content"
              id="panel2-header"
            >
              <Typography color={'primary'} variant="h5">
                &bull; Thông tin lỗi
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        불량명(Tên Lỗi)
                      </Typography>
                      <Typography color={'primary'} variant="h5">
                        {selected?.nameNG}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        Tỷ lệ
                      </Typography>
                      <Typography color={'primary'} variant="h5">
                        {selected?.percentageNG ? selected?.percentageNG + '%' : ''}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        Seowon Stock
                      </Typography>
                      <Typography variant="h5">
                        {formatNumberWithCommas(selected?.seowonStock)}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        Vendor Stock
                      </Typography>
                      <Typography variant="h5">
                        {formatNumberWithCommas(selected?.vendorStock)}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        부적합 통보(BP Thông Báo)
                      </Typography>
                      <Typography variant="h5">{selected?.processQC?.processName}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        고객(Khách hàng)
                      </Typography>
                      <Typography variant="h5">{selected?.supplier}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        귀책처(Chịu trách nhiệm)
                      </Typography>
                      <Typography variant="h5">{selected?.attributable}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        공급 업체 담당자(Đại diện NCC)
                      </Typography>
                      <Typography variant="h5">{selected?.representative}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid></Grid>
            </AccordionDetails>
          </Accordion>
          <Accordion sx={{ backgroundColor: '#fafafa' }}>

            <AccordionSummary
              expandIcon={<IconCaretDown />}
              aria-controls="panel2content"
              id="panel2-header"
            >
              <Typography color={'primary'} variant="h5">
                &bull; Nguyên nhân & Biện pháp
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={150} mr={2} fontSize={'0.875rem'} variant="subtitle2">
                        불량원인<br />(Nguyên nhân lỗi)
                      </Typography>
                      <Typography whiteSpace={"pre-line"} variant="h5">{selected?.techNG}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={150} mr={2} fontSize={'0.875rem'} variant="subtitle2">
                        임시조치<br />(Biện pháp)
                      </Typography>
                      <Typography whiteSpace={"pre-line"} variant="h5">{selected?.tempSolution}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={150} mr={2} fontSize={'0.875rem'} variant="subtitle2">
                        조치사항 <br />(Đã thực hiện)
                      </Typography>
                      <Typography whiteSpace={"pre-line"} variant="h5">{selected?.remark}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          {typeModal === 'VIEW' && (
            <Grid container spacing={3}>
              <>
                {/* <Grid item xs={5}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        Shift
                      </Typography>
                      <Typography variant="h5">{getShift(selected?.shift)}</Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        Week
                      </Typography>
                      <Typography variant="h5">{selected?.week}</Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        Date
                      </Typography>
                      <Typography variant="h5">{formatDateFromDB(selected?.time, false)}</Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        등록자(Người đăng ký)
                      </Typography>
                      <Typography variant="h5">{selected?.author}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={7}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        Code
                      </Typography>
                      <Typography variant="h5">{selected?.code}</Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        Model
                      </Typography>
                      <Typography variant="h5">{selected?.model}</Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={50} fontSize={'0.875rem'} variant="subtitle2">
                        Item
                      </Typography>
                      <Typography variant="h5">{selected?.item}</Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        PL/NAME
                      </Typography>
                      <Typography variant="h5">{selected?.plName}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        요청 일자(Request)
                      </Typography>
                      <Typography color={'primary'} variant="h5">
                        {formatDateFromDB(selected?.dateRequest, false)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack mt={2} direction={'row'} justifyContent={'space-between'}>
                      <Typography fontSize={'0.875rem'} variant="subtitle2">
                        회신 일자(Reply)
                      </Typography>
                      <Typography color={'primary'} variant="h5">
                        {formatDateFromDB(selected?.dateReply, false)}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid> */}
                {/* {typeModal === 'VIEW' && (
                  <Grid item xs={12}>
                    <Typography color={'primary'} variant="h5">
                      &bull; Thông tin lỗi
                    </Typography>
                  </Grid>
                )} */}

                {/* <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        불량명(Tên Lỗi)
                      </Typography>
                      <Typography color={'primary'} variant="h5">
                        {selected?.nameNG}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        Tỷ lệ
                      </Typography>
                      <Typography color={'primary'} variant="h5">
                        {selected?.percentageNG ? selected?.percentageNG + '%' : ''}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        Seowon Stock
                      </Typography>
                      <Typography variant="h5">
                        {formatNumberWithCommas(selected?.seowonStock)}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        Vendor Stock
                      </Typography>
                      <Typography variant="h5">
                        {formatNumberWithCommas(selected?.vendorStock)}
                      </Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        부적합 통보(BP Thông Báo)
                      </Typography>
                      <Typography variant="h5">{selected?.processQC?.processName}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        고객(Khách hàng)
                      </Typography>
                      <Typography variant="h5">{selected?.supplier}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        귀책처(Chịu trách nhiệm)
                      </Typography>
                      <Typography variant="h5">{selected?.attributable}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={120} fontSize={'0.875rem'} variant="subtitle2">
                        공급 업체 담당자(Đại diện NCC)
                      </Typography>
                      <Typography variant="h5">{selected?.representative}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid> */}
                {/* {typeModal === 'VIEW' && (
                  <Grid item xs={12}>
                    <Typography color={'primary'} variant="h5">
                      &bull; Nguyên nhân & Biện pháp
                    </Typography>
                  </Grid>
                )} */}
                {/* <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={150} mr={2} fontSize={'0.875rem'} variant="subtitle2">
                        불량원인<br />(Nguyên nhân lỗi)
                      </Typography>
                      <Typography variant="h5">{selected?.techNG}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={150} mr={2} fontSize={'0.875rem'} variant="subtitle2">
                        임시조치<br />(Biện pháp)
                      </Typography>
                      <Typography variant="h5">{selected?.tempSolution}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography minWidth={150} mr={2} fontSize={'0.875rem'} variant="subtitle2">
                        조치사항 <br />(Đã thực hiện)
                      </Typography>
                      <Typography variant="h5">{selected?.remark}</Typography>
                    </Stack>
                    <Divider />
                  </Stack>
                </Grid> */}
              </>
            </Grid>
          )}
          {/* <Box sx={{ backgroundColor: '#fafafa' }}> */}

          {typeModal === 'VIEW' && (
            <Box mt={4} sx={{ marginLeft: '16px' }} mb={0}>
              <Typography color={'primary'} variant="h5">
                &bull; Files
              </Typography>
            </Box>
          )}
          <TabContext value={valueTab}>
            <Box>
              <TabList
                onChange={(event, newValue) => {
                  setValueTab(newValue);
                }}
                aria-label="Tabs"
              >
                <Tab label="불량 사진(Hình ảnh)" value={VALUE_TAB.image} />
                <Tab label="통보서(Thông báo)" value={VALUE_TAB.request} />
                <Tab label="대책서(Đối sách)" value={VALUE_TAB.reply} />
              </TabList>
            </Box>
            <TabPanel sx={{ padding: '0px' }} value={VALUE_TAB.image}>
              <Box sx={{ overflowY: 'auto', maxHeight: '315px' }}>
                {images?.length > 0 ? (
                  <ImageTab images={images} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                    <div>NO DATA</div>
                  </div>
                )}
              </Box>
            </TabPanel>
            <TabPanel sx={{ padding: '0px' }} value={VALUE_TAB.request}>
              <Box sx={{ overflowY: 'auto', maxHeight: '315px' }}>
                {filesRequest?.length > 0 ? (
                  <ListFileShow listFile={filesRequest} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                    <div>NO DATA</div>
                  </div>
                )}
              </Box>
            </TabPanel>
            <TabPanel sx={{ padding: '0px' }} value={VALUE_TAB.reply}>
              <Box sx={{ overflowY: 'auto', maxHeight: '315px' }}>
                {filesReply?.length > 0 ? (
                  <ListFileShow listFile={filesReply} />
                ) : (
                  <div style={{ textAlign: 'center', padding: '10px' }}>
                    <img src={IMAGE_EMPTYDATA} width={70} height={70} alt="image" />
                    <div>NO DATA</div>
                  </div>
                )}
              </Box>
            </TabPanel>
          </TabContext>
          {/* </Box> */}

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
