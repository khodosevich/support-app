import { Box, useTheme } from '@mui/material';
import React from 'react';
import { TicketsItemType } from '../../types/type.ts';
import AssigneeInfo from './AssigneeInfo.tsx';

const TicketAssigneeSide: React.FC<TicketsItemType> = ({ assigned_to, priority, status }) => {
	const theme = useTheme();

	return (
		<Box sx={{
			backgroundColor: theme.palette.background.paper,
			padding: '40px',
			height: '100%',
			boxShadow: theme.shadows[1],
		}}>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
			}}>
				<AssigneeInfo title={'Сотрудник'} value={assigned_to?.username ?? "Не указано"} />
				<AssigneeInfo title={'Приоритет'} value={priority} isPriority/>
				<AssigneeInfo title={'Статус'} value={status} isStatus/>
			</Box>
		</Box>
	);
};

export default TicketAssigneeSide;