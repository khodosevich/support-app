import { useThemeContext } from '../utils/ThemeContext';
import { IconButton, Tooltip, Box, styled } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { keyframes } from '@emotion/react';

// Анимация переключения
const fadeIn = keyframes`
  from { opacity: 0; transform: rotate(-90deg); }
  to { opacity: 1; transform: rotate(0deg); }
`;

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
	position: 'relative',
	width: 40,
	height: 40,
	transition: theme.transitions.create(['transform'], {
		duration: theme.transitions.duration.shortest,
	}),
	'&:hover': {
		transform: 'scale(1.1)',
		backgroundColor: theme.palette.action.hover,
	},
}));

const IconWrapper = styled(Box)(({ theme }) => ({
	position: 'absolute',
	animation: `${fadeIn} ${theme.transitions.duration.shortest}ms ${theme.transitions.easing.easeInOut}`,
}));

const ThemeSwitch = () => {
	const { mode, toggleTheme } = useThemeContext();

	return (
		<Tooltip title={mode === 'light' ? 'Тёмная тема' : 'Светлая тема'}>
			<AnimatedIconButton
				onClick={toggleTheme}
				color="inherit"
				aria-label="Переключить тему"
				sx={{
					p: 1.5,
					borderRadius: '50%',
					color: 'text.primary',
				}}
			>
				<IconWrapper key={mode}>
					{mode === 'light' ? (
						<DarkModeIcon fontSize="medium" />
					) : (
						 <LightModeIcon fontSize="medium" />
					 )}
				</IconWrapper>
			</AnimatedIconButton>
		</Tooltip>
	);
};

export default ThemeSwitch;