import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import MyFormControl from '../components/MyFormControl.tsx';
import { StyledBtn } from '../ui/StyledBtn.tsx';
import { Box, Typography, useTheme } from '@mui/material';
import { NavLink, useNavigate } from 'react-router';
import { methods } from '../api/methods.ts';
import { AlertContextType, AlertDate } from '../types/type.ts';
import { AlertContext } from '../utils/AlertContext.tsx';
import { UserContext } from '../utils/UserContext.tsx';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
	role: string;
	id: number;
}

const AuthPage = ({ type }: { type: string }) => {
	const theme = useTheme();
	const isLogin = type === 'login';
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
	});
	const [errors, setErrors] = useState({
		username: '',
		email: '',
		password: '',
	});

	const { setAlert }: AlertContextType = useContext(AlertContext);
	const { setUser } = useContext(UserContext);
	const navigate = useNavigate();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setErrors({ ...errors, [name]: '' });
	};

	const validateForm = () => {
		const newErrors = { username: '', email: '', password: '' };

		if (!formData.username) {
			newErrors.username = 'Username is required';
		}
		if (!formData.password) {
			newErrors.password = 'Password is required';
		}
		if (!isLogin && !formData.email) {
			newErrors.email = 'Email is required';
		}

		setErrors(newErrors);
		return Object.values(newErrors).every((error) => !error);
	};

	const submitHandler = async (e: FormEvent) => {
		e.preventDefault();

		if (validateForm()) {
			try {
				let response;

				if (!isLogin) {
					response = await methods.auth.register(formData);
				} else {
					response = await methods.auth.login(formData);
				}

				const token = response.data.accessToken;
				if (token) {
					localStorage.setItem('accessToken', token);
					localStorage.setItem('refreshToken', response.data.refreshToken);

					const decoded = jwtDecode<CustomJwtPayload>(token);
					setUser({ isAuth: true, role: decoded?.role, id: decoded?.id });

					switch (decoded.role) {
						case 'admin':
							navigate('/dashboard');
							break;
						case 'user':
							navigate('/tickets');
							break;
						case 'assignee':
							navigate(`/tickets/assignee`);
							break;
						default:
							navigate('/login');
							break;
					}
				} else {
					console.error('Auth failed, no token received');
				}
			}
			catch {
				handleShowAlert({
					type: 'error',
					isShowAlert: true,
					message: 'Что-то пошло не так.',
				});
			}
		} else {
			setAlert({ type: 'error', isShowAlert: true, message: 'Заполните обязательные поля!' });
		}
	};

	const handleShowAlert = ({ isShowAlert, type, message }: AlertDate) => {
		setAlert({ isShowAlert, type, message });
	};

	return (
		<Box sx={{
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100vh',
			width: '100%',
			backgroundColor: theme.palette.background.default,
			p: 2,
		}}>
			<Box sx={{
				backgroundColor: theme.palette.background.paper,
				borderRadius: '10px',
				padding: { xs: '30px 20px', sm: '40px 30px', md: '50px 40px' },
				width: '100%',
				maxWidth: '500px',
				boxShadow: theme.shadows[3],
			}}>
				<Typography variant={'h4'} sx={{
					fontSize: { xs: '24px', sm: '30px' },
					textAlign: 'center',
					color: theme.palette.text.primary,
					mb: 3,
					fontWeight: 600,
				}}>
					{isLogin ? 'Вход' : 'Регистрация'}
				</Typography>
				<form style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '20px',
				}} onSubmit={submitHandler}>
					<MyFormControl
						labelValue={'Имя пользователя'}
						placeholder={'Введите имя пользователя'}
						labelRequired={true}
						inputType={'text'}
						value={formData.username}
						onChange={handleChange}
						error={errors.username}
						name="username"
					/>
					{
						!isLogin && <MyFormControl
							labelValue={'Email'}
							placeholder={'Введите email'}
							labelRequired={true}
							inputType={'email'}
							value={formData.email}
							onChange={handleChange}
							error={errors.email}
							name="email"
						/>
					}
					<MyFormControl
						labelValue={'Пароль'}
						placeholder={'Введите пароль'}
						labelRequired={true}
						inputType={'password'}
						value={formData.password}
						onChange={handleChange}
						error={errors.password}
						name="password"
					/>
					<StyledBtn type="submit">
						{isLogin ? 'Войти' : 'Зарегистрироваться'}
					</StyledBtn>
				</form>
				<Typography sx={{
					textAlign: 'center',
					mt: 3,
					color: theme.palette.text.secondary,
				}}>
					{isLogin ? 'Ещё нет аккаунта? ' : 'Уже есть аккаунт? '}
					<NavLink
						to={isLogin ? '/register' : '/login'}
						style={{
							color: theme.palette.primary.main,
							textDecoration: 'none',
							fontWeight: 500,
						}}
					>
						{isLogin ? 'Зарегистрироваться' : 'Войти'}
					</NavLink>
				</Typography>
			</Box>
		</Box>
	);
};

export default AuthPage;