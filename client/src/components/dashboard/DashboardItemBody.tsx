import { Box, useTheme } from '@mui/material';
import DashboardItemTicket from './DashboardItemTicket.tsx';
import DashboardItemAssignees from './DashboardItemAssignees.tsx';
import { DashboardItemBodyType } from '../../types/type.ts';
import React, { useState } from 'react';
import Icon from '../Icon.tsx';
import DashboardBtn from './DashboardBtn.tsx';

const DashboardItemBody: React.FC<DashboardItemBodyType> = ({ items, type, src }) => {
	const isTickets = type === 'tickets';
	const [showMore, setShowMore] = useState(false);
	const theme = useTheme();

	const shouldShowLoadMore = items.length > 6;
	const visibleItems = showMore ? items : items.slice(0, 6);

	const toggleShowMore = () => {
		setShowMore(prev => !prev);
	};

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			gap: '8px',
		}}>
			{visibleItems.map((item) => {
				return (
					<Box sx={{
						display: 'flex',
						alignItems: 'center',
						paddingBlock: '10px',
						borderBottom: `1px solid ${theme.palette.divider}`,
						'&:last-child': {
							borderBottom: 'none',
						}
					}} key={isTickets ? item.ticket_id : item.employee_id}>
						<Box>
							<Icon src={src} size={24}/>
						</Box>
						{isTickets ? (
							<DashboardItemTicket title={item.title} date={item.date} id={item.ticket_id}/>
						) : (
							 <DashboardItemAssignees username={item.username} email={item.email} employeeid={item.employee_id}/>
						 )}
					</Box>
				)
			})}

			{shouldShowLoadMore && (
				<Box onClick={toggleShowMore} sx={{ mt: 1 }}>
					<DashboardBtn text={showMore ? 'Скрыть' : 'Загрузить еще'}/>
				</Box>
			)}
		</Box>
	);
};

export default DashboardItemBody;