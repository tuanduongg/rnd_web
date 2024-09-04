import { ConfigRouter } from 'routes/ConfigRouter';
import account from './account';
import home from './home';
import { IconLicense,IconAugmentedReality } from '@tabler/icons-react';

// ==============================|| MENU ITEMS ||============================== //

export const menuItems = {
  items: [
    home,
    {
      id: 'qc',
      title: '대책서',
      type: 'group',
      children: [
        {
          id: ConfigRouter.qc,
          title: '대책서',
          type: 'item',
          url: ConfigRouter.qc,
          icon: IconLicense,
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'qc',
      title: 'moding',
      type: 'group',
      children: [
        {
          id: ConfigRouter.moding,
          title: 'Mold',
          type: 'item',
          url: ConfigRouter.moding,
          icon: IconAugmentedReality,
          breadcrumbs: false
        }
      ]
    },
    account
  ]
};

export default menuItems;
