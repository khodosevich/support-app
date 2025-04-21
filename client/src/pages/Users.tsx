import { useContext, useEffect, useState } from 'react';
import { methods } from '../api/methods.ts';
import { AlertContextType, UserType } from '../types/type.ts';
import { AlertContext } from '../utils/AlertContext.tsx';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, IconButton, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '../components/EditIcon.tsx';

const Users = () => {
	const { setAlert }: AlertContextType = useContext(AlertContext);
	const [users, setUsers] = useState<UserType[]>([]);
	const [editingUserId, setEditingUserId] = useState<number | null>(null);
	const [selectedRole, setSelectedRole] = useState<string>('');

	useEffect(() => {
		const load = async () => {
			try {
				const response = await methods.users.getUsers();
				setUsers(response.data || []);
			} catch {
				setAlert({ type: 'error', isShowAlert: true, message: 'Ошибка при загрузке пользователей!' });
			}
		}

		load();
	}, []);

	const handleDelete = async (userId: number) => {
		try {
			await methods.users.deleteUser(userId);
			setUsers(users.filter(user => user.id !== userId));
			setAlert({ type: 'success', isShowAlert: true, message: 'Пользователь успешно удален!' });
		} catch {
			setAlert({ type: 'error', isShowAlert: true, message: 'Ошибка при удалении пользователя!' });
		}
	};

	const canEditRole = (currentRole: string) => {
		// Только assignee можно изменить роль (только на admin)
		// User вообще нельзя менять роль
		return currentRole === 'assignee';
	};

	const startEditing = (userId: number, currentRole: string) => {
		if (!canEditRole(currentRole)) return;

		setEditingUserId(userId);
		setSelectedRole(currentRole);
	};

	const handleRoleChange = (event: SelectChangeEvent) => {
		setSelectedRole(event.target.value);
	};

	const updateUserRole = async (userId: number) => {
		try {
			await methods.users.updateUserRole(userId, selectedRole);
			setUsers(users.map(user =>
				user.id === userId ? { ...user, role: selectedRole } : user
			));
			setAlert({ type: 'success', isShowAlert: true, message: 'Роль пользователя успешно обновлена!' });
		} catch {
			setAlert({ type: 'error', isShowAlert: true, message: 'Ошибка при обновлении роли пользователя!' });
		} finally {
			setEditingUserId(null);
		}
	};

	const handleBlur = (userId: number) => {
		if (editingUserId === userId) {
			updateUserRole(userId);
		}
	};

	return (
		<Box sx={{ p: 3, width: '100%' }}>
			<Typography variant="h4" component="h1" gutterBottom>
				Список пользователей
			</Typography>

			<TableContainer component={Paper}>
				<Table aria-label="таблица пользователей">
					<TableHead>
						<TableRow sx={{ bgcolor: 'background.default' }}>
							<TableCell>ID</TableCell>
							<TableCell>Имя пользователя</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Роль</TableCell>
							<TableCell>Дата создания</TableCell>
							<TableCell>Действия</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow
								key={user.id}
								hover
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell>{user.id}</TableCell>
								<TableCell>{user.username}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									{editingUserId === user.id ? (
										<Select
											value={selectedRole}
											onChange={handleRoleChange}
											onBlur={() => handleBlur(user.id)}
											autoFocus
											sx={{ width: '120px' }}
										>
											{/* Для assignee показываем только вариант admin */}
											{user.role === 'assignee' && (
												<MenuItem value="admin">Admin</MenuItem>
											)}
											<MenuItem value={user.role} disabled>
												{user.role === 'assignee' ? 'Assignee' : 'User'}
											</MenuItem>
										</Select>
									) : (
										 user.role
									 )}
								</TableCell>
								<TableCell>
									{new Date(user.created_at).toLocaleDateString()}
								</TableCell>
								<TableCell>
									{user.role !== 'user' && (
										<IconButton
											aria-label="изменить"
											onClick={() => startEditing(user.id, user.role)}
											color="primary"
											disabled={!canEditRole(user.role)}
										>
											<EditIcon/>
										</IconButton>
									)}
									<IconButton
										aria-label="удалить"
										onClick={() => handleDelete(user.id)}
										color="error"
									>
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

export default Users;