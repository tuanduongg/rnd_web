// assets
import { IconDashboard, IconHome } from '@tabler/icons-react';
import { ConfigRouter } from 'routes/ConfigRouter';

// constant
const icons = { IconDashboard, IconHome };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const home = {
    id: 'home',
    title: 'Home page',
    type: 'group',
    children: [
        {
            id: ConfigRouter.homePage,
            title: 'Home',
            type: 'item',
            url: ConfigRouter.homePage,
            icon: icons.IconHome,
            breadcrumbs: false
        }
    ]
};

export default home;
