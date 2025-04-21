import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { TicketInfoType } from '../types/type.ts';

const TextInfo: React.FC<TicketInfoType> = ({ title, value, valueBold = true }) => {
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			gap: '4px'
		}}>
			<Typography sx={{
				fontSize: '16px',
				color: theme.palette.mode === 'light' ? '#7e92a2' : '#a0aec0',
			}}>
				{title}
			</Typography>
			<Typography sx={{
				fontSize: '16px',
				fontWeight: valueBold ? 'bold' : 'normal',
				color: theme.palette.text.primary,
			}}>
				{value}
			</Typography>
		</Box>
	);
};

export default TextInfo;