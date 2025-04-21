import { CssBaseline } from '@mui/material';
import { Routes } from './routes.tsx';
import { AlertContext } from './utils/AlertContext.tsx';
import { UserContext } from './utils/UserContext.tsx';
import { useEffect, useState } from 'react';
import { AlertDate, AssigneesItemType, TicketsItemType, UserDate } from './types/type.ts';
import CustomAlert from './ui/CustomAlert.tsx';
import Header from './components/Header.tsx';
import { useLocation } from 'react-router';
import SideNavigation from './components/navigation/SideNavigation.tsx';
import { SidebarContext } from './utils/SidebarContext.tsx';
import Sidebar from './components/navigation/Sidebar.tsx';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { AssigneesContext } from './utils/AssigneesContext.tsx';
import { methods } from './api/methods.ts';
import { ThemeProvider as CustomThemeProvider } from './utils/ThemeContext.tsx';
import { ThemeProvider } from '@mui/material/styles';
import { useThemeContext } from './utils/ThemeContext.tsx';

interface CustomJwtPayload extends JwtPayload {
	role: string;
	id: number;
}

function AppWrapper() {
	return (
		<CustomThemeProvider>
			<App />
		</CustomThemeProvider>
	);
}

function App() {
	const [alert, setAlert] = useState<AlertDate>({
		isShowAlert: false,
		type: 'info',
		message: '',
	});

	const token = localStorage.getItem('accessToken');
	const [user, setUser] = useState<UserDate>({
		isAuth: !!token,
		role: 'user',
		id: 0
	});

	const { currentTheme } = useThemeContext();

	useEffect(() => {
		if (token) {
			try {
				const decoded = jwtDecode<CustomJwtPayload>(token);
				setUser(prevUser => ({
					...prevUser,
					role: decoded.role || 'user',
					id: decoded.id
				}));
			}
			catch (error) {
				setAlert({ type: 'error', isShowAlert: true, message: 'Ошибка декодирования токена!' });
				console.error('Ошибка декодирования токена:', error);
			}
		}
	}, [token]);

	useEffect(() => {
		const load = async () => {
			try {
				if (user.role === 'admin' || user.role === 'assignee') {
					const responseAssignees = await methods.assignees.getAssignees();
					if (responseAssignees.status === 200) {
						setAssignees(responseAssignees.data);
					}
				}

				const responseTickets = await methods.tickets.getTickets();
				if (responseTickets.status === 200) {
					setTickets(responseTickets.data);
				}
			}
			catch {
				setAlert({ type: 'error', isShowAlert: true, message: 'Что-то пошло не так!' });
			}
		};

		if (token) {
			load();
		}
	}, [user.role, token]);

	const [tickets, setTickets] = useState<TicketsItemType[]>([]);
	const [sidebar, setSidebar] = useState<boolean>(false);
	const [assignees, setAssignees] = useState<AssigneesItemType[]>([]);

	const location = useLocation();
	const excludedRoutes = ['/login', '/register', '/404'];
	const isShowHeader = !excludedRoutes.includes(location.pathname);

	return (
		<ThemeProvider theme={currentTheme}>
			<AlertContext.Provider value={{ alert, setAlert }}>
				<UserContext.Provider value={{ user, setUser, tickets, setTickets }}>
					<AssigneesContext.Provider value={{ assignees, setAssignees }}>
						<SidebarContext.Provider value={{ sidebar, setSidebar }}>
							<div className="page" style={{ backgroundColor: currentTheme.palette.background.default }}>
								<CssBaseline enableColorScheme />
								{isShowHeader && <Header />}
								<main style={{
									display: 'flex',
									flexGrow: 1,
								}}>
									{isShowHeader && <SideNavigation />}
									<Routes />
								</main>
								<CustomAlert />
								<Sidebar />
							</div>
						</SidebarContext.Provider>
					</AssigneesContext.Provider>
				</UserContext.Provider>
			</AlertContext.Provider>
		</ThemeProvider>
	);
}

export default AppWrapper;