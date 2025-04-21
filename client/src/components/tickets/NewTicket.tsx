import React, { useContext, useState } from 'react';
import { Box, Dialog, Typography, useTheme } from '@mui/material';
import { StyledInput } from '../../ui/StyledInput.tsx';
import { StyledBtn } from '../../ui/StyledBtn.tsx';
import { AlertContextType, NewTicketType, OpenModal } from '../../types/type.ts';
import { AlertContext } from '../../utils/AlertContext.tsx';
import { methods } from '../../api/methods.ts';
import { UserContext } from '../../utils/UserContext.tsx';

const NewTicket: React.FC<OpenModal> = ({ open, setOpen }) => {
	const theme = useTheme();
	const [newTicket, setNewTicket] = useState<NewTicketType>({
		title: '',
		description: '',
	});

	const { setAlert }: AlertContextType = useContext(AlertContext);
	const { setTickets } = useContext(UserContext);

	const handleClose = () => {
		setOpen(false);
		setNewTicket({ title: '', description: '' });
	};

	const createNewTicket = async () => {
		if (!newTicket.title || !newTicket.description) {
			setAlert({ type: 'error', isShowAlert: true, message: 'Все поля обязательны!' });
			return;
		}

		try {
			const response = await methods.tickets.createTicket(newTicket);

			if (response.status === 201) {
				handleClose();
				setAlert({ type: 'success', isShowAlert: true, message: 'Задача создана!' });
				setTickets(prev => [...prev, response.data]);
			}
		}
		catch (e) {
			console.error(e);
			setAlert({ type: 'error', isShowAlert: true, message: 'Сервер не отвечает, попробуйте еще раз!' });
		}
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			fullWidth
			maxWidth="sm"
			PaperProps={{
				sx: {
					borderRadius: '12px',
					background: theme.palette.background.paper,
				},
			}}
		>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing(3),
				p: theme.spacing(4),
			}}>
				<Typography variant="h6" sx={{
					fontWeight: 600,
					color: theme.palette.text.primary,
				}}>
					Создать новую заявку
				</Typography>

				<Box>
					<Typography
						variant="subtitle1"
						sx={{
							mb: 1,
							color: theme.palette.text.primary,
						}}
					>
						Проблема
					</Typography>
					<StyledInput
						value={newTicket.title}
						onChange={(e) => setNewTicket(prev => ({ ...prev, title: e.target.value }))}
						placeholder="Введите название проблемы"
						type="text"
					/>
				</Box>

				<Box>
					<Typography
						variant="subtitle1"
						sx={{
							mb: 1,
							color: theme.palette.text.primary,
						}}
					>
						Описание
					</Typography>
					<StyledInput
						value={newTicket.description}
						onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
						placeholder="Введите описание проблемы"
						type="text"
					/>
				</Box>
				<StyledBtn
					onClick={createNewTicket}
					sx={{
						backgroundColor: theme.palette.primary.main,
						color: theme.palette.primary.contrastText,
						'&:hover': {
							backgroundColor: theme.palette.primary.dark,
						},
					}}
				>
					Создать заявку
				</StyledBtn>
			</Box>
		</Dialog>
	);
};

export default NewTicket;