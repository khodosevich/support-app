import { Box, Typography, useTheme } from '@mui/material';
import { DashboardItemHeaderType } from '../../types/type.ts';
import React from 'react';

const DashboardItemHeader: React.FC<DashboardItemHeaderType> = ({title, total, icon}) => {
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			gap: '16px',
			alignItems: 'center',
			borderBottom: `1px solid ${theme.palette.divider}`,
			padding: '24px',
		}}>
			<Box sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: theme.palette.mode === 'light' ? '#EBF9F5' : '#2D3748',
				width: '64px',
				height: '64px',
				borderRadius: '50%',
			}}>
				<img
					src={icon}
					alt="icon"
					width={'32px'}
					height={'32px'}
					style={{
						filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
					}}
				/>
			</Box>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
			}}>
				<Typography sx={{
					color: theme.palette.text.secondary,
					fontSize: '18px',
				}} variant="h5">
					{title}
				</Typography>
				<Typography sx={{
					fontSize: '40px',
					fontWeight: 'bold',
					color: theme.palette.text.primary,
				}}>
					{total}
				</Typography>
			</Box>
		</Box>
	);
};

export default DashboardItemHeader;