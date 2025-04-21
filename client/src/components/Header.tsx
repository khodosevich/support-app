import { Box, Button, Typography, useTheme } from '@mui/material';
import { useLocation } from 'react-router';
import menuArrow from '../../public/icon/menu-arrow.svg';
import { useContext, useEffect, useState } from 'react';
import { SidebarContext } from '../utils/SidebarContext.tsx';
import { UserContext } from '../utils/UserContext.tsx';
import NewTicket from './tickets/NewTicket.tsx';
import { StyledBtn } from '../ui/StyledBtn.tsx';
import NewAssignees from './assignees/NewAssignees.tsx';
import ThemeSwitch from './ThemeSwitch.tsx';

const Header = () => {
	const location = useLocation().pathname.split('/')[1];
	const headerTitle = location.charAt(0).toUpperCase() + location.slice(1);
	const { user } = useContext(UserContext);
	const isAdmin = user.role === 'admin';
	const isAssigneesPage = headerTitle === 'Assignees';
	const { setSidebar } = useContext(SidebarContext);

	const theme = useTheme();

	const toggleSidebar = () => {
		setSidebar((prev) => !prev);
	};

	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
	}, [isAssigneesPage]);

	return (
		<header style={{
			height: '80px',
			backgroundColor: theme.palette.background.paper,
			borderBottom: `1px solid ${theme.palette.divider}`,
			boxShadow: theme.shadows[1],
			zIndex: theme.zIndex.appBar,
		}}>
			<Box sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				height: '100%',
			}}>
				<Box sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '24px',
				}}>
					<Button sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						backgroundColor: theme.palette.mode === 'light' ? '#ebf9f5' : '#2D3748',
						height: '80px',
						width: '80px',
						minWidth: '80px',
						'&:hover': {
							backgroundColor: theme.palette.mode === 'light' ? '#d8f3eb' : '#3a4659',
						}
					}} onClick={toggleSidebar}>
						<img
							src={menuArrow}
							alt="menu"
							height="24"
							width="24"
							style={{
								filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
							}}
						/>
					</Button>
					<Typography sx={{
						color: theme.palette.text.primary,
						fontSize: '20px',
						fontWeight: '900',
					}}>
						{headerTitle}
					</Typography>
				</Box>
				<Box sx={{
					display: 'flex',
					alignItems: 'center',
					gap: '16px',
					paddingRight: '24px',
				}}>
					<ThemeSwitch />
					{(isAdmin || user.role === 'user') && (
						<>
							<StyledBtn
								sx={{
									width: { xs: '200px', sm: '100%' },
								}}
								onClick={() => setOpen(true)}
							>
								{isAssigneesPage ? 'Создать работника' : 'Создать заявку'}
							</StyledBtn>
							{isAssigneesPage ? (
								<NewAssignees open={open} setOpen={setOpen} />
							) : (
								 <NewTicket open={open} setOpen={setOpen} />
							 )}
						</>
					)}
				</Box>
			</Box>
		</header>
	);
};

export default Header;