import { Box, Button, Typography, Menu, MenuItem, useTheme } from '@mui/material';
import TicketsItem from '../components/tickets/TicketsItem.tsx';
import DashboardBtn from '../components/dashboard/DashboardBtn.tsx';
import React, { useContext, useState } from 'react';
import { UserContext } from '../utils/UserContext.tsx';

const Tickets = () => {
	const { tickets, setTickets } = useContext(UserContext);
	const isHaveTickets = tickets?.length > 0;
	const theme = useTheme();
	const [moreTickets, setMoreTickets] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const openTickets = () => {
		setMoreTickets(prev => !prev);
	};

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

	return (
		<Box sx={{
			padding: '24px',
			width: '100%',
		}}>
			{
				isHaveTickets &&
				<Box sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
					<Typography sx={{
						fontSize: '16px',
						paddingBlock: '12px 36px',
					}}>
						Количество всех заявок: <span style={{ fontWeight: 'bold' }}>{tickets?.length}</span>
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
			}
			{
				isHaveTickets ?
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: {
							sm: '1fr',
							md: '1fr 1fr',
							lg: '1fr 1fr 1fr',
						},
						gap: '16px',
					}}
				>

					{moreTickets
					 ? tickets.map((item) => (
							<TicketsItem key={item.ticket_id} {...item} />
						))
					 : tickets.slice(0, 6).map((item) => (
							<TicketsItem key={item.ticket_id} {...item} />
						))
					}
				</Box>
				              : <Box>
					<Typography variant="body2">
						У вас нет заявок!
					</Typography>
				</Box>
			}
			{
				tickets.length > 6 && <Box onClick={openTickets} sx={{
					marginTop: '24px',
				}}>
					<DashboardBtn text={`${moreTickets ? 'Отменить' : 'Загрузить еще'}`}/>
				</Box>
			}
		</Box>
	);
};

export default Tickets;