import React, { useContext, useState } from 'react';
import { AlertContextType, AssigneesType, OpenModal } from '../../types/type.ts';
import { Box, Button, Dialog, MenuItem, Select, SelectChangeEvent, Typography, useTheme } from '@mui/material';
import { StyledInput } from '../../ui/StyledInput.tsx';
import { StyledBtn } from '../../ui/StyledBtn.tsx';
import { AlertContext } from '../../utils/AlertContext.tsx';
import { methods } from '../../api/methods.ts';
import { AssigneesContext } from '../../utils/AssigneesContext.tsx';

const NewAssignees: React.FC<OpenModal> = ({ open, setOpen }) => {
	const [newAssignees, setNewAssignees] = useState<AssigneesType>({
		email: '',
		username: '',
		password: '',
		role: 'assignee',
	});

	const { setAlert }: AlertContextType = useContext(AlertContext);
	const { setAssignees } = useContext(AssigneesContext);
	const theme = useTheme();

	const handleClose = () => {
		setOpen(false);
		setNewAssignees({
			email: '',
			username: '',
			password: '',
			role: 'assignee',
		})
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
		}
		catch (e) {
			console.log(e);
			setAlert({ type: 'error', isShowAlert: true, message: 'Сервер не отвечает, попробуйте еще раз!' });
		}
	};

	const handleChange = (event: SelectChangeEvent) => {
		setNewAssignees(prevState => ({ ...prevState, role: event.target.value as string }));
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			PaperProps={{
				sx: {
					backgroundColor: theme.palette.background.paper,
					borderRadius: '20px',
					padding: '20px',
				}
			}}
		>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: '15px',
			}}>
				<Box sx={{ width: '100%' }}>
					<Typography sx={{
						fontWeight: 'bold',
						marginBottom: '7px',
						color: theme.palette.text.primary,
					}}>
						ФИО
					</Typography>
					<StyledInput
						value={newAssignees.username}
						onChange={(e) => setNewAssignees((prev) => ({ ...prev, username: e.target.value }))}
						placeholder={'Введите ФИО'}
						type={'text'}
					/>
				</Box>
				<Box sx={{ width: '100%' }}>
					<Typography sx={{
						fontWeight: 'bold',
						marginBottom: '7px',
						color: theme.palette.text.primary,
					}}>
						Email
					</Typography>
					<StyledInput
						value={newAssignees.email}
						onChange={(e) => setNewAssignees((prev) => ({ ...prev, email: e.target.value }))}
						placeholder={'Введите email'}
						type={'email'}
					/>
				</Box>

				<Box sx={{ width: '100%' }}>
					<Typography sx={{
						fontWeight: 'bold',
						marginBottom: '7px',
						color: theme.palette.text.primary,
					}}>
						Пароль
					</Typography>
					<StyledInput
						value={newAssignees.password}
						onChange={(e) => setNewAssignees((prev) => ({ ...prev, password: e.target.value }))}
						placeholder={'Введите пароль'}
						type={'password'}
					/>
				</Box>

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

				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '10px',
					width: '100%',
				}}>
					<StyledBtn onClick={createNewAssignees}>
						Создать
					</StyledBtn>
					<Button
						onClick={handleClose}
						sx={{
							color: theme.palette.error.main,
						}}
					>
						Отменить
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
};

export default NewAssignees;