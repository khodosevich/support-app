import { Box, Link, Typography, Tooltip, useTheme } from '@mui/material';
import { useContext } from 'react';
import { SidebarContext } from '../../utils/SidebarContext.tsx';
import { SidebarIconType } from '../../types/type.ts';
import { NavLink } from 'react-router';

const SideIcon = ({ src, path, name, tooltip = '' }: SidebarIconType) => {
	const { sidebar } = useContext(SidebarContext);
	const theme = useTheme();
	const isActive = location.pathname === path;

	const iconContent = (
		<Box sx={{
			display: 'flex',
			alignItems: 'center',
			gap: '16px',
		}}>
			<Link
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '44px',
					backgroundColor: isActive ? '#3aa984' : theme.palette.primary.main,
					border: isActive ? '1px solid white' : '1px solid transparent',
					padding: '10px',
					borderRadius: '12px',
					transition: 'all 0.3s ease',
					cursor: 'pointer',
					'&:hover': {
						backgroundColor: '#3aa984',
						transform: 'scale(1.05)',
					},
					pointerEvents: 'auto',
				}}
				to={path}
				component={NavLink}
			>
				<img
					src={src}
					alt={`${name} icon`}
					width={24}
					height={24}
				/>
			</Link>
			{sidebar && (
				<Typography component="span">
					<Link
						sx={{
							color: 'white',
							fontWeight: 'bold',
							fontSize: '18px',
							textDecoration: 'none',
							transition: 'color 0.3s ease',
							'&:hover': {
								color: '#acd3c8',
							},
						}}
						to={path}
						component={NavLink}
					>
						{name}
					</Link>
				</Typography>
			)}
		</Box>
	);

	return tooltip ? (
		<Tooltip title={tooltip} placement="right" arrow>
			<span>{iconContent}</span>
		</Tooltip>
	) : (iconContent);
};

export default SideIcon;