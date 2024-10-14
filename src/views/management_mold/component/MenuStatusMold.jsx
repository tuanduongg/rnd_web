import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import { useState } from 'react';
import { Chip, Tooltip, Typography } from '@mui/material';
import { ShowConfirm } from 'ui-component/ShowDialog';
import { RouterApi } from 'utils/router-api';
import restApi from 'utils/restAPI';
import toast from 'react-hot-toast';

const ARR_STATUS = [
  { id: 'DEV', text: '개발중', vnText: 'Đang phát triển ' },
  { id: 'DEV_EDIT', text: '개발수정', vnText: 'Phát triển sửa ' },
  { id: 'EDIT', text: '양산수정', vnText: 'Sản xuất sửa ' },
  { id: 'USE', text: '양산중', vnText: 'Đang sử dụng ' },
  { id: 'RISK', text: 'Risk양산', vnText: 'Rủi ro sản xuất' },
  { id: 'STOP', text: '사용중지', vnText: 'Ngừng sử dụng' }
];
export default function MenuStatus({ open, handleClose, anchorElMenuStatus, selected, afterSave }) {
  const onClickItemMenu = (code) => {
    ShowConfirm({
      title: 'Change Status',
      message: 'Do you want to change status?',
      onOK: async () => {
        const url = RouterApi.changeStatusOutputJig;
        const res = await restApi.post(url, { outputJigID: selected?.outputJigID, productionStatus: code });
        if (res?.status === 200) {
          toast.success('Saved changes successful!');
          afterSave();
          handleClose();
        } else {
          toast.error(res?.data?.message || 'Server Error!');
          handleClose();
        }
      }
    });
  };
  return (
    <div>
      {/* <Button
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Dashboard
      </Button> */}
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button'
        }}
        anchorEl={anchorElMenuStatus}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {ARR_STATUS?.map((item) => (
          <Tooltip placement="left" title={item?.vnText}>
            <MenuItem
              dkey={item?.id}
              disabled={item?.id === selected?.productionStatus}
              onClick={() => {
                onClickItemMenu(item?.id);
              }}
            >
              {item?.text}
            </MenuItem>
          </Tooltip>
        ))}
      </Menu>
    </div>
  );
}
