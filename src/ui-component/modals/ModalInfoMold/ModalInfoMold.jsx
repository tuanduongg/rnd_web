import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { Box, Card, Chip, Divider, Grid, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { IconDeviceFloppy, IconPlus, IconUpload } from '@tabler/icons-react';
import { isMobile } from 'react-device-detect';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import config from 'config';
import { useRef } from 'react';
import { useEffect } from 'react';
import { PhotoProvider } from 'react-photo-view';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineOppositeContent,
  timelineOppositeContentClasses,
  TimelineSeparator
} from '@mui/lab';
import OutputIcon from '@mui/icons-material/Output';
import InputIcon from '@mui/icons-material/Input';
import { formatDateFromDB } from 'utils/helper';
import SubCard from 'ui-component/cards/SubCard';
import './modal_info_mold.css';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    borderBottom: 'none'
  },
  '.MuiPaper-root': {
    maxWidth: '700px',
    minWidth: '400px'
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  },

  '& .MuiDialogTitle-root': {
    padding: '10px 15px'
  }
}));
// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1
// });

export default function ModalInfoMold({ open, onClose, selectedProp }) {
  const theme = useTheme();
  const [selected, setSelected] = useState(null);
  const [lastInOut, setLastInOut] = useState(null);
  useEffect(() => {
    if (open && selectedProp) {
      setSelected(selectedProp);
      const inOutJig = selectedProp?.inOutJig;
      const lenghtInOutJig = selectedProp?.inOutJig?.length;
      console.log('selectedProp', selectedProp);
      if (inOutJig?.length > 0) {
        const lastInOutNew = inOutJig[lenghtInOutJig - 1];
        console.log('lastInOutNew', lastInOutNew);

        setLastInOut(lastInOutNew);
      }
    }
  }, [selectedProp]);
  const handleClose = (event, reason) => {
    if (reason && (reason == 'backdropClick' || reason === 'escapeKeyDown')) return;
    setSelected(null);
    onClose();
  };
  return (
    <>
      <PhotoProvider pullClosable={true} maskClosable={true}>
        <BootstrapDialog fullScreen={isMobile} maxWidth={'md'} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle sx={{ m: 0, p: 2, fontSize: '18px' }} id="customized-dialog-title">
            <Stack direction={'row'} alignItems={'center'}>
              <div style={{ marginRight: '5px' }}>JIG Infomation</div>
              {lastInOut ? <Chip size="small" label={lastInOut?.type} color={lastInOut?.type === 'IN' ? 'success' : 'error'} /> : null}
            </Stack>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 6
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <Box>
              <>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                      &bull; Assset No.
                    </Typography>
                    <Typography ml={1} variant="subtitle1">
                      {selected?.assetNo}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                      &bull; Phan Loai
                    </Typography>
                    <Typography ml={1} variant="subtitle1">
                      {selected?.category}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                      &bull; Model
                    </Typography>
                    <Typography ml={1} variant="subtitle1">
                      {selected?.model}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                      &bull; Product Name
                    </Typography>
                    <Typography ml={1} sx={{ wordBreak: 'break-word' }} variant="subtitle1">
                      {selected?.productName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                      &bull; Ver/Editon/S*F*C
                    </Typography>
                    <Typography ml={1} variant="subtitle1">
                      {selected?.version + '/' + selected?.edition + '/' + selected?.SFC}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                      &bull; Company
                    </Typography>
                    <Typography ml={1} variant="subtitle1">
                      {selected?.company}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography sx={{ color: theme?.palette?.primary?.main }} variant="subtitle2">
                      &bull; Model Code
                    </Typography>
                    <Typography ml={1} variant="subtitle1">
                      {selected?.code}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                    <br />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography color={'primary'} textAlign={'center'} variant="h4">
                      In/Out JIG
                    </Typography>
                    <Timeline>
                      {selected?.inOutJig?.length > 0
                        ? selected?.inOutJig?.map((item, index) => (
                            <TimelineItem key={index}>
                              <TimelineOppositeContent sx={{ m: 'auto 0' }} align="right" variant="h6">
                                {item?.date ? formatDateFromDB(item?.date, false) : ''}
                              </TimelineOppositeContent>
                              <TimelineSeparator>
                                <TimelineConnector />
                                {item?.type === 'IN' && (
                                  <TimelineDot color="success">
                                    <InputIcon />
                                  </TimelineDot>
                                )}
                                {item?.type === 'OUT' && (
                                  <TimelineDot color="error">
                                    <OutputIcon />
                                  </TimelineDot>
                                )}
                                <TimelineConnector />
                              </TimelineSeparator>
                              <TimelineContent sx={{ py: '12px', px: 2 }}>
                                <Box p={2} sx={{border:'1px dotted #aaa',borderRadius:'15px'}}>
                                  <Typography variant="h5" component="span">
                                    {item?.location}
                                  </Typography>
                                  <Typography variant="body2">{item?.type === 'IN' ? 'in' : 'out'}</Typography>
                                </Box>
                              </TimelineContent>
                            </TimelineItem>
                          ))
                        : null}
                    </Timeline>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
              </>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="custom" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        </BootstrapDialog>
      </PhotoProvider>
    </>
  );
}
