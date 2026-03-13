import {createBrowserRouter} from 'react-router';
import Home from './features/interview/pages/Home';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Protected from './features/auth/components/Protected';
import Interview from './features/interview/pages/Interview';
const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/home',
        element: <Protected><Home/></Protected>
    } ,{
        path: '/interview/:interviewId',
        element: <Protected><Interview/></Protected>
    }
]);

export default router;