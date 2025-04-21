import React, { useState } from 'react';
import { AssigneesItemType } from '../../types/type.ts';
import { Box, Typography, useTheme } from '@mui/material';
import TextInfo from '../TextInfo.tsx';
import Icon from '../Icon.tsx';
import assigneesIcon from '../../../public/icon/assignees-green.svg';
import EditIcon from '../EditIcon.tsx';
import UpdateAssignees from './UpdateAssignees.tsx';

const AssigneesItem: React.FC<AssigneesItemType> = ({ employee_id, username, email, created_at, role, id }) => {
	const [open, setOpen] = useState(false);
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			padding: '24px',
			backgroundColor: theme.palette.background.paper,
			borderRadius: '12px',
			border: `1px solid ${theme.palette.divider}`,
			boxShadow: theme.shadows[1],
		}}>
			<Box sx={{
				display: 'flex',
				alignItems: 'center',
				gap: '16px',
			}}>
				<Box>
					<Icon src={assigneesIcon} size={24}/>
				</Box>
				<Box sx={{
					display: 'flex',
					alignItems: 'center',
					width: '320px',
					justifyContent: 'space-between',
				}}>
					<Box>
						<Typography sx={{
							fontWeight: 'bold',
							color: theme.palette.text.primary,
						}}>
							{username}
						</Typography>
						<Typography sx={{
							color: theme.palette.mode === 'light' ? '#7e92a2' : '#a0aec0',
						}}>
							{email}
						</Typography>
					</Box>
					<Box onClick={() => setOpen(true)}>
						<EditIcon/>
					</Box>
				</Box>
			</Box>
			<Box sx={{
				display: 'flex',
				height: '1px',
				backgroundColor: theme.palette.divider,
				marginBlock: '16px',
			}}></Box>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '16px',
			}}>
				<TextInfo title={'Employee ID'} value={employee_id?.toString()}/>
				<TextInfo title={'Created'} value={new Date(created_at).toLocaleDateString()}/>
			</Box>
			<UpdateAssignees
				open={open}
				setOpen={setOpen}
				employeeid={employee_id}
				email={email}
				role={role}
				username={username}
				id={id}
			/>
		</Box>
	);
};

export default AssigneesItem;