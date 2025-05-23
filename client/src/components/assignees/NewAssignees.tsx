import React, { useContext, useState } from 'react';
import { Box, Dialog, Typography, useTheme } from '@mui/material';
import { StyledInput } from '../../ui/StyledInput.tsx';
import { StyledBtn } from '../../ui/StyledBtn.tsx';
import { AlertContextType, AssigneesType, OpenModal } from '../../types/type.ts';
import { AlertContext } from '../../utils/AlertContext.tsx';
import { methods } from '../../api/methods.ts';
import { AssigneesContext } from '../../utils/AssigneesContext.tsx';
import { Select, MenuItem } from '@mui/material';

const NewAssignees: React.FC<OpenModal> = ({ open, setOpen }) => {
	const theme = useTheme();
	const [newAssignees, setNewAssignees] = useState<AssigneesType>({
		email: '',
		username: '',
		password: '',
		role: 'assignee',
	});

	const { setAlert }: AlertContextType = useContext(AlertContext);
	const { setAssignees } = useContext(AssigneesContext);

	const handleClose = () => {
		setOpen(false);
		setNewAssignees({ email: '', username: '', password: '', role: 'assignee' });
	};

	const createNewAssignees = async () => {
		if (!newAssignees.email || !newAssignees.username || !newAssignees.password) {
			setAlert({ type: 'error', isShowAlert: true, message: 'Все поля обязательны!' });
			return;
		}

		try {
			const response = await methods.assignees.createAssignees(newAssignees);
			if (response.status === 201) {
				const responseAssignees = await methods.assignees.getAssignees();
				if (responseAssignees.status === 200) {
					setAssignees(responseAssignees.data);
				}

				handleClose();
				setAlert({ type: 'success', isShowAlert: true, message: 'Новый сотрудник создан!' });
			}
		} catch (e) {
			console.error(e);
			setAlert({ type: 'error', isShowAlert: true, message: 'Сервер не отвечает, попробуйте еще раз!' });
		}
	};

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setNewAssignees(prevState => ({ ...prevState, role: event.target.value as string }));
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
					padding: theme.spacing(4),
				},
			}}
		>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: theme.spacing(3),
			}}>
				<Typography variant="h6" sx={{
					fontWeight: 600,
					color: theme.palette.text.primary,
				}}>
					Создать нового сотрудника
				</Typography>

				<Box>
					<Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.primary }}>
						ФИО
					</Typography>
					<StyledInput
						value={newAssignees.username}
						onChange={(e) => setNewAssignees(prev => ({ ...prev, username: e.target.value }))}
						placeholder="Введите ФИО"
						type="text"
					/>
				</Box>

				<Box>
					<Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.primary }}>
						Email
					</Typography>
					<StyledInput
						value={newAssignees.email}
						onChange={(e) => setNewAssignees(prev => ({ ...prev, email: e.target.value }))}
						placeholder="Введите email"
						type="email"
					/>
				</Box>

				<Box>
					<Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.primary }}>
						Пароль
					</Typography>
					<StyledInput
						value={newAssignees.password}
						onChange={(e) => setNewAssignees(prev => ({ ...prev, password: e.target.value }))}
						placeholder="Введите пароль"
						type="password"
					/>
				</Box>

				<Box>
					<Typography variant="subtitle1" sx={{ mb: 1, color: theme.palette.text.primary }}>
						Роль
					</Typography>
					<Select
						value={newAssignees.role}
						onChange={handleChange}
						fullWidth
						sx={{
							color: theme.palette.text.primary,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.divider,
							},
						}}
					>
						<MenuItem value={'user'}>Пользователь</MenuItem>
						<MenuItem value={'admin'}>Администратор</MenuItem>
						<MenuItem value={'assignee'}>Сотрудник</MenuItem>
					</Select>
				</Box>

				<StyledBtn onClick={createNewAssignees}>
					Создать
				</StyledBtn>
			</Box>
		</Dialog>
	);
};

export default NewAssignees;