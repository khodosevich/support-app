import React from 'react';
import { Box, Grid, Typography, useTheme } from '@mui/material';
import TextInfo from '../TextInfo.tsx';
import { TicketsItemType } from '../../types/type.ts';
import { NavLink } from 'react-router';

const InfoTicket: React.FC<TicketsItemType> = ({ created_by, category_id, created_at, ticket_id, title, ticketUserName }) => {
	const theme = useTheme();

	console.log(created_by);

	return (
		<Grid container spacing={2}>
			<Grid item xs={4} sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '10px',
			}}>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '4px',
				}}>
					<Typography sx={{
						fontSize: '16px',
						color: theme.palette.text.secondary,
					}}>
						Пользователь
					</Typography>
					<Typography
						component={NavLink}
						to={`/profile/${created_by}`}
						sx={{
							fontWeight: 'bold',
							color: theme.palette.primary.main,
							textDecoration: 'none',
							'&:hover': {
								textDecoration: 'underline',
							}
						}}
					>
						{ticketUserName}
					</Typography>
				</Box>

				<TextInfo title={'Проблема'} value={title.toString()}/>
			</Grid>
			<Grid item xs={4} sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '10px',
			}}>
				<TextInfo title={'Создано'} value={new Date(created_at).toLocaleDateString()}/>
				<TextInfo title={'Категория'} value={category_id?.toString() ?? 'Не указано'} />
			</Grid>
			<Grid item xs={4} sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '10px',
			}}>
				<TextInfo title={'Ticket ID'} value={ticket_id.toString()}/>
			</Grid>
		</Grid>
	);
};

export default InfoTicket;