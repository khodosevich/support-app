import { Box, Typography, useTheme } from '@mui/material';
import ticketsIcon from '../../../public/icon/tickets-green.svg';
import BtnOpenTicket from '../BtnOpenTicket.tsx';
import React from 'react';
import { TicketsItemType } from '../../types/type.ts';
import Icon from '../Icon.tsx';
import TextInfo from '../TextInfo.tsx';
import { NavLink } from 'react-router';

const TicketsItem: React.FC<TicketsItemType> = ({ created_by, priority, created_at, ticket_id, title, username, }) => {
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			padding: '24px',
			backgroundColor: theme.palette.background.paper,
			borderRadius: '12px',
			border: `1px solid ${theme.palette.divider}`,
			maxHeight: '300px',
			minWidth: '360px',
			boxShadow: theme.shadows[1],
		}}>
			<Box sx={{ display: 'flex', justifyContent: 'end' }}>
				<BtnOpenTicket id={ticket_id}/>
			</Box>
			<Box sx={{ display: 'flex', alignItems: 'center', marginTop: '16px', gap: '16px' }}>
				<Box>
					<Icon src={ticketsIcon} size={20}/>
				</Box>
				<Typography sx={{ fontSize: '16px', fontWeight: 'bold', color: theme.palette.text.primary, }}>
					{title}
				</Typography>
			</Box>
			<Box sx={{
				display: 'flex',
				height: '1px',
				marginBlock: '16px',
				backgroundColor: theme.palette.divider,
			}}></Box>
			<Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '4px',
				}}>
					<Typography sx={{ fontSize: '16px', color: '#7e92a2' }}>Пользователь</Typography>
					<Typography
						component={NavLink}
						to={`/profile/${created_by}`}
						sx={{
							fontWeight: 'bold',
							color: theme.palette.text.primary,
						}}
					>
						{username}
					</Typography>
				</Box>
				<TextInfo title={'Создано'} value={new Date(created_at).toLocaleDateString()}/>
				<TextInfo title={'Приоритет'} value={priority}/>
				<TextInfo title={'Ticket ID'} value={ticket_id?.toString()}/>
			</Box>
		</Box>
	);
};

export default TicketsItem;