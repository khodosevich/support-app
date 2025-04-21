import { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Chip, Divider, useTheme } from '@mui/material';
import { AlertContext } from '../../utils/AlertContext.tsx';
import { methods } from '../../api/methods.ts';

interface Comment {
	comment_id: number;
	content: string;
	created_at: string;
	username: string;
	is_internal: boolean;
}

interface TicketCommentsProps {
	ticketId: number;
}

const TicketComments = ({ ticketId }: TicketCommentsProps) => {
	const [comments, setComments] = useState<Comment[]>([]);
	const [newComment, setNewComment] = useState('');
	const [isInternal, setIsInternal] = useState(false);
	const { setAlert } = useContext(AlertContext);
	const theme = useTheme();

	useEffect(() => {
		fetchComments();
	}, [ticketId]);

	const fetchComments = async () => {
		try {
			if (ticketId === 0) { return; }

			const response = await methods.comments.getComments(ticketId);
			if (response.status === 200) {
				setComments(response.data);
			}
		} catch (error) {
			setAlert({ type: 'error', isShowAlert: true, message: 'Error fetching comments' });
			console.error('Error fetching comments:', error);
		}
	};

	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		try {
			const response = await methods.comments.addComment(ticketId, {
				content: newComment,
				is_internal: isInternal
			});

			if (response.status === 201) {
				setNewComment('');
				setIsInternal(false);
				fetchComments();
			}
		} catch (error) {
			setAlert({ type: 'error', isShowAlert: true, message: 'Error adding comment' });
			console.error('Error adding comment:', error);
		}
	};

	return (
		<Box sx={{
			backgroundColor: theme.palette.background.paper,
			padding: '24px',
			borderRadius: '12px',
			boxShadow: theme.shadows[1],
		}}>
			<Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary }}>
				Комментарии
			</Typography>

			<Box mb={2}>
				<TextField
					fullWidth
					multiline
					rows={3}
					variant="outlined"
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					placeholder="Введите комментарий..."
					sx={{
						'& .MuiInputBase-root': {
							color: theme.palette.text.primary,
						},
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: theme.palette.divider,
						},
					}}
				/>
				<Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
					<Chip
						label="Internal"
						color={isInternal ? 'primary' : 'default'}
						onClick={() => setIsInternal(!isInternal)}
						variant={isInternal ? 'filled' : 'outlined'}
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={handleAddComment}
						disabled={!newComment.trim()}
					>
						Добавить комментарий
					</Button>
				</Box>
			</Box>

			<List>
				{comments.map((comment) => (
					<Box key={comment.comment_id}>
						<ListItem alignItems="flex-start">
							<ListItemText
								primary={
									<>
										<Typography fontWeight="bold" component="span" sx={{ color: theme.palette.text.primary }}>
											{comment.username}
										</Typography>
										{comment.is_internal && (
											<Chip
												label="Internal"
												size="small"
												sx={{ ml: 1 }}
											/>
										)}
										<Typography variant="caption" sx={{ ml: 1, color: theme.palette.text.secondary }}>
											{new Date(comment.created_at).toLocaleString()}
										</Typography>
									</>
								}
								secondary={
									<Typography sx={{ color: theme.palette.text.primary }}>
										{comment.content}
									</Typography>
								}
							/>
						</ListItem>
						<Divider
							component="li"
							sx={{ borderColor: theme.palette.divider }}
						/>
					</Box>
				))}
			</List>
		</Box>
	);
};

export default TicketComments;