import { UserContext } from '../utils/UserContext.tsx';
import { useContext, useEffect, useState } from 'react';
import { methods } from '../api/methods.ts';
import { AlertContextType, UserType } from '../types/type.ts';
import { AlertContext } from '../utils/AlertContext.tsx';
import { Box, Button, Typography, useTheme } from '@mui/material';
import MyFormControl from '../components/MyFormControl.tsx';
import { NavLink } from 'react-router';

const Profile = () => {
	const theme = useTheme();
	const { user } = useContext(UserContext);
	const isAdmin = user.role === 'admin';
	const { setAlert }: AlertContextType = useContext(AlertContext);
	const [currentUser, setCurrentUser] = useState<UserType>({
		id: 0,
		username: '',
		email: '',
		role: '',
		created_at: '',
	});
	const [newUserData, setNewUserData] = useState<UserType>({
		id: 0,
		username: '',
		email: '',
		role: '',
		created_at: '',
	});
	const [password, setPassword] = useState({
		password: '',
		newPassword: '',
	});

	useEffect(() => {
		const fetchUserById = async () => {
			try {
				const response = await methods.users.getUserById(Number(user.id));
				setCurrentUser(response.data);
				setNewUserData(response.data);
			}
			catch {
				setAlert({ type: 'error', isShowAlert: true, message: 'Ошибка декодирования токена!' });
			}
		};

		fetchUserById();
	}, [user.id, setAlert]);

	const handleEditAccount = async () => {
		// Реализация сохранения изменений
	};

	const handleDeleteAccount = async () => {
		// Реализация удаления аккаунта
	};

	const logoutHandler = async () => {
		// Реализация выхода
	};

	return (
		<Box sx={{
			p: { xs: 2, md: 4 },
			backgroundColor: theme.palette.background.default,
			minHeight: 'calc(100vh - 64px)',
		}}>
			<Typography variant="h6" sx={{
				mb: 2,
				color: theme.palette.text.primary,
			}}>
				Страница пользователя: {currentUser.username}
			</Typography>

			<Box sx={{
				backgroundColor: theme.palette.background.paper,
				borderRadius: '12px',
				border: `1px solid ${theme.palette.divider}`,
				padding: '20px',
				display: 'flex',
				flexDirection: 'column',
				gap: '20px',
				maxWidth: '400px',
			}}>
				<MyFormControl
					labelValue={'Имя'}
					placeholder={'Введите имя пользователя'}
					labelRequired={true}
					inputType={'text'}
					value={newUserData.username}
					onChange={(e) => setNewUserData(prev => ({ ...prev, username: e.target.value }))}
					name="username"
					error=""
				/>

				<MyFormControl
					labelValue={'Почта'}
					placeholder={'Введите почту'}
					labelRequired={true}
					inputType={'email'}
					value={newUserData.email}
					onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
					name="email"
					error=""
				/>

				<MyFormControl
					labelValue={'Старый пароль'}
					placeholder={'Введите старый пароль'}
					labelRequired={false}
					inputType="password"
					value={password.password}
					onChange={(e) => setPassword(prev => ({ ...prev, password: e.target.value }))}
					name="oldPassword"
					error=""
				/>

				<MyFormControl
					labelValue={'Новый пароль'}
					placeholder={'Введите новый пароль'}
					labelRequired={false}
					inputType="password"
					value={password.newPassword}
					onChange={(e) => setPassword(prev => ({ ...prev, newPassword: e.target.value }))}
					name="newPassword"
					error=""
				/>

				<Box sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: '12px',
					mt: 2,
				}}>
					<Button
						variant="contained"
						onClick={handleEditAccount}
						sx={{
							py: 1.5,
						}}
					>
						Обновить
					</Button>

					<Button
						variant="outlined"
						color="secondary"
						onClick={logoutHandler}
						sx={{
							py: 1.5,
						}}
					>
						Выйти
					</Button>

					<Button
						variant="outlined"
						color="error"
						onClick={handleDeleteAccount}
						sx={{
							py: 1.5,
						}}
					>
						Удалить аккаунт
					</Button>
				</Box>
			</Box>

			{isAdmin && (
				<Box sx={{ mt: 3 }}>
					<Typography
						component={NavLink}
						to="/users"
						sx={{
							display: 'inline-block',
							textDecoration: 'none',
							color: theme.palette.primary.main,
							'&:hover': {
								textDecoration: 'underline',
							},
						}}
					>
						Список пользователей
					</Typography>
					<Typography
						component={NavLink}
						to="/categories"
						sx={{
							display: 'inline-block',
							ml: 3,
							textDecoration: 'none',
							color: theme.palette.primary.main,
							'&:hover': {
								textDecoration: 'underline',
							},
						}}
					>
						Список категорий
					</Typography>
				</Box>
			)}

			{user.role === 'assignee' && (
				<Typography
					component={NavLink}
					to={`/assignees/${user.id}`}
					sx={{
						display: 'inline-block',
						mt: 2,
						textDecoration: 'none',
						color: theme.palette.primary.main,
						'&:hover': {
							textDecoration: 'underline',
						},
					}}
				>
					Подробное редактирование для сотрудника
				</Typography>
			)}
		</Box>
	);
};

export default Profile;