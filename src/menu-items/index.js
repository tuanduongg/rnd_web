import { ConfigRouter } from 'routes/ConfigRouter';
import account from './account';
import home from './home';
import { IconLicense, IconAugmentedReality } from '@tabler/icons-react';
import { IconGraph } from '@tabler/icons-react';

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
    // {
    //   id: 'qc',
    //   title: 'moding',
    //   type: 'group',
    //   children: [
    //     {
    //       id: ConfigRouter.listJig,
    //       title: 'List JIG',
    //       type: 'item',
    //       url: ConfigRouter.listJig,
    //       icon: IconAugmentedReality,
    //       breadcrumbs: false
    //     },
    //     {
    //       id: ConfigRouter.statistic_jig,
    //       title: 'Statistic JIG',
    //       type: 'item',
    //       url: ConfigRouter.statistic_jig,
    //       icon: IconGraph,
    //       breadcrumbs: false
    //     }
    //   ]
    // },
    account
  ]
};

export default menuItems;
