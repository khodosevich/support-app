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
						name: 'Главная страница',
						path: '/dashboard',
						tooltip: 'Главная страница',
					},
					{
						src: ticketsIcon,
						name: 'Заявки',
						path: '/tickets',
						tooltip: 'Заявки',
					},
					{
						src: assigneesIcon,
						name: 'Сотрудники',
						path: '/assignees',
						tooltip: 'Сотрудники',
					},
					{
						src: profileIcon,
						name: 'Профиль',
						path: '/profile',
						tooltip: 'Профиль',
					},
					{
						src: modeIcon,
						name: 'Выйти',
						path: '/login',
						variant: 'outlined',
						tooltip: 'Выйти',
					},
				];
			case 'assignee':
				return [
					{
						src: assigneeTickets,
						name: 'Мои задачи',
						path: '/tickets/assignee',
						tooltip: 'Мои задачи',
					},
					{
						src: ticketsIcon,
						name: 'Все заявки',
						path: '/tickets',
						tooltip: 'Все заявки',
					},
					{
						src: profileIcon,
						name: 'Профиль',
						path: `/assignees/${user.id}`,
						tooltip: 'Профиль',
					},
					{
						src: modeIcon,
						name: 'Выйти',
						path: '/login',
						tooltip: 'Выйти',
					},
				];
			case 'user':
			default:
				return [
					{
						src: ticketsIcon,
						name: 'Мои заявки',
						path: '/tickets',
						tooltip: 'Мои заявки',
					},
					{
						src: profileIcon,
						name: 'Профиль',
						path: '/profile',
						tooltip: 'Профиль',
					},
					{
						src: modeIcon,
						name: 'Выйти',
						path: '/login',
						tooltip: 'Выйти',
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