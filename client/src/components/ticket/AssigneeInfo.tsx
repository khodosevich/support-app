import { Box, Typography, Chip, useTheme } from '@mui/material';

const statusColors: Record<string, 'default' | 'info' | 'warning' | 'success' | 'error'> = {
	new: 'default',
	assigned: 'info',
	in_progress: 'warning',
	resolved: 'success',
	closed: 'error',
};

const priorityColors: Record<string, 'default' | 'info' | 'warning' | 'error'> = {
	low: 'default',
	medium: 'info',
	high: 'warning',
	critical: 'error',
};

const statusLabelMap: Record<string, string> = {
	new: 'Новая',
	assigned: 'Назначена',
	in_progress: 'В работе',
	resolved: 'Решена',
	closed: 'Закрыта',
};

const priorityLabelMap: Record<string, string> = {
	low: 'Низкий',
	medium: 'Средний',
	high: 'Высокий',
	critical: 'Критичный',
};

const AssigneeInfo = ({ title, value, isStatus = false, isPriority = false }: {
	title: string;
	value: string;
	isStatus?: boolean;
	isPriority?: boolean;
}) => {
	const theme = useTheme();
	const lowerValue = value?.toLowerCase?.();

	const chipColor = isStatus
	                  ? statusColors[lowerValue]
	                  : isPriority
	                    ? priorityColors[lowerValue]
	                    : undefined;

	const chipLabel = isStatus
	                  ? statusLabelMap[lowerValue] ?? value
	                  : isPriority
	                    ? priorityLabelMap[lowerValue] ?? value
	                    : value;

	return (
		<Box mb={2}>
			<Typography sx={{
				fontWeight: 'bold',
				mb: 0.5,
				color: theme.palette.text.primary,
			}}>
				{title}
			</Typography>
			{(isStatus || isPriority) && lowerValue in (isStatus ? statusColors : priorityColors) ? (
				<Chip
					label={chipLabel}
					color={chipColor}
					variant="outlined"
					sx={{
						fontSize: '1rem',
						height: '32px',
						padding: '0 12px',
						fontWeight: 'bold',
						letterSpacing: '0.5px',
					}}
				/>
			) : (
				 <Typography sx={{ color: theme.palette.text.primary }}>
					 {value}
				 </Typography>
			 )}
		</Box>
	);
};

export default AssigneeInfo;