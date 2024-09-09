import { useState } from 'react';
import { Box, IconButton, Stack, ImageList, ImageListItem } from '@mui/material';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { concatFileNameWithExtension, showImageFromAPI } from 'utils/helper';

const ImageTab = ({ images }) => {

  const getTitleFromImage = (index) => {
    const find = images?.find((item, i) => (i === index));
    if (find) {
      return concatFileNameWithExtension(find?.fileName, find?.fileExtenstion);
    }
    return ''

  }
  return (
    <>
      <PhotoProvider
        maskOpacity={0.5}
        toolbarRender={({ rotate, onRotate, index }) => {
          return (
            <Stack direction={'row'} alignItems={'center'}>
              <span style={{marginRight:'10px'}}>{getTitleFromImage(index)}</span>
              <IconButton className="PhotoView-Slider__toolbarIcon color-icon" onClick={() => { onRotate(rotate - 90); getTitleFromImage(index) }} size="small">
                <RotateLeftIcon />
              </IconButton>
              <IconButton className="PhotoView-Slider__toolbarIcon color-icon" onClick={() => onRotate(rotate + 90)} size="small">
                <RotateRightIcon />
              </IconButton>
            </Stack>
          );
        }}
      >
        <Box>
          <ImageList sx={{ width: '100%' }} variant="quilted" cols={4} rowHeight={121}>
            {images?.length > 0
              ? images?.map((item, index) => (
                <PhotoView key={index} src={showImageFromAPI(item?.fileUrl)}>
                  <ImageListItem cols={1} rows={1}>
                    <img src={showImageFromAPI(item?.fileUrl)} alt={item?.fileName} />
                  </ImageListItem>
                </PhotoView>
              ))
              : 'No data'}
          </ImageList>
        </Box>
      </PhotoProvider>
    </>
  );
};
export default ImageTab;
