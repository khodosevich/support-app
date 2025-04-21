import { createContext } from 'react';
import { UserContextType } from '../types/type.ts';

export const UserContext = createContext<UserContextType>({
	user: {
		isAuth: false,
		id: 0
	},
	tickets: [],
	setUser: () => {},
	setTickets: () => {}
});
