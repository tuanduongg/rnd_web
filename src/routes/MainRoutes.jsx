import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { ConfigRouter } from './ConfigRouter';
import { Navigate } from 'react-router-dom';

// dashboard routing
const HomePage = Loadable(lazy(() => import('views/homepage/HomePage.jsx')));
const AccountPage = Loadable(lazy(() => import('views/account/AccountPage')));
const CounterTacticsPage = Loadable(lazy(() => import('views/counter_tactics/CounterTacticsPage')));
const ManagementMold = Loadable(lazy(() => import('views/management_mold/ManagementMold')));
// const StatisticJig = Loadable(lazy(() => import('views/statistic_jig/StatistcJig')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '', // Handles the empty path
            element: <Navigate to={ConfigRouter.aprrovalPage} replace /> // Redirect to /app
        },
        {
            path: '/', // Handles the root path
            element: <Navigate to={ConfigRouter.aprrovalPage} replace /> // Redirect to /app
        },
        {
            path: ConfigRouter.aprrovalPage,
            element: <HomePage />
        },
        {
            path: ConfigRouter.accPage,
            element: <AccountPage />
        },
        {
            path: ConfigRouter.managementMold,
            element: <ManagementMold />
        },
        {
            path: ConfigRouter.qc,
            element: <CounterTacticsPage />
        }
    ]
};

export default MainRoutes;
