import {
  Avatar,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import { IconFileDownload } from '@tabler/icons-react';
import { IconDownload, IconFile } from '@tabler/icons-react';
import React, { Fragment, useEffect, useState } from 'react';
import { formatBytes, formatDateFromDB, isValidFileType } from 'utils/helper';
import { getIcon, showNameFile } from '../modal_concept.service';
import { useTheme } from '@mui/material/styles';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import 'file-icons-js/css/style.css';
import './listfile.css';

const ListFile = ({ checked, setChecked, listFileProp, typeModal, setLoading }) => {
  const theme = useTheme();
  const [listFile, setListFile] = useState([]);
  const [loadingID, setLoadingID] = useState([]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  function downloadURL(url) {
    var hiddenIFrameID = 'hiddenDownloader',
      iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
      iframe = document.createElement('iframe');
      iframe.id = hiddenIFrameID;
      // iframe.style.display = 'none';
      document.body.appendChild(iframe);
    }
    iframe.src = url;
  }

  useEffect(() => {
    setListFile(listFileProp);
  }, [listFileProp]);
  function base64toBlob(base64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      var begin = sliceIndex * sliceSize;
      var end = Math.min(begin + sliceSize, bytesLength);

      var bytes = new Array(end - begin);
      for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  const onClickDownLoad = async (value) => {
    const { fileId, fileName, fileExtenstion, fileUrl } = value;
    setLoadingID(loadingID.concat(fileId));
    const url = import.meta.env.VITE_APP_API_URL_UPLOAD + fileUrl;
    const file = `${fileName}${fileExtenstion ? '.' + fileExtenstion : ''}`;
    const response = await restApi.post(
      RouterApi.conceptDownload,
      { fileId: fileId },
      {
        responseType: 'blob' // important for handling binary data
      }
    );
    const listLoading = loadingID.filter((item) => item?.fileId !== fileId);
    setLoadingID(listLoading);
    setLoading(false);
    if (response?.status === 200) {
      const blob = response.data;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}${fileExtenstion ? '.' + fileExtenstion : ''}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Download file fail!');
    }
  };
  function saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
      document.body.appendChild(link); // Firefox requires the link to be in the body
      link.setAttribute('download', filename);
      link.download = filename;
      link.href = uri;
      link.click();
      document.body.removeChild(link); // remove the link when done
    } else {
      location.replace(uri);
    }
  }
  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {listFile?.length > 0 && (
          <>
            <Divider />
            <ListItem key={0} disablePadding sx={{ padding: '5px 5px' }}>
              {/* <ListItemIcon>
                <Checkbox
                  onClick={() => {
                    onClickCheckedAll();
                  }}
                  edge="start"
                  checked={checked?.length === listFile?.length}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': 0 }}
                />
              </ListItemIcon> */}
              <ListItemText
                id={0}
                sx={{
                  '.MuiListItemText-primary': { fontWeight: 'bold', color: theme?.palette?.primary?.main, wordBreak: 'break-all' },
                  width: { xs: '68%', sm: '82%' },
                  wordBreak: 'break-all'
                }}
                primary={'File Name'}
              />
              <ListItemText
                id={0}
                sx={{ '.MuiListItemText-primary': { fontWeight: 'bold', color: theme?.palette?.primary?.main }, maxWidth: '50px' }}
                primary={'ECN'}
              />
              <ListItemText
                id={0}
                sx={{ textAlign: 'right', '.MuiListItemText-primary': { fontWeight: 'bold', color: theme?.palette?.primary?.main } }}
                primary={'Download'}
              />
            </ListItem>
            <Divider />
          </>
        )}
        {listFile?.length > 0 &&
          listFile?.map((value, index) => {
            const labelId = `checkbox-list-label-${value?.fileId}`;

            return (
              <Fragment key={value?.fileId}>
                <ListItem
                  key={value?.fileId}
                  secondaryAction={
                    <Tooltip
                      arrow
                      placement="right"
                      title={loadingID.includes(value?.fileId) ? "Downloading... You don't close this tab" : 'Download'}
                    >
                      {loadingID.includes(value?.fileId) ? (
                        <CircularProgress color="primary" size={20} />
                      ) : (
                        <IconButton
                          onClick={() => {
                            onClickDownLoad(value);
                          }}
                          size="small"
                          edge="end"
                          aria-label="comments"
                        >
                          <IconDownload />
                        </IconButton>
                      )}
                    </Tooltip>
                  }
                  disablePadding
                >
                  <ListItemButton disableGutters sx={{ padding: '5px' }} role={undefined} onClick={handleToggle(value?.fileId)} dense>
                    <span className={getIcon(value)} style={{ fontSize: '33px', minWidth: '40px' }} />
                    <ListItemText
                      sx={{ margin: '0px', wordBreak: 'break-all' }}
                      primary={value?.name ? value?.name : showNameFile(value?.fileName, value?.fileExtenstion)}
                      secondary={
                        <Stack direction={'row'} sx={{ fontSize: '12px' }}>
                          <span style={{ minWidth: '75px' }}>
                            {formatBytes(value?.size ? value?.size : value?.fileSize ? value?.fileSize : '')}
                          </span>
                          <span>
                            <Tooltip arrow title="Upload at">
                              {formatDateFromDB(value?.uploadAt)}
                            </Tooltip>
                          </span>
                        </Stack>
                      }
                    />
                    <Typography sx={{ marginRight: '50px', textAlign: 'center' }} component={'h6'}>
                      {value?.ECN}
                    </Typography>
                    {/* <ListItemText secondary={formatBytes(value?.size ? value?.size : value?.fileSize ? value?.fileSize : '')}/> */}
                  </ListItemButton>
                </ListItem>
              </Fragment>
            );
          })}
        {listFile?.length > 0 && <Divider />}
      </List>
    </>
  );
};
export default ListFile;
