import { useState, useEffect, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl, useTheme, } from '@mui/material';
import { methods } from '../../api/methods';
import { AlertContextType } from '../../types/type';
import { AlertContext } from '../../utils/AlertContext';

interface CategoryEditModalProps {
	open: boolean;
	onClose: () => void;
	category: any;
	onSuccess: () => void;
}

const CategoryEditModal = ({ open, onClose, category, onSuccess }: CategoryEditModalProps) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [defaultPriority, setDefaultPriority] = useState('low');
	const { setAlert }: AlertContextType = useContext(AlertContext);
	const theme = useTheme();

	useEffect(() => {
		if (category) {
			setName(category.name);
			setDescription(category.description);
			setDefaultPriority(category.default_priority);
		} else {
			setName('');
			setDescription('');
			setDefaultPriority('low');
		}
	}, [category]);

	const handleSubmit = async () => {
		try {
			if (category) {
				const response = await methods.categories.updateCategory(category.category_id, {
					name,
					description,
					default_priority: defaultPriority,
				});
				if (response.status === 200) {
					setAlert({ type: 'success', isShowAlert: true, message: 'Category updated successfully' });
					onSuccess();
					onClose();
				}
			} else {
				const response = await methods.categories.createCategory({
					name,
					description,
					default_priority: defaultPriority,
				});
				if (response.status === 201) {
					setAlert({ type: 'success', isShowAlert: true, message: 'Category created successfully' });
					onSuccess();
					onClose();
				}
			}
		}
		catch (error) {
			setAlert({ type: 'error', isShowAlert: true, message: 'Error saving category' });
			console.error('Error saving category:', error);
		}
		finally {
			setName('');
			setDescription('');
			setDefaultPriority('low');
		}
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
			PaperProps={{
				sx: {
					backgroundColor: theme.palette.background.paper,
				}
			}}
		>
			<DialogTitle sx={{ color: theme.palette.text.primary }}>
				{category ? 'Изменить категорию' : 'Создать категорию'}
			</DialogTitle>
			<DialogContent>
				<TextField
					margin="normal"
					label="Название"
					fullWidth
					value={name}
					onChange={(e) => setName(e.target.value)}
					sx={{
						'& .MuiInputBase-root': {
							color: theme.palette.text.primary,
						},
						'& .MuiInputLabel-root': {
							color: theme.palette.text.secondary,
						},
					}}
				/>
				<TextField
					margin="normal"
					label="Описание"
					fullWidth
					multiline
					rows={3}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					sx={{
						'& .MuiInputBase-root': {
							color: theme.palette.text.primary,
						},
						'& .MuiInputLabel-root': {
							color: theme.palette.text.secondary,
						},
					}}
				/>
				<FormControl fullWidth margin="normal">
					<InputLabel sx={{ color: theme.palette.text.secondary }}>Приоритет</InputLabel>
					<Select
						value={defaultPriority}
						onChange={(e) => setDefaultPriority(e.target.value)}
						label="Приоритет"
						sx={{
							color: theme.palette.text.primary,
							'& .MuiOutlinedInput-notchedOutline': {
								borderColor: theme.palette.divider,
							},
						}}
					>
						<MenuItem value="low">Low</MenuItem>
						<MenuItem value="medium">Medium</MenuItem>
						<MenuItem value="high">High</MenuItem>
						<MenuItem value="critical">Critical</MenuItem>
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={onClose}
					sx={{ color: theme.palette.text.secondary }}
				>
					Отменить
				</Button>
				<Button
					onClick={handleSubmit}
					color="primary"
					variant="contained"
				>
					{category ? 'Обновить' : 'Создать'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default CategoryEditModal;