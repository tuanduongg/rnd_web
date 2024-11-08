// assets
import { IconDashboard, IconUser } from '@tabler/icons-react';
import { ConfigRouter } from 'routes/ConfigRouter';

// constant
const icons = { IconDashboard, IconUser };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const account = {
    id: 'acc',
    title: 'Account & Role',
    type: 'group',
    children: [
        {
            id: ConfigRouter.accPage.url,
            title: 'Account',
            type: 'item',
            url: ConfigRouter.accPage.url,
            icon: icons.IconUser,
            breadcrumbs: false
        }
    ]
};

export default account;
