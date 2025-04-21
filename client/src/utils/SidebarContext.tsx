import { createContext } from 'react';
import { SidebarContextType } from '../types/type.ts';

export const SidebarContext = createContext<SidebarContextType>({
	sidebar: false,
	setSidebar: () => {}
});
