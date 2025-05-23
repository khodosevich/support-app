import { Box, Button, Dialog, DialogContent, Typography, useTheme } from '@mui/material';
import { StyledInput } from '../../ui/StyledInput.tsx';
import { StyledBtn } from '../../ui/StyledBtn.tsx';
import { methods } from '../../api/methods.ts';
import { AlertContextType, AssigneesType, UpdateAssigneesType } from '../../types/type.ts';
import React, { useContext, useState } from 'react';
import { AlertContext } from '../../utils/AlertContext.tsx';
import { AssigneesContext } from '../../utils/AssigneesContext.tsx';

const UpdateAssignees: React.FC<UpdateAssigneesType> = ({open, setOpen, email, username, role, employeeid, id}) => {
	const { setAlert }: AlertContextType = useContext(AlertContext);
	const { setAssignees } = useContext(AssigneesContext);
	const theme = useTheme();

	const [updateAssignees, setUpdateAssignees] = useState<AssigneesType>({
		email,
		username,
		role,
	});

	const handleClose = () => {
		setOpen(false);
	};

	const handleUpdate = async () => {
		try {
			console.log(id);
			const assignee = await methods.assignees.getAssigneesById(id);
			console.log(assignee);
		}
		catch {
			setAlert({ type: 'error', isShowAlert: true, message: 'Ошибка при обновлении!' });
		}
	};

	const handleDelete = async () => {
		try {
			const response = await methods.assignees.deleteAssigneesById(employeeid);

			if (response.status === 204) {
				handleClose();
				setAlert({ type: 'success', isShowAlert: true, message: 'Сотрудник удален!' });
				setAssignees(prev => prev.filter(assignee => assignee.employee_id !== employeeid));
			}
		}
		catch (e) {
			console.log(e);
			setAlert({ type: 'error', isShowAlert: true, message: 'Ошибка при удалении!' });
		}
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
				<Typography sx={{
					fontWeight: 'bold',
					marginBottom: '7px',
					color: theme.palette.text.primary,
				}}>
					Обновление данных сотрудника
				</Typography>
				<DialogContent sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '16px',
					padding: 0,
					width: '100%',
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
							value={updateAssignees.username}
							onChange={(e) => setUpdateAssignees(prev => ({ ...prev, username: e.target.value }))}
							placeholder={'Имя'}
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
							value={updateAssignees.email}
							onChange={(e) => setUpdateAssignees(prev => ({ ...prev, email: e.target.value }))}
							placeholder={'Введите email'}
							type={'email'}
						/>
					</Box>
				</DialogContent>
				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '15px',
					width: '100%',
				}}>
					<StyledBtn onClick={handleUpdate}>
						Обновить
					</StyledBtn>
					<Button
						fullWidth
						onClick={handleDelete}
						sx={{
							color: theme.palette.error.main,
						}}
					>
						Удалить
					</Button>
				</Box>
			</Box>
		</Dialog>
	);
};

export default UpdateAssignees;