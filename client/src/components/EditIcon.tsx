import { Box, useTheme } from '@mui/material';
import editIcon from '../../public/icon/edit.svg';

const EditIcon = () => {
	const theme = useTheme();

	return (
		<Box sx={{
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: '50px',
			height: '50px',
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: '50%',
			transition: 'background-color .3s ease-in-out',
			'&:hover': {
				backgroundColor: theme.palette.action.hover,
			},
			cursor: 'pointer',
		}}>
			<img
				src={editIcon}
				alt=""
				width={"24px"}
				height={"24px"}
				style={{
					filter: theme.palette.mode === 'dark' ? 'invert(1)' : 'none'
				}}
			/>
		</Box>
	);
};

export default EditIcon;