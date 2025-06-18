import { Box, Typography, useTheme } from '@mui/material';
import DashboardBtn from './DashboardBtn.tsx';
import { TicketsItemType } from '../../types/type.ts';
import { useEffect, useState } from 'react';
import TextInfo from '../TextInfo.tsx';
import { methods } from '../../api/methods.ts';
import { NavLink } from 'react-router';

const DashboardRecentTicket = () => {
	const [oldestTicket, setOldestTicket] = useState<TicketsItemType>({
		ticket_id: 0,
		title: '',
		description: '',
		status: '',
		priority: '',
		category_id: 0,
		assigned_to: { id: 0, username: '' },
		created_by: { id: 0, username: '' },
		created_at: '',
		resolved_at: '',
		estimated_time: '',
		actual_time: '',
		ai_confidence: 0,
		attachments: null,
		username: '',
	});
	const theme = useTheme();

	useEffect(() => {
		const loadTicket = async () => {
			try {
				const response = await methods.tickets.getOldestTicket();
				setOldestTicket(response.data);
			}
			catch {
				console.log('error oldest');
			}
		};

		loadTicket();
	}, []);

	const [currentCategories, setCurrentCategories] = useState<string>('');

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await methods.categories.getCategories();
				setCurrentCategories(response.data.find((i: { category_id: number | null; }) => i.category_id === oldestTicket.category_id).name);
			} catch {
				console.log('Error fetching categories.');
			}
		}
		fetch();
	}, [oldestTicket.ticket_id]);

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			height: '100%',
			backgroundColor: theme.palette.background.paper,
			padding: '24px',
			borderRadius: '12px',
			border: `1px solid ${theme.palette.divider}`,
			boxShadow: theme.shadows[1],
		}}>
			<Box sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}>
				<Typography sx={{
					fontSize: '18px',
					fontWeight: 'bold',
					color: theme.palette.text.primary,
				}}>
					Самая старая заявка
				</Typography>
				<NavLink to={`/tickets/${oldestTicket?.ticket_id}`}>
					<DashboardBtn text={'Перейти на заявку'}/>
				</NavLink>
			</Box>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
				marginTop: '24px',
			}}>
				<TextInfo title={'Имя пользователя'} value={oldestTicket?.username}/>
				<TextInfo title={'Создано'} value={new Date(oldestTicket.created_at).toLocaleDateString()}/>
				<TextInfo title={'Категория'} value={currentCategories ?? 'Пока на доработке'}/>
				<TextInfo title={'Описание'} value={oldestTicket.description} valueBold={false}/>
			</Box>
		</Box>
	);
};

export default DashboardRecentTicket;