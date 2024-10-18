import React, { useState } from 'react';
import {
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material';
import { IconFile } from '@tabler/icons-react';
import { IconDownload } from '@tabler/icons-react';
import { Stack } from '@mui/system';
import { concatFileNameWithExtension, formatBytes, formatDateFromDB } from 'utils/helper';
import { getIcon, showNameFile } from 'ui-component/modals/ModalConcept/modal_concept.service';
import 'file-icons-js/css/style.css';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { addDownload, downloadSuccessful } from 'store/downloadSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
function generate(element) {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((value) =>
    React.cloneElement(element, {
      key: value
    })
  );
}

const ListFileShow = ({ listFile }) => {
  const [loadingID, setLoadingID] = useState([]);
  const dispatch = useDispatch();

  const onClickDownLoad = async (value) => {
    
    const { fileId, fileName, fileExtenstion, fileUrl } = value;
    dispatch(addDownload({ id: fileId, name: showNameFile(fileName, fileExtenstion), progress: true }));
    setLoadingID(loadingID.concat(fileId));
    const response = await restApi.post(
      RouterApi.downloadFileReportQC,
      { fileId: fileId },
      {
        responseType: 'blob' // important for handling binary data
      }
    );
    const listLoading = loadingID.filter((item) => item?.fileId !== fileId);
    setLoadingID(listLoading);
    if (response?.status === 200) {
      const blob = response.data;
      const url = window.URL.createObjectURL(new Blob([blob]));
      dispatch(downloadSuccessful({ id: fileId, progress: false, link: url }));
      toast.success('Downloaded successfully!')
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `${fileName}${fileExtenstion ? '.' + fileExtenstion : ''}`);
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
    } else {
      alert('Download file fail!');
    }
  };
  console.log('listFile',listFile);
  
  return (
    <>
      <List dense={false}>
        <Divider />

        {listFile?.length > 0 ? (
          listFile.map((item, index) => (
            <span key={index}>
              <ListItem
                secondaryAction={
                  loadingID?.includes(item?.fileId) ? (
                    <CircularProgress color="primary" size={20} />
                  ) : (
                    <IconButton
                      onClick={() => {
                        onClickDownLoad(item);
                      }}
                      edge="end"
                      aria-label="delete"
                    >
                      <IconDownload />
                    </IconButton>
                  )
                }
              >
                <span className={getIcon(item) + ' iconcustom'} />
                <ListItemText
                  sx={{
                    '.MuiListItemText-primary': { wordBreak: 'break-all' }
                  }}
                  primary={concatFileNameWithExtension(item?.fileName, item?.fileExtenstion)}
                  secondary={
                    <Stack direction={'row'} sx={{ fontSize: '12px' }}>
                      <span style={{ minWidth: '75px' }}>{formatBytes(item?.fileSize)}</span>
                      <span>
                        <Tooltip arrow title="Upload at">
                          {formatDateFromDB(item?.uploadAt)}
                        </Tooltip>
                      </span>
                    </Stack>
                  }
                />
              </ListItem>
              <Divider />
            </span>
          ))
        ) : (
          <Typography variant="subtitle2"></Typography>
        )}
      </List>
    </>
  );
};
export default ListFileShow;
