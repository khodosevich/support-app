import { Box, Typography, Drawer, useTheme } from '@mui/material';
import { useContext } from 'react';
import { SidebarContext } from '../../utils/SidebarContext.tsx';
import arrowIcon from '../../../public/icon/arrow-left.svg';
import SideIcons from './SideIcons.tsx';

const Sidebar = () => {
	const { sidebar, setSidebar } = useContext(SidebarContext);
	const theme = useTheme();

	const sidebarHandler = () => {
		setSidebar((prev) => !prev);
	};

	return (
		<Drawer
			anchor="left"
			open={sidebar}
			onClose={sidebarHandler}
			transitionDuration={300}
		>
			<Box
				sx={{
					width: 320,
					padding: '24px',
					backgroundColor: theme.palette.mode === 'light' ? '#317873' : '#1E1E1E',
					height: '100%',
				}}
			>
				<Box sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
					<Typography sx={{
						fontSize: '18px',
						fontWeight: 'bold',
						color: 'white',
					}}>
						Menu
					</Typography>
					<Box sx={{
						cursor: 'pointer',
					}} onClick={sidebarHandler}>
						<img
							src={arrowIcon}
							alt="arrow"
							height={'24px'}
							width={'24px'}
							style={{
								filter: 'invert(1)'
							}}
						/>
					</Box>
				</Box>
				<SideIcons/>
			</Box>
		</Drawer>
	);
};

export default Sidebar;