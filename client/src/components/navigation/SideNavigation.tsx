import { Box, useTheme } from '@mui/material';
import SideIcons from './SideIcons.tsx';

const SideNavigation = () => {
	const theme = useTheme();

	return (
		<Box sx={{
			width: '80px',
			paddingInline: '18px',
			backgroundColor: theme.palette.mode === 'light' ? '#317873' : '#1E1E1E',
			boxShadow: theme.shadows[1],
		}}>
			<SideIcons/>
		</Box>
	);
};

export default SideNavigation;