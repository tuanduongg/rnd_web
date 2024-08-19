import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { ConfigRouter } from './ConfigRouter';

// dashboard routing
const HomePage = Loadable(lazy(() => import('views/homepage/HomePage.jsx')));
const AccountPage = Loadable(lazy(() => import('views/account/AccountPage')));
const CounterTacticsPage = Loadable(lazy(() => import('views/counter_tactics/CounterTacticsPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: ConfigRouter.homePage,
            element: <HomePage />
        },
        {
            path: ConfigRouter.accPage,
            element: <AccountPage />
        },
        {
            path: ConfigRouter.qc,
            element: <CounterTacticsPage />
        }
    ]
};

export default MainRoutes;
