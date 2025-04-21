import { createContext } from 'react';
import { AlertContextType } from '../types/type.ts';

export const AlertContext = createContext<AlertContextType>({
	alert: {
		isShowAlert: false,
		type: 'info',
		message: '',
	},
	setAlert: () => {},
});
