import { Box, useTheme } from '@mui/material';
import React from 'react';
import { IconType } from '../types/type.ts';

const Icon: React.FC<IconType> = ({ src, size }) => {
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '44px',
			height: '44px',
			backgroundColor: theme.palette.mode === 'light' ? '#ebf9f5' : '#2D3748',
			borderRadius: '12px',
		}}>
			<img
				src={src}
				alt=""
				width={size}
				height={size}
				style={{
					filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
				}}
			/>
		</Box>
	);
};

export default Icon;