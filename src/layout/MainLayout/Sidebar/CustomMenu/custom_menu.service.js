import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { IconDashboard, IconHome, IconChecklist, IconLicense, IconUser, IconBrandCodepen } from '@tabler/icons-react';
const icons = { IconDashboard, IconHome, IconChecklist, IconLicense, IconUser, IconBrandCodepen, HomeIcon, PersonIcon,ReceiptLongIcon };

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
export const menu = [
  {
    id: ConfigRouter.aprrovalPage,
    icon: icons.ReceiptLongIcon,
    title: 'Approval Status',
    items: []
  },
  {
    icon: icons.IconLicense,
    id: ConfigRouter.qc,
    title: '대책서(QPN)',
    items: [
      //   {
      //     title: 'Technical Analysis',
      //     items: [
      //     //   {
      //     //     title: 'The Dow Theory',
      //     //     to: '/thedowtheory'
      //     //   },
      //     //   {
      //     //     title: 'Charts & Chart Patterns',
      //     //     to: '/chart'
      //     //   },
      //     //   {
      //     //     title: 'Trend & Trend Lines',
      //     //     to: '/trendlines'
      //     //   },
      //     //   {
      //     //     title: 'Support & Resistance',
      //     //     to: '/sandr'
      //     //   }
      //     ]
      //   },
    ]
  },
  {
    icon: icons.IconBrandCodepen,
    id: ConfigRouter.managementMold,
    title: 'Mold',
    items: []
  },
  {
    id: ConfigRouter.accPage,
    icon: icons.PersonIcon,
    title: 'Account & Role'
  }
];
