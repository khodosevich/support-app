import { Grid } from '@mui/material';
import DashboardItem from '../components/dashboard/DashboardItem.tsx';
import ticketsIcon from '../../public/icon/tickets-green.svg';
import assigneesIcon from '../../public/icon/assignees-green.svg';
import DashboardRecentTicket from '../components/dashboard/DashboardRecentTicket.tsx';
import { useContext } from 'react';
import { AssigneesContext } from '../utils/AssigneesContext.tsx';
import { UserContext } from '../utils/UserContext.tsx';

const Dashboard = () => {
	const { tickets } = useContext(UserContext);
	const { assignees } = useContext(AssigneesContext);

	const dashboardItem = [
		{
			title: 'Количество заявок',
			subtitle: 'Список заявок',
			total: tickets.length,
			icon: ticketsIcon,
			items: tickets,
			id: 0,
			path: '/tickets',
			type: 'tickets',
		},
		{
			title: 'Количество сотрудников',
			subtitle: 'Список сотрудников',
			total: assignees.length,
			icon: assigneesIcon,
			items: assignees,
			id: 1,
			path: '/assignees',
			type: 'assignees',
		},
	];

	return (
		<Grid container spacing={2}
		      sx={{
			      marginLeft: '12px',
		      }}>
			{
				dashboardItem.map((item) => (
					<Grid item xs={12} sm={6} md={4}
					      key={item.id}
					      sx={{
						      margin: '24px 0',
					      }}>
						<DashboardItem {...item}/>
					</Grid>
				))
			}
			<Grid item xs={12} sm={6} md={4}>
				<DashboardRecentTicket/>
			</Grid>
		</Grid>
	);
};

export default Dashboard;