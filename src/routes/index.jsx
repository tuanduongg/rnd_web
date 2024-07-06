import { createBrowserRouter } from 'react-router-dom';

// routes
import MainRoutes from './MainRoutes';
import LoginRoutes from './AuthenticationRoutes';
import NotFound from 'views/NotFound/NotFound';

// ==============================|| ROUTING RENDER ||============================== //
const router = createBrowserRouter([MainRoutes, LoginRoutes, {
    path: '*', // This path acts as a catch-all
    element: <NotFound />, // Render the NotFound component
}]);

export default router;
