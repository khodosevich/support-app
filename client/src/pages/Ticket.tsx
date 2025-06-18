import { useParams } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { methods } from '../api/methods.ts';
import { Box, Grid } from '@mui/material';
import { AlertContextType, TicketsItemType } from '../types/type.ts';
import AboutTicket from '../components/ticket/AboutTicket.tsx';
import TicketAssigneeSide from '../components/ticket/TicketAssigneeSide.tsx';
import { AlertContext } from '../utils/AlertContext.tsx';
import TicketUpdatePopup from '../components/ticket/TicketUpdatePopup.tsx';
import TicketComments from '../components/ticket/TicketComments.tsx';
import Button from '@mui/material/Button';
import { UserContext } from '../utils/UserContext.tsx';

const Ticket = () => {
	const { id } = useParams();
	const [currentTicket, setCurrentTicket] = useState<TicketsItemType>({
		ticket_id: 0,
		title: '',
		description: '',
		status: '',
		priority: '',
		category_id: 0,
		assigned_to: { id: 0, username: '' },
		created_by: { id: 0, username: '' },
		created_at: '',
		resolved_at: '',
		estimated_time: '',
		actual_time: '',
		ai_confidence: 0,
		attachments: null,
		username: '',
	});
	const { setAlert }: AlertContextType = useContext(AlertContext);
	const [updateTicket, setUpdateTicket] = useState<boolean>(false);
	const [updatePopupOpen, setUpdatePopupOpen] = useState(false);

	const fetchTicket = async () => {
		if (!id) return;

		try {
			const response = await methods.tickets.getTicketsById(Number(id));

			if (response.status === 200) {
				setCurrentTicket(response.data);
			}
		} catch (e) {
			setAlert({ type: 'error', isShowAlert: true, message: 'Произошла ошибка при загрузке, обновите страницу!' });
			console.log(e);
		}
	};

	useEffect(() => {
		fetchTicket();
	}, [updateTicket]);

	const { user } = useContext(UserContext);
	const isUser = user.role === 'user';

	return (
		<Grid container spacing={3}>
			<Grid item xs={8}>
				<AboutTicket {...currentTicket} setUpdateTicket={setUpdateTicket} />

				<Box sx={{ padding: '40px' }}>
					{
						!isUser && 	<Box mb={2}>
							<Button
								variant="contained"
								color="primary"
								onClick={() => setUpdatePopupOpen(true)}
							>
								Обновить тело задачи
							</Button>
						</Box>
					}

					<TicketComments ticketId={currentTicket.ticket_id} />
				</Box>
			</Grid>

			<Grid item xs={4}>
				<TicketAssigneeSide {...currentTicket} />
			</Grid>

			<TicketUpdatePopup
				open={updatePopupOpen}
				onClose={() => setUpdatePopupOpen(false)}
				ticket={currentTicket}
				onUpdate={() => setUpdateTicket(!updateTicket)}
			/>
		</Grid>
	);
};

export default Ticket;