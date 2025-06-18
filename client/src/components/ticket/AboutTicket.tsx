import { Box, useTheme } from '@mui/material';
import React from 'react';
import { TicketsItemType } from '../../types/type.ts';
import InfoTicket from './InfoTicket.tsx';
import TicketDescription from './TicketDescription.tsx';

const AboutTicket: React.FC<TicketsItemType> = ({ created_by, created_at, category_id, ticket_id, title, username, description, assigned_to }) => {
	const theme = useTheme();

	return (
		<Box sx={{
			paddingTop: '40px',
			paddingLeft: '40px',
			paddingRight: '40px',
			backgroundColor: theme.palette.background.default,
		}}>
			<InfoTicket
				title={title}
				description={description}
				ticket_id={ticket_id}
				created_at={created_at}
				username={username}
				created_by={created_by?.user_id}
				assigned_to={assigned_to?.id}
				category_id={category_id}
				status={''}
				priority={''}
				resolved_at={null}
				actual_time={null}
				ai_confidence={null}
				attachments={null}
				ticketUserName={created_by?.username}
			/>
			<TicketDescription text={description}/>
		</Box>
	);
};

export default AboutTicket;