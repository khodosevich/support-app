import { Button, useTheme } from '@mui/material';
import { NavLink } from 'react-router';

const BtnOpenTicket = ({id}: {id: number}) => {
	const theme = useTheme();

	return (
		<Button sx={{
			backgroundColor: theme.palette.mode === 'light' ? '#ebf9f5' : '#2D3748',
			color: theme.palette.primary.main,
			borderRadius: '24px',
			padding: '4px 16px',
			'&:hover': {
				backgroundColor: theme.palette.mode === 'light' ? '#d8f3eb' : '#3a4659',
			}
		}}>
			<NavLink
				to={`/tickets/${id}`}
				style={{
					color: 'inherit',
					textDecoration: 'none',
				}}
			>
				Открыть
			</NavLink>
		</Button>
	);
};

export default BtnOpenTicket;