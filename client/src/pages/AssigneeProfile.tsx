import { useContext, useEffect, useState } from 'react';
import { methods } from '../api/methods';
import { AlertContext } from '../utils/AlertContext';
import { AssigneesContext } from '../utils/AssigneesContext';
import { Box, Button, Typography, Chip, Avatar, FormLabel, useTheme } from '@mui/material';
import MyFormControl from '../components/MyFormControl';
import { useNavigate, useParams } from 'react-router';
import { AssigneesItemType } from '../types/type.ts';

const AssigneeProfile = () => {
	const theme = useTheme();
	const { employeeId } = useParams();
	const navigate = useNavigate();
	const { setAlert } = useContext(AlertContext);
	const { assignees, setAssignees } = useContext(AssigneesContext);

	const [currentAssignee, setCurrentAssignee] = useState<AssigneesItemType>({
		employee_id: 0,
		id: 0,
		username: '',
		email: '',
		role: 'assignee',
		specialization: '',
		skills: [],
		current_workload: 0,
		max_workload: 5,
		rating: '5.0',
		avatar_url: '',
		created_at: '',
	});

	const [newAssigneeData, setNewAssigneeData] = useState<AssigneesItemType>({
		...currentAssignee,
	});

	const [newSkill, setNewSkill] = useState('');

	useEffect(() => {
		const fetchAssignee = async () => {
			try {
				const response = await methods.assignees.getAssigneesById(Number(employeeId));
				setCurrentAssignee(response.data);
				setNewAssigneeData(response.data);
			}
			catch {
				setAlert({ type: 'error', isShowAlert: true, message: 'Ошибка загрузки данных сотрудника!' });
			}
		};

		if (employeeId) {
			fetchAssignee();
		} else if (assignees.length > 0) {
			setCurrentAssignee(assignees[0]);
			setNewAssigneeData(assignees[0]);
		}
	}, [employeeId, assignees]);

	const handleUpdateAssignee = async () => {
		try {
			const updatedAssignee = await methods.assignees.updateAssignees(
				currentAssignee.employee_id,
				newAssigneeData,
			);

			setAssignees(prev => prev.map(a => a.id === employeeId ? updatedAssignee.data.assignee : a ));
			setCurrentAssignee(updatedAssignee.data.assignee);

			setAlert({
				type: 'success',
				isShowAlert: true,
				message: 'Данные сотрудника обновлены!',
			});
		}
		catch {
			setAlert({
				type: 'error',
				isShowAlert: true,
				message: 'Ошибка при обновлении данных!',
			});
		}
	};

	const handleAddSkill = () => {
		if (newSkill && !newAssigneeData.skills.includes(newSkill)) {
			setNewAssigneeData(prev => ({
				...prev,
				skills: [...prev.skills, newSkill],
			}));
			setNewSkill('');
		}
	};

	const handleRemoveSkill = (skillToRemove: string) => {
		setNewAssigneeData(prev => ({
			...prev,
			skills: prev.skills.filter(skill => skill !== skillToRemove),
		}));
	};

	return (
		<Box sx={{
			p: { xs: 2, md: 4 },
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			minHeight: 'calc(100vh - 64px)',
			backgroundColor: theme.palette.background.default,
		}}>
			<Typography variant="h6" sx={{
				mb: 2,
				color: theme.palette.text.primary,
				fontWeight: 600
			}}>
				Редактирование сотрудника: {currentAssignee.username}
			</Typography>

			<Box sx={{
				backgroundColor: theme.palette.background.paper,
				borderRadius: '12px',
				border: `1px solid ${theme.palette.divider}`,
				padding: { xs: '15px', md: '20px' },
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
				width: '100%',
				maxWidth: '600px',
				boxShadow: theme.shadows[1],
			}}>
				{currentAssignee.avatar_url && (
					<Avatar
						src={currentAssignee.avatar_url}
						sx={{
							width: 100,
							height: 100,
							alignSelf: 'center',
							mb: 2,
							bgcolor: theme.palette.primary.main,
						}}
					/>
				)}

				<MyFormControl
					labelValue="Имя пользователя"
					placeholder="Введите имя"
					labelRequired={true}
					inputType="text"
					value={newAssigneeData.username}
					onChange={(e) => setNewAssigneeData(prev => ({ ...prev, username: e.target.value }))}
					name={''} error={''}
				/>

				<MyFormControl
					labelValue="Email"
					placeholder="Введите email"
					labelRequired={true}
					inputType="email"
					value={newAssigneeData.email}
					onChange={(e) => setNewAssigneeData(prev => ({ ...prev, email: e.target.value }))}
					name={''} error={''}
				/>

				<MyFormControl
					labelValue="Специализация"
					placeholder="Введите специализацию"
					labelRequired={true}
					inputType="text"
					value={newAssigneeData.specialization}
					onChange={(e) => setNewAssigneeData(prev => ({ ...prev, specialization: e.target.value }))}
					name={''} error={''}
				/>

				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '10px'
				}}>
					<FormLabel sx={{ color: theme.palette.text.primary }}>
						Навыки
					</FormLabel>
					<Box sx={{
						display: 'flex',
						gap: 1,
						flexWrap: 'wrap',
						minHeight: '40px',
						alignItems: 'center',
					}}>
						{newAssigneeData.skills?.map(skill => (
							<Chip
								key={skill}
								label={skill}
								onDelete={() => handleRemoveSkill(skill)}
								sx={{
									backgroundColor: theme.palette.primary.light,
									color: theme.palette.primary.contrastText,
								}}
							/>
						))}
					</Box>
					<Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
						<MyFormControl
							placeholder="Добавить навык"
							inputType="text"
							value={newSkill}
							onChange={(e) => setNewSkill(e.target.value)}
							name={''} error={''} labelValue={''} labelRequired={false}
						/>
						<Button
							variant="contained"
							onClick={handleAddSkill}
							disabled={!newSkill}
							sx={{
								height: '56px',
								whiteSpace: 'nowrap',
							}}
						>
							Добавить
						</Button>
					</Box>
				</Box>

				<Box sx={{
					display: 'grid',
					gridTemplateColumns: { xs: '1fr' },
					gap: '20px'
				}}>
					<MyFormControl
						labelValue="Текущая нагрузка"
						placeholder="Введите текущую нагрузку"
						labelRequired={true}
						inputType="number"
						value={newAssigneeData.current_workload?.toString()}
						onChange={(e) => setNewAssigneeData(prev => ({
							...prev,
							current_workload: parseInt(e.target.value) || 0,
						}))}
						name={''}
						error={''}
					/>

					<MyFormControl
						labelValue="Макс. нагрузка"
						placeholder="Введите максимальную нагрузку"
						labelRequired={true}
						inputType="number"
						value={newAssigneeData.max_workload?.toString()}
						onChange={(e) => setNewAssigneeData(prev => ({
							...prev,
							max_workload: parseInt(e.target.value) || 5,
						}))}
						name={''}
						error={''}
					/>
				</Box>

				<Box sx={{
					display: 'flex',
					gap: 2,
					mt: 2,
					flexDirection: { xs: 'column', sm: 'row' }
				}}>
					<Button
						variant="contained"
						color="primary"
						onClick={handleUpdateAssignee}
						fullWidth
						sx={{
							py: 1.5,
						}}
					>
						Сохранить
					</Button>
					<Button
						variant="outlined"
						color="secondary"
						onClick={() => navigate('/assignees')}
						fullWidth
						sx={{
							py: 1.5,
						}}
					>
						Назад
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default AssigneeProfile;