import { Navigate, useRoutes } from 'react-router';
import AuthPage from './pages/AuthPage.tsx';
import { JSX, useContext } from 'react';
import Dashboard from './pages/Dashboard.tsx';
import { UserContext } from './utils/UserContext.tsx';
import Tickets from './pages/Tickets.tsx';
import Assignees from './pages/Assignees.tsx';
import NotFound from './pages/NotFound.tsx';
import Ticket from './pages/Ticket.tsx';
import Profile from './pages/Profile.tsx';
import Users from './pages/Users.tsx';
import ProfileById from './pages/ProfileById.tsx';
import AssigneeProfile from './pages/AssigneeProfile.tsx';
import AssigneeTickets from './pages/AssigneeTickets.tsx';
import CategoriesList from './components/category/CategoriesList.tsx';

export const ProtectedRoute = ({ isAuth, children }: { isAuth: boolean, children: JSX.Element }) => {
	if (!isAuth) {
		return <Navigate to="/login"/>;
	}

	return children;
};

export const AdminRoutes = ({ isAdmin, children }: { isAdmin: boolean, children: JSX.Element }) => {
	if (!isAdmin) {
		return <Navigate to="/tickets"/>;
	}

	return children;
};

export const AssigneesRoutes = ({ isAssignee, children }: { isAssignee: boolean, children: JSX.Element }) => {
	if (!isAssignee) {
		return <Navigate to="/tickets"/>;
	}

	return children;
};

export const Routes = () => {
	const { user } = useContext(UserContext);
	const isAdmin = user.role === 'admin';
	const isAssignee = user.role === 'assignee';

	return useRoutes([
		{ path: '*', element: <ProtectedRoute isAuth={user.isAuth}><Navigate to="/login"/></ProtectedRoute> },
		{ path: '/register', element: <AuthPage type="register"/> },
		{ path: '/login', element: <AuthPage type="login"/> },
		{ path: '/dashboard', element: <AdminRoutes isAdmin={isAdmin}><Dashboard/></AdminRoutes> },
		{ path: '/tickets', element: <ProtectedRoute isAuth={user.isAuth}><Tickets/></ProtectedRoute> },
		{ path: '/tickets/:id', element: <ProtectedRoute isAuth={user.isAuth}><Ticket/></ProtectedRoute> },
		{ path: '/assignees', element: <AdminRoutes isAdmin={isAdmin}><Assignees/></AdminRoutes> },
		{ path: '/assignees/:employeeId', element: <AssigneesRoutes isAssignee={isAssignee}><AssigneeProfile/></AssigneesRoutes> },
		{ path: '/tickets/assignee', element: <AssigneesRoutes isAssignee={isAssignee}><AssigneeTickets/></AssigneesRoutes> },
		{ path: '/profile', element: <ProtectedRoute isAuth={user.isAuth}><Profile/></ProtectedRoute> },
		{ path: '/profile/:id', element: <AdminRoutes isAdmin={isAdmin || isAssignee}><ProfileById/></AdminRoutes> },
		{ path: '/users', element: <AdminRoutes isAdmin={isAdmin}><Users/></AdminRoutes> },
		{ path: '/categories', element: <AdminRoutes isAdmin={isAdmin}><CategoriesList/></AdminRoutes> },
		{ path: '/404', element: <NotFound/> },
	]);
};