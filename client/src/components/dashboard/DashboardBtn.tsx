import { Box, Button, useTheme } from '@mui/material';

const DashboardBtn = ({text}: {text: string}) => {
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
		}}>
			<Button sx={{
				backgroundColor: theme.palette.background.paper,
				color: theme.palette.text.primary,
				border: `1px solid ${theme.palette.divider}`,
				borderRadius: '70px',
				padding: '10px 24px',
				'&:hover': {
					backgroundColor: theme.palette.primary.main,
					color: theme.palette.primary.contrastText,
				},
				transition: theme.transitions.create(['background-color', 'color'], {
					duration: theme.transitions.duration.short,
				}),
			}}>
				{text}
			</Button>
		</Box>
	);
};

export default DashboardBtn;