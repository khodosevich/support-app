import { Box, Typography, useTheme } from '@mui/material';
import EditIcon from '../EditIcon.tsx';
import UpdateAssignees from '../assignees/UpdateAssignees.tsx';
import { useState } from 'react';

const DashboardItemAssignees = ({ username, email, employeeid }: {username: string, email: string, employeeid: number}) => {
	const [open, setOpen] = useState<boolean>(false);
	const theme = useTheme();

	return (
		<Box sx={{
			width: '100%',
			paddingLeft: '10px',
			display: 'flex',
			justifyContent: 'space-between',
		}}>
			<Box>
				<Box sx={{
					display: 'flex',
					justifyContent: 'space-between',
					width: '100%',
				}}>
					<Typography sx={{ color: theme.palette.text.primary }}>
						{username}
					</Typography>
				</Box>
				<Box sx={{
					display: 'flex',
					justifyContent: 'space-between',
				}}>
					<Typography sx={{ color: theme.palette.text.secondary }}>
						{email}
					</Typography>
				</Box>
			</Box>
			<Box onClick={() => setOpen(true)}>
				<EditIcon />
			</Box>
			<UpdateAssignees
				username={username}
				email={email}
				id={employeeid}
				employeeid={employeeid}
				open={open}
				setOpen={setOpen}
				role={'assignee'}
			/>
		</Box>
	);
};

export default DashboardItemAssignees;