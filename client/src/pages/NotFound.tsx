import { Box, Typography, Button, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

const NotFound = () => {
	const theme = useTheme();
	const navigate = useNavigate();

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				minHeight: '100vh',
				width: '100%',
				background: theme.palette.mode === 'light'
				            ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
				            : 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
				p: 3,
				textAlign: 'center',
			}}
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<Typography
					variant="h1"
					sx={{
						fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
						fontWeight: 700,
						color: theme.palette.primary.main,
						mb: 2,
						textShadow: '3px 3px 0 rgba(0,0,0,0.1)',
					}}
				>
					404
				</Typography>
			</motion.div>

			<motion.div
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.5 }}
			>
				<Typography
					variant="h4"
					sx={{
						fontWeight: 600,
						mb: 2,
						color: theme.palette.text.primary,
					}}
				>
					Упс! Страница не найдена
				</Typography>
			</motion.div>

			<motion.div
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.4, duration: 0.5 }}
			>
				<Typography
					variant="body1"
					sx={{
						maxWidth: '600px',
						mb: 4,
						color: theme.palette.text.secondary,
					}}
				>
					Похоже, вы пытаетесь открыть страницу, которой не существует или она была перемещена.
				</Typography>
			</motion.div>

			<motion.div
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.6, duration: 0.5 }}
			>
				<Button
					variant="contained"
					size="large"
					onClick={() => navigate('/')}
					sx={{
						px: 4,
						py: 1.5,
						borderRadius: '50px',
						fontSize: '1rem',
						fontWeight: 600,
						boxShadow: theme.shadows[2],
						'&:hover': {
							transform: 'translateY(-2px)',
							boxShadow: theme.shadows[4],
						},
						transition: 'all 0.3s ease',
					}}
				>
					Вернуться на главную
				</Button>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8, duration: 0.5 }}
				style={{ marginTop: '40px' }}
			>
				<svg
					width="200"
					height="200"
					viewBox="0 0 200 200"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z"
						fill={theme.palette.mode === 'light' ? '#E0E0E0' : '#2D3748'}
					/>
					<path
						d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z"
						fill={theme.palette.mode === 'light' ? '#F5F5F5' : '#1E1E1E'}
					/>
					<path
						d="M70 70L130 130M70 130L130 70"
						stroke={theme.palette.mode === 'light' ? '#BDBDBD' : '#4A5568'}
						strokeWidth="8"
						strokeLinecap="round"
					/>
				</svg>
			</motion.div>
		</Box>
	);
};

export default NotFound;