import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { ConfigRouter } from './ConfigRouter';
import MoldPage from 'views/mold_page/MoldPage';
import { Navigate } from 'react-router-dom';

// dashboard routing
const HomePage = Loadable(lazy(() => import('views/homepage/HomePage.jsx')));
const AccountPage = Loadable(lazy(() => import('views/account/AccountPage')));
const CounterTacticsPage = Loadable(lazy(() => import('views/counter_tactics/CounterTacticsPage')));
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
        // {
        //     path: ConfigRouter.listJig,
        //     element: <MoldPage />
        // },
        // {
        //     path: ConfigRouter.statistic_jig,
        //     element: <StatisticJig />
        // },
        {
            path: ConfigRouter.qc,
            element: <CounterTacticsPage />
        }
    ]
};

export default MainRoutes;
