import { useContext } from 'react';
import { AlertContext } from '../utils/AlertContext.tsx';
import { Snackbar, Alert } from '@mui/material';

const CustomAlert = () => {
	const { alert, setAlert } = useContext(AlertContext);

	const handleClose = () => {
		setAlert({ ...alert, isShowAlert: false });
	};

	return (
		<Snackbar
			open={alert.isShowAlert}
			autoHideDuration={3000}
			onClose={handleClose}
			anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			sx={{ width: '100%' }}
		>
			<Alert
				variant="filled"
				severity={alert.type}
				onClose={handleClose}
				sx={{ width: '100%', maxWidth: 'calc(100% - 40px)' }}
			>
				{alert.message}
			</Alert>
		</Snackbar>
	);
};

export default CustomAlert;
