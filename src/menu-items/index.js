import { ConfigRouter } from 'routes/ConfigRouter';
import account from './account';
import home from './home';
import { IconLicense } from '@tabler/icons-react';

// ==============================|| MENU ITEMS ||============================== //

export const menuItems = {
    items: [home, {
        id: 'qc',
        title: 'QC Page',
        type: 'group',
        children: [
            {
                id: ConfigRouter.qc,
                title: 'QC',
                type: 'item',
                url: ConfigRouter.qc,
                icon: IconLicense,
                breadcrumbs: false
            },

        ]
    }, account,]
};

export default menuItems;
