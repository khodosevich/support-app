import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DashboardItemTicketType } from '../../types/type.ts';
import BtnOpenTicket from '../BtnOpenTicket.tsx';

const DashboardItemTicket: React.FC<DashboardItemTicketType> = ({ title, date, id }) => {
	const theme = useTheme();

	return (
		<Box sx={{
			width: '100%',
			paddingLeft: '10px',
		}}>
			<Box sx={{
				display: 'flex',
				justifyContent: 'space-between',
				width: '100%',
			}}>
				<Typography sx={{ color: theme.palette.text.primary }}>
					{title}
				</Typography>
				<BtnOpenTicket id={id}/>
			</Box>
			<Box sx={{
				display: 'flex',
				justifyContent: 'space-between',
			}}>
				<Typography sx={{ color: theme.palette.text.secondary }}>
					{title}
				</Typography>

				<Typography sx={{ color: theme.palette.text.secondary }}>
					{date}
				</Typography>
			</Box>
		</Box>
	);
};

export default DashboardItemTicket;