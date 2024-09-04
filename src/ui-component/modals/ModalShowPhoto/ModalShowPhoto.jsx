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
  Tab
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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(1),
    borderBottom: 'none'
  },
  '.MuiPaper-root': {
    maxWidth: '700px',
    minWidth: '700px'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },

  '& .MuiDialogTitle-root': {
    padding: '10px 15px'
  }
}));
export const VALUE_TAB = {
  image: 'IMAGE_TAB',
  request: 'REQUEST_TAB',
  reply: 'REPLY_TAB'
};
export default function ModalShowPhoto({ open, onClose, valueTabProp, selected }) {
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
            Media
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
          <TabContext value={valueTab}>
            <Box>
              <TabList
                onChange={(event, newValue) => {
                  setValueTab(newValue);
                }}
                aria-label="Tabs"
              >
                <Tab label="불량 사진(Hình ảnh lỗi)" value={VALUE_TAB.image} />
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
