import { Box, Button, Typography, Menu, MenuItem, CircularProgress, useTheme } from '@mui/material';
import TicketsItem from '../components/tickets/TicketsItem.tsx';
import DashboardBtn from '../components/dashboard/DashboardBtn.tsx';
import React, { useContext, useState, useEffect } from 'react';
import { AssigneesContext } from '../utils/AssigneesContext.tsx';
import { UserContext } from '../utils/UserContext.tsx';
import { methods } from '../api/methods.ts';
import { AlertContext } from '../utils/AlertContext.tsx';
import { TicketsItemType } from '../types/type.ts';

const AssigneeTickets = () => {
	const theme = useTheme();
	const { user } = useContext(UserContext);
	const { assignees } = useContext(AssigneesContext);
	const { setAlert } = useContext(AlertContext);
	const [tickets, setTickets] = useState<TicketsItemType[]>([]);
	const [loading, setLoading] = useState(true);
	const [moreTickets, setMoreTickets] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const currentAssignee = assignees.find(a => a.id === user.id);

	useEffect(() => {
		const fetchAssigneeTickets = async () => {
			if (!currentAssignee) return;

			try {
				setLoading(true);
				const response = await methods.tickets.getTicketsByAssignee(currentAssignee.id);
				setTickets(response.data);
			} catch {
				setAlert({ type: 'error', isShowAlert: true, message: 'У вас нет заявок!' });
			} finally {
				setLoading(false);
			}
		};

		if (currentAssignee) {
			fetchAssigneeTickets();
		}
	}, [currentAssignee, setAlert]);

	const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const sortTickets = (method: string) => {
		let sorted = [...tickets];
		switch (method) {
			case 'title':
				sorted.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case 'created_at':
				sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
				break;
			default:
				sorted = [...tickets];
		}
		setTickets(sorted);
		handleMenuClose();
	};

	if (loading) {
		return (
			<Box sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: 'calc(100vh - 64px)',
				backgroundColor: theme.palette.background.default,
			}}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{
			padding: { xs: '16px', md: '24px' },
			width: '100%',
			backgroundColor: theme.palette.background.default,
			minHeight: 'calc(100vh - 64px)',
		}}>
			<Box sx={{
				display: 'flex',
				flexDirection: { xs: 'column', sm: 'row' },
				alignItems: { xs: 'flex-start', sm: 'center' },
				justifyContent: 'space-between',
				mb: 2,
				gap: 2,
			}}>
				<Typography variant="h6" sx={{
					fontWeight: 'bold',
					color: theme.palette.text.primary,
				}}>
					Мои задачи ({tickets.length})
				</Typography>

				<Box>
					<Button
						sx={{
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
						}}
						aria-controls="sort-menu"
						aria-haspopup="true"
						onClick={handleMenuOpen}
					>
						Сортировка
					</Button>
					<Menu
						id="sort-menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
						MenuListProps={{ onMouseLeave: handleMenuClose }}
						sx={{ mt: 1 }}
					>
						<MenuItem onClick={() => sortTickets('title')}>По названию</MenuItem>
						<MenuItem onClick={() => sortTickets('created_at')}>По дате создания</MenuItem>
					</Menu>
				</Box>
			</Box>

			{tickets.length > 0 ? (
				<>
					<Box sx={{
						display: 'grid',
						gridTemplateColumns: {
							xs: '1fr',
							sm: '1fr 1fr',
							md: '1fr 1fr 1fr',
						},
						gap: '16px',
					}}>
						{moreTickets
						 ? tickets.map((item) => (
								<TicketsItem
									key={item.ticket_id}
									{...item}
								/>
							))
						 : tickets.slice(0, 6).map((item) => (
								<TicketsItem
									key={item.ticket_id}
									{...item}
								/>
							))
						}
					</Box>

					{tickets.length > 6 && (
						<Box
							onClick={() => setMoreTickets(prev => !prev)}
							sx={{
								marginTop: '24px',
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<DashboardBtn text={moreTickets ? 'Скрыть' : 'Показать все'} />
						</Box>
					)}
				</>
			) : (
				 <Box sx={{
					 display: 'flex',
					 justifyContent: 'center',
					 alignItems: 'center',
					 height: '200px',
					 backgroundColor: theme.palette.background.paper,
					 borderRadius: '12px',
					 border: `1px solid ${theme.palette.divider}`,
				 }}>
					 <Typography variant="h6" color="textSecondary">
						 Вам пока не назначены задачи
					 </Typography>
				 </Box>
			 )}
		</Box>
	);
};

export default AssigneeTickets;