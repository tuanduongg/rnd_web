import HomeIcon from '@mui/icons-material/Home';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import FactCheckIcon from '@mui/icons-material/FactCheck';
const icons = { FactCheckIcon, HomeIcon, ManageAccountsIcon, ReceiptIcon, SpaceDashboardIcon };

import React from 'react';
import { ConfigRouter } from 'routes/ConfigRouter';

export function hasChildren(item) {
  const { items: children } = item;

  if (children === undefined) {
    return false;
  }

  if (children.constructor !== Array) {
    return false;
  }

  if (children.length === 0) {
    return false;
  }

  return true;
}

export const findParentIds = (menu, targetId) => {
  const result = [];

  const recursiveSearch = (items, currentPath) => {
    for (const item of items) {
      const newPath = [...currentPath, item.id];

      if (item.id === targetId) {
        result.push(...currentPath); // Chỉ thêm các ID cha
        return true; // Kết thúc tìm kiếm khi tìm thấy ID
      }

      if (item.items && item.items.length > 0) {
        if (recursiveSearch(item.items, newPath)) {
          return true; // Kết thúc tìm kiếm
        }
      }
    }
    return false; // Không tìm thấy ID trong nhánh này
  };

  recursiveSearch(menu, []);
  return result;
};


export const setTitleTab = (id) => {

  if (id) {
    const find = menu.find((item) => item?.id === id);
    if (find) {

      window.document.title = 'HANOI SEWONINTECH' + ' - ' + find?.title;
    }
  }
}

export const menu = [
  {
    id: ConfigRouter.aprrovalPage,
    icon: icons.FactCheckIcon,
    title: 'Approval Status',
    items: []
  },
  {
    icon: icons.ReceiptIcon,
    id: ConfigRouter.qc,
    title: '대책서(QPN)',
    items: [

    ]
  },
  {
    icon: icons.SpaceDashboardIcon,
    id: ConfigRouter.managementMold,
    title: 'Mold',
    items: [
      // {
      //   id: ConfigRouter.managementMold,
      //   title: 'List',
      //   items: [
      //   ]
      // },
      // {
      //   id: ConfigRouter.settingMold,
      //   title: 'Settings',
      //   items: [
      //   ]
      // },
    ]
  },
  {
    id: ConfigRouter.accPage,
    icon: icons.ManageAccountsIcon,
    title: 'Account & Role'
  }
];
