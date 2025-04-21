import { createTheme } from '@mui/material/styles';

const baseTheme = {
	typography: {
		fontFamily: [
			'Montserrat',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
	},
};

export const lightTheme = createTheme({
	...baseTheme,
	palette: {
		mode: 'light',
		primary: {
			main: '#45c49c',
			contrastText: '#fff',
		},
		secondary: {
			main: '#2d3748',
		},
		background: {
			default: '#f8fafb',
			paper: '#fff',
		},
		text: {
			primary: '#061b2e',
			secondary: '#4a5568',
		},
		divider: '#e2e8f0',
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: '#fff',
					borderBottom: '1px solid #e2e8f0',
				},
			},
		},
	},
});

export const darkTheme = createTheme({
	...baseTheme,
	palette: {
		mode: 'dark',
		primary: {
			main: '#2b705b',
			contrastText: '#fff',
		},
		secondary: {
			main: '#2d3748',
		},
		background: {
			default: '#121212',
			paper: '#1e1e1e',
		},
		text: {
			primary: '#e2e8f0',
			secondary: '#a0aec0',
		},
		divider: '#2D3748',
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: '#1e1e1e',
					borderBottom: '1px solid #2D3748',
				},
			},
		},
	},
});