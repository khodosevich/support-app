import { useState, useEffect } from 'react';
import {
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	Paper, Button, Chip, Box, Typography, useTheme
} from '@mui/material';
import { methods } from '../../api/methods';
import { AlertContextType } from '../../types/type';
import { AlertContext } from '../../utils/AlertContext';
import { useContext } from 'react';
import CategoryEditModal from './CategoryEditModal.tsx';

interface Category {
	category_id: number;
	name: string;
	description: string;
	default_priority: string;
}

const CategoriesList = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [openModal, setOpenModal] = useState(false);
	const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
	const { setAlert }: AlertContextType = useContext(AlertContext);
	const theme = useTheme();

	const fetchCategories = async () => {
		try {
			const response = await methods.categories.getCategories();
			if (response.status === 200) {
				setCategories(response.data);
			}
		}
		catch (error) {
			setAlert({ type: 'error', isShowAlert: true, message: 'Error fetching categories' });
			console.error('Error fetching categories:', error);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleEdit = (category: Category) => {
		setCurrentCategory(category);
		setOpenModal(true);
	};

	const handleCreate = () => {
		setCurrentCategory(null);
		setOpenModal(true);
	};

	const handleDelete = async (id: number) => {
		try {
			const response = await methods.categories.deleteCategory(id);
			if (response.status === 200) {
				setAlert({ type: 'success', isShowAlert: true, message: 'Category deleted successfully' });
				fetchCategories();
			}
		}
		catch (error: any) {
			const message = error.response?.data?.error || 'Error deleting category';
			setAlert({ type: 'error', isShowAlert: true, message });
			console.error('Error deleting category:', error);
		}
	};

	return (
		<Box sx={{ padding: '40px', backgroundColor: theme.palette.background.default }}>
			<Button
				variant="contained"
				color="primary"
				onClick={handleCreate}
				sx={{ mb: 2 }}
			>
				Создать категорию
			</Button>

			{categories.length > 0 ? (
				<TableContainer
					component={Paper}
					sx={{
						backgroundColor: theme.palette.background.paper,
						boxShadow: theme.shadows[1],
					}}
				>
					<Table>
						<TableHead>
							<TableRow sx={{ backgroundColor: theme.palette.background.default }}>
								<TableCell sx={{ color: theme.palette.text.primary }}>Название</TableCell>
								<TableCell sx={{ color: theme.palette.text.primary }}>Описание</TableCell>
								<TableCell sx={{ color: theme.palette.text.primary }}>Приоритет</TableCell>
								<TableCell sx={{ color: theme.palette.text.primary }}>Действия</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{categories.map((category) => (
								<TableRow
									key={category.category_id}
									sx={{ '&:hover': { backgroundColor: theme.palette.action.hover } }}
								>
									<TableCell sx={{ color: theme.palette.text.primary }}>
										{category.name}
									</TableCell>
									<TableCell sx={{
										maxWidth: "500px",
										color: theme.palette.text.secondary
									}}>
										{category.description}
									</TableCell>
									<TableCell>
										<Chip
											label={category.default_priority}
											color={
												category.default_priority === 'high' || category.default_priority === 'critical'
												? 'error'
												: category.default_priority === 'medium'
												  ? 'warning'
												  : 'success'
											}
										/>
									</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											size="small"
											onClick={() => handleEdit(category)}
											sx={{ mr: 1 }}
										>
											Изменить
										</Button>
										<Button
											variant="outlined"
											size="small"
											color="error"
											onClick={() => handleDelete(category.category_id)}
										>
											Удалить
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			) : (
				 <Typography variant="h5" sx={{ color: theme.palette.text.primary }}>
					 Нет категорий
				 </Typography>
			 )}

			<CategoryEditModal
				open={openModal}
				onClose={() => setOpenModal(false)}
				category={currentCategory}
				onSuccess={fetchCategories}
			/>
		</Box>
	);
};

export default CategoriesList;