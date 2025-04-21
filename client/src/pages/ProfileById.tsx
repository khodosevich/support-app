import { useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { methods } from '../api/methods.ts';
import { AlertContextType, UserType } from '../types/type.ts';
import { AlertContext } from '../utils/AlertContext.tsx';
import { Box, InputAdornment, TextField, useTheme, Typography } from '@mui/material';
import { AccountCircle, EmailRounded, AccessTime, PermIdentity, AdminPanelSettings } from '@mui/icons-material';
import TicketsItem from '../components/tickets/TicketsItem.tsx';
import { UserContext } from '../utils/UserContext.tsx';

const ProfileById = () => {
	const theme = useTheme();
	const { id } = useParams();
	const { setAlert }: AlertContextType = useContext(AlertContext);
	const [user, setUser] = useState<UserType>({
		id: 0,
		username: '',
		email: '',
		created_at: '',
		role: '',
	});

	const { tickets } = useContext(UserContext);

	const userTickets = tickets.filter(ticket => ticket.created_by === Number(id));

	useEffect(() => {
		const fetchUserById = async () => {
			try {
				const response = await methods.users.getUserById(Number(id));
				setUser(response.data);
			}
			catch {
				setAlert({ type: 'error', isShowAlert: true, message: 'Ошибка декодирования токена!' });
			}
		};

		fetchUserById();
	}, [id, setAlert]);

	return (
		<Box sx={{
			p: { xs: 2, md: 4 },
			display: 'flex',
			flexDirection: { xs: 'column', md: 'row' },
			gap: '20px',
			backgroundColor: theme.palette.background.default,
			minHeight: 'calc(100vh - 64px)',
		}}>
			<Box sx={{
				backgroundColor: theme.palette.background.paper,
				borderRadius: '12px',
				border: `1px solid ${theme.palette.divider}`,
				p: 3,
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
				width: '520px',
				maxWidth: { md: '400px' },
				height: 'fit-content',
			}}>
				<TextField
					label="ID пользователя"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<PermIdentity color="primary" />
							</InputAdornment>
						),
					}}
					variant="standard"
					value={user?.id}
					disabled
					fullWidth
				/>

				<TextField
					label="Имя пользователя"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<AccountCircle color="primary" />
							</InputAdornment>
						),
					}}
					variant="standard"
					value={user?.username}
					disabled
					fullWidth
				/>

				<TextField
					label="Почта пользователя"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<EmailRounded color="primary" />
							</InputAdornment>
						),
					}}
					variant="standard"
					value={user?.email}
					disabled
					fullWidth
				/>

				<TextField
					label="Время регистрации"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<AccessTime color="primary" />
							</InputAdornment>
						),
					}}
					variant="standard"
					value={new Date(user?.created_at).toLocaleDateString()}
					disabled
					fullWidth
				/>

				<TextField
					label="Роль пользователя"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<AdminPanelSettings color="primary" />
							</InputAdornment>
						),
					}}
					variant="standard"
					value={user?.role}
					disabled
					fullWidth
				/>
			</Box>

			<Box sx={{
				backgroundColor: theme.palette.background.paper,
				borderRadius: '12px',
				border: `1px solid ${theme.palette.divider}`,
				p: 3,
				flexGrow: 1,
				maxHeight: '80vh',
				overflowY: 'auto',
			}}>
				<Typography variant="h6" sx={{ mb: 2, color: theme.palette.text.primary }}>
					Заявки пользователя ({userTickets.length})
				</Typography>

				<Box sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
					gap: '16px',
				}}>
					{userTickets.map((item) => (
						<TicketsItem key={item.ticket_id} {...item} />
					))}
				</Box>

				{userTickets.length === 0 && (
					<Typography sx={{
						textAlign: 'center',
						mt: 4,
						color: theme.palette.text.secondary,
					}}>
						Пользователь не создавал заявок
					</Typography>
				)}
			</Box>
		</Box>
	);
};

export default ProfileById;