import SideIcon from './SideIcon.tsx';
import { Box } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext.tsx';
import dashboardIcon from '../../../public/icon/dashboard.svg';
import ticketsIcon from '../../../public/icon/tickets.svg';
import assigneesIcon from '../../../public/icon/assignees.svg';
import profileIcon from '../../../public/icon/profile.svg';
import modeIcon from '../../../public/icon/mode.svg';
import assigneeTickets from '../../../public/icon/task.svg';

const SideIcons = () => {
	const { user } = useContext(UserContext);

	const getIconsForRole = () => {
		switch (user.role) {
			case 'admin':
				return [
					{
						src: dashboardIcon,
						name: 'Dashboard',
						path: '/dashboard',
						tooltip: 'Dashboard',
					},
					{
						src: ticketsIcon,
						name: 'Tickets',
						path: '/tickets',
						tooltip: 'Заявки',
					},
					{
						src: assigneesIcon,
						name: 'Assignees',
						path: '/assignees',
						tooltip: 'Сотрудники',
					},
					{
						src: profileIcon,
						name: 'Profile',
						path: '/profile',
						tooltip: 'Профиль',
					},
					{
						src: modeIcon,
						name: 'User Mode',
						path: '/login',
						variant: 'outlined',
						tooltip: 'Изменить мод',
					},
				];
			case 'assignee':
				return [
					{
						src: assigneeTickets,
						name: 'My Tasks',
						path: '/tickets/assignee',
						tooltip: 'Мои задачи',
					},
					{
						src: ticketsIcon,
						name: 'All Tickets',
						path: '/tickets',
						tooltip: 'Все заявки',
					},
					{
						src: profileIcon,
						name: 'Profile',
						path: `/assignees/${user.id}`,
						tooltip: 'Профиль',
					},
					{
						src: modeIcon,
						name: 'Admin Mode',
						path: '/login',
						tooltip: 'Изменить режим',
					},
				];
			case 'user':
			default:
				return [
					{
						src: ticketsIcon,
						name: 'My Tickets',
						path: '/tickets',
						tooltip: 'Мои заявки',
					},
					{
						src: profileIcon,
						name: 'Profile',
						path: '/profile',
						tooltip: 'Профиль',
					},
					{
						src: modeIcon,
						name: 'Admin Mode',
						path: '/login',
						tooltip: 'Изменить режим',
					},
				];
		}
	};

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			gap: '16px',
			marginTop: '16px',
		}}>
			{getIconsForRole().map((item) => (
				<SideIcon
					key={`${item.path}-${item.name}`}
					src={item.src}
					path={item.path}
					name={item.name}
					variant={item?.variant}
					tooltip={item?.tooltip}
				/>
			))}
		</Box>
	);
};

export default SideIcons;