import {
  Avatar,
  Checkbox,
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
import React, { Fragment } from 'react';
import { formatBytes, formatDateFromDB } from 'utils/helper';
import { getIcon, showNameFile } from '../modal_concept.service';
import { useTheme } from '@mui/material/styles';
import restApi from 'utils/restAPI';
import { RouterApi } from 'utils/router-api';
import { IconFileFilled } from '@tabler/icons-react';
import { Box } from '@mui/system';
import { getClassWithColor } from 'file-icons-js';
import 'file-icons-js/css/style.css';
import './listfile.css';


const ListFile = ({ checked, setChecked, listFile, typeModal, setLoading }) => {
  const theme = useTheme();
  const onClickCheckedAll = () => {
    if (checked?.length === listFile.length) {
      setChecked([]);
    } else {
      setChecked(listFile?.map((item) => item?.fileId));
    }
  };
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
  const onClickDownLoad = async (value) => {
    const { fileId, fileName, fileExtenstion, fileUrl } = value;
    setLoading(true);
    const response = await restApi.post(
      RouterApi.conceptDownload,
      { fileId: fileId },
      {
        responseType: 'blob'
      }
    );
    setLoading(false);
    if (response?.status === 200) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.${fileExtenstion}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Download File Fail!')
    }
  };
  return (
    <>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {(listFile?.length > 0) && (
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
                sx={{ '.MuiListItemText-primary': { fontWeight: 'bold', color: theme?.palette?.primary?.main }, minWidth: { xs: '68%', sm: '83%' } }}
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
                    <Tooltip arrow placement='left' title="Download">
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
                    </Tooltip>
                  }
                  disablePadding
                >
                  <ListItemButton disableGutters sx={{ padding: '5px' }} role={undefined} onClick={handleToggle(value?.fileId)} dense>
                    <span
                      className={getIcon(value)}
                      style={{ fontSize: '33px', minWidth: '40px' }}
                    />
                    {/* <Box sx={{width:'26px',marginRight:'5px'}}>

<FileIcon extension={value?.fileExtenstion} {...defaultStyles[value?.fileExtenstion]} />
</Box> */}
                    {/* <IconFileFilled size={33} /> */}
                    <ListItemText
                      sx={{ margin: '0px' }}
                      primary={value?.name ? value?.name : showNameFile(value?.fileName, value?.fileExtenstion)}
                      secondary={
                        <Stack direction={'row'} sx={{ fontSize: '12px' }}>
                          <span style={{ minWidth: '75px' }}>
                            {formatBytes(value?.size ? value?.size : value?.fileSize ? value?.fileSize : '')}
                          </span>
                          <span>
                            <Tooltip arrow title="Upload at">{formatDateFromDB(value?.uploadAt)}</Tooltip>
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
        {listFile?.length > 0 && (<Divider />)}
      </List>
    </>
  );
};
export default ListFile;
