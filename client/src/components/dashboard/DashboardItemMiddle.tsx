import { Box, Link, Typography, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import React from 'react';
import { DashboardItemMiddleType } from '../../types/type.ts';

const DashboardItemMiddle: React.FC<DashboardItemMiddleType> = ({subtitle, path}) => {
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			justifyContent: 'space-between',
			mb: 2,
		}}>
			<Typography sx={{
				fontSize: '18px',
				fontWeight: 'bold',
				color: theme.palette.text.primary,
			}}>
				{subtitle}
			</Typography>
			<Typography>
				<Link to={path} component={RouterLink}
				      sx={{
					      color: theme.palette.primary.main,
					      textDecoration: 'none',
					      '&:hover': {
						      textDecoration: 'underline',
					      }
				      }}>
					View All
				</Link>
			</Typography>
		</Box>
	);
};

export default DashboardItemMiddle;