// assets
import { IconDashboard, IconHome,IconChecklist ,IconLicense} from '@tabler/icons-react';
import { ConfigRouter } from 'routes/ConfigRouter';

// constant
const icons = { IconDashboard, IconHome ,IconChecklist,IconLicense};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const home = {
    id: 'home',
    title: 'Approval Status',
    type: 'group',
    children: [
        {
            id: ConfigRouter.aprrovalPage,
            title: 'Approval',
            type: 'item',
            url: ConfigRouter.aprrovalPage,
            icon: icons.IconChecklist,
            breadcrumbs: false
        },
        
    ]
};

export default home;
