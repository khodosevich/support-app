import { Box, Button, Typography } from '@mui/material';
import { methods } from '../../api/methods.ts';
import { AlertContextType } from '../../types/type.ts';
import { AlertContext } from '../../utils/AlertContext.tsx';
import { Dispatch, SetStateAction, useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from '../../utils/UserContext.tsx';

const TicketActions = ({ id, setUpdateTicket }: { id: number, setUpdateTicket: Dispatch<SetStateAction<boolean>> }) => {
	const { setAlert }: AlertContextType = useContext(AlertContext);
	const navigate = useNavigate();
	const { setTickets } = useContext(UserContext);

	const deleteTicket = async () => {
		try {
			const response = await methods.tickets.deleteTicket(id);

			if (response.status === 200) {
				setTickets(prev => prev.filter(t => t.ticket_id !== id));
				setAlert({ type: 'success', isShowAlert: true, message: 'Заявка удалена!' });
				navigate('/tickets');
			}
		}
		catch {
			setAlert({ type: 'error', isShowAlert: true, message: 'Произошла ошибка при удалении, обновите страницу!' });
		}
	};

	const changeTicketStatus = async (newStatus: string) => {
		try {
			const response = await methods.tickets.changeTicketStatus(id, newStatus);

			if (response.status === 200) {
				setAlert({ type: 'success', isShowAlert: true, message: `Новый статус заявки: ${newStatus}!` });
				setTickets(prev => prev.map(t => t.ticket_id === id ? response.data.ticket : t));
				setUpdateTicket(prev => !prev);
			}
		}
		catch (error) {
			if (error?.status === 403) {
				setAlert({ type: 'error', isShowAlert: true, message: 'У вас нет прав на обновление статуса!' });
			} else {
				setAlert({ type: 'error', isShowAlert: true, message: 'Произошла ошибка при обновлении, обновите страницу!' });
			}
		}
	}

	return (
		<Box sx={{
			marginTop: '24px',
		}}>
			<Typography sx={{
				fontSize: '16px',
				color: '#7e92a2',
			}}>
				Заявка не актуальна?
			</Typography>
			<Box sx={{
				display: 'flex',
				gap: '8px',
			}}>
				<Button onClick={() => changeTicketStatus('resolved')}
				        variant="outlined"
				        color="primary"
				>
					Выполнена
				</Button>
				<Button onClick={() => changeTicketStatus('closed')}
				        variant="outlined"
				        color="warning"
				>
					Закрыть задачу
				</Button>
				<Button onClick={deleteTicket}
				        variant="outlined"
				        color="error"
				>
					Удалить
				</Button>
			</Box>
		</Box>
	);
};

export default TicketActions;