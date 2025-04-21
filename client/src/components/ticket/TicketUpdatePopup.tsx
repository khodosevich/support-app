import { useEffect, useState, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, FormControl, InputLabel, useTheme, } from '@mui/material';
import { AlertContext } from '../../utils/AlertContext.tsx';
import { methods } from '../../api/methods.ts';

interface TicketUpdatePopupProps {
	open: boolean;
	onClose: () => void;
	ticket: any;
	onUpdate: () => void;
}

const TicketUpdatePopup = ({ open, onClose, ticket, onUpdate }: TicketUpdatePopupProps) => {
	const [field, setField] = useState<string>('status');
	const [value, setValue] = useState<any>('');
	const { setAlert } = useContext(AlertContext);
	const theme = useTheme();

	const handleSubmit = async () => {
		try {
			const response = await methods.tickets.updateTicket(ticket.ticket_id, { field, value });
			if (response.status === 200) {
				setAlert({ type: 'success', isShowAlert: true, message: 'Ticket updated successfully' });
				onUpdate();
				onClose();
			}
		}
		catch (error: any) {
			if (error.response && error.response.data && error.response.data.error) {
				setAlert({ type: 'error', isShowAlert: true, message: error.response.data.error });
			} else {
				setAlert({ type: 'error', isShowAlert: true, message: 'Error updating ticket' });
			}
			console.error('Error updating ticket:', error);
		}
	};

	const [assignees, setAssignees] = useState<any[]>([]);

	useEffect(() => {
		if (field === 'assigned_to') {
			const fetchAssignees = async () => {
				try {
					const response = await methods.assignees.getAssignees();
					if (response.status === 200) {
						setAssignees(response.data);
					}
				}
				catch (error) {
					console.error('Error fetching assignees:', error);
				}
			};
			fetchAssignees();
		}
	}, [field]);

	const renderFieldInput = () => {
		switch (field) {
			case 'status':
				return (
					<Select
						value={value}
						onChange={(e) => setValue(e.target.value)}
						fullWidth
						sx={{
							color: theme.palette.text.primary,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.divider,
							},
						}}
					>
						<MenuItem value="new">Новая</MenuItem>
						<MenuItem value="assigned">Назначена</MenuItem>
						<MenuItem value="in_progress">В работе</MenuItem>
						<MenuItem value="resolved">Завершена</MenuItem>
						<MenuItem value="closed">Закрыта</MenuItem>
					</Select>
				);
			case 'priority':
				return (
					<Select
						value={value}
						onChange={(e) => setValue(e.target.value)}
						fullWidth
						sx={{
							color: theme.palette.text.primary,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.divider,
							},
						}}
					>
						<MenuItem value="low">Low</MenuItem>
						<MenuItem value="medium">Medium</MenuItem>
						<MenuItem value="high">High</MenuItem>
						<MenuItem value="critical">Critical</MenuItem>
					</Select>
				);
			case 'category_id':
				return (
					<TextField
						type="number"
						value={value}
						onChange={(e) => setValue(Number(e.target.value))}
						fullWidth
						sx={{
							'& .MuiInputBase-root': {
								color: theme.palette.text.primary,
							},
						}}
					/>
				);
			case 'assigned_to':
				return (
					<Select
						value={value}
						onChange={(e) => setValue(e.target.value)}
						fullWidth
						sx={{
							color: theme.palette.text.primary,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.divider,
							},
						}}
					>
						<MenuItem value="">Unassigned</MenuItem>
						{assignees.map((assignee) => (
							<MenuItem key={assignee.employee_id} value={assignee.employee_id}>
								{assignee.username || `Employee ${assignee.employee_id}`}
							</MenuItem>
						))}
					</Select>
				);
			default:
				return null;
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					backgroundColor: theme.palette.background.paper,
				}
			}}
		>
			<DialogTitle sx={{ color: theme.palette.text.primary }}>
				Обновление заявки
			</DialogTitle>
			<DialogContent sx={{
				width: '600px',
			}}>
				<FormControl fullWidth margin="normal">
					<InputLabel sx={{ color: theme.palette.text.secondary }}>
						Поля для обновления
					</InputLabel>
					<Select
						value={field}
						onChange={(e) => setField(e.target.value as string)}
						label="Field to Update"
						sx={{
							color: theme.palette.text.primary,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.divider,
							},
						}}
					>
						<MenuItem value="status">Статус</MenuItem>
						<MenuItem value="priority">Приоритет</MenuItem>
						<MenuItem value="category_id">Категория</MenuItem>
						<MenuItem value="assigned_to">Сотрудник</MenuItem>
					</Select>
				</FormControl>

				<FormControl fullWidth margin="normal">
					{renderFieldInput()}
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					sx={{ color: theme.palette.text.secondary }}
				>
					Отменить
				</Button>
				<Button
					onClick={handleSubmit}
					color="primary"
				>
					Обновить
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default TicketUpdatePopup;