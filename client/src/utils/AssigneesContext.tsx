import { createContext } from 'react';
import { AssigneesContextType, AssigneesItemType } from '../types/type.ts';

export const AssigneesContext = createContext<AssigneesContextType>({
	assignees: [] as AssigneesItemType[],
	setAssignees: () => {},
});
