import { Box, Typography } from '@mui/material';
import AssigneesItem from '../components/assignees/AssigneesItem.tsx';
import DashboardBtn from '../components/dashboard/DashboardBtn.tsx';
import { useContext, useState } from 'react';
import { AssigneesContext } from '../utils/AssigneesContext.tsx';
import { useTheme } from '@mui/material/styles';

const Assignees = () => {
	const theme = useTheme();
	const { assignees } = useContext(AssigneesContext);
	const [moreAssignees, setMoreAssignees] = useState(false);

	const toggleMoreAssignees = () => {
		setMoreAssignees(prev => !prev);
	};

	return (
		<Box sx={{
			padding: { xs: '16px', md: '24px' },
			width: '100%',
			backgroundColor: theme.palette.background.default,
			minHeight: 'calc(100vh - 64px)',
		}}>
			<Typography sx={{
				fontSize: '16px',
				paddingBlock: '12px 24px',
				color: theme.palette.text.primary,
			}}>
				Количество сотрудников: <strong>{assignees.length}</strong>
			</Typography>

			<Box sx={{
				display: 'grid',
				gridTemplateColumns: {
					xs: '1fr',
					sm: '1fr 1fr',
					md: '1fr 1fr 1fr',
					lg: '1fr 1fr 1fr 1fr',
				},
				gap: '16px',
			}}>
				{moreAssignees
				 ? assignees.map((assignee) => (
						<AssigneesItem {...assignee} key={assignee.employee_id} />
					))
				 : assignees.slice(0, 8).map((assignee) => (
						<AssigneesItem {...assignee} key={assignee.employee_id} />
					))
				}
			</Box>

			{assignees.length > 8 && (
				<Box onClick={toggleMoreAssignees} sx={{
					marginTop: '24px',
					display: 'flex',
					justifyContent: 'center',
				}}>
					<DashboardBtn text={moreAssignees ? 'Скрыть' : 'Загрузить еще'}/>
				</Box>
			)}
		</Box>
	);
};

export default Assignees;