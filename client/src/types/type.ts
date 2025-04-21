import React, { Dispatch, SetStateAction } from 'react';

export type UserConfig = {
	username: string;
	email?: string | null;
	password: string;
}

export type FormControlType = {
	labelValue: string;
	placeholder: string;
	labelRequired: boolean;
	inputType: string;
	name: string;
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	error: string;
}

export type AlertDate = {
	isShowAlert: boolean;
	type: 'success' | 'info' | 'warning' | 'error';
	'message': string,
}

export type AlertContextType = {
	alert: AlertDate;
	setAlert: (date: AlertDate) => void;
}

export type UserDate = {
	isAuth: boolean;
	username?: string;
	email?: string;
	role?: string;
	id: number;
}

export type UserType = {
	id: number;
	username: string;
	email: string;
	created_at: string;
	role: string;
}

export type UserContextType = {
	user: UserDate;
	tickets: TicketsItemType[],
	setUser: (user: UserDate) => void;
	setTickets: (tickets: (prev) => any[]) => void;
}

export type AssigneesContextType = {
	assignees: AssigneesItemType[];
	setAssignees: (assignees: (prev) => any[]) => void;
}

export type SidebarIconType = {
	src: string;
	path: string;
	name: string;
	disabled?: boolean;
	variant?: string;
	tooltip?: string;
}

export type SidebarContextType = {
	sidebar: boolean;
	setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export type DashboardItemType = {
	title: string,
	subtitle: string,
	date: string,
	ticket_id: number,
	employee_id: number,
	name: string,
	email: string,
	username: string,
}

export interface DashboardItemData {
	title: string;
	subtitle: string;
	total: number;
	icon: string;
	items: DashboardItemType[];
	id: number;
	path: string;
	type: 'tickets' | 'assignees';
}

export type DashboardRecentTicketType = {
	ticket: {
		user: string;
		submitted: string;
		subject: string;
		ticketIssue: string;

	};
};

export type DashboardItemMiddleType = {
	subtitle: string;
	path: string;
}

export type DashboardItemHeaderType = {
	title: string;
	total: number;
	icon: string;
}

export type DashboardItemBodyType = {
	items: DashboardItemType[];
	type: string;
	src: string;
}

export type DashboardItemTicketType = {
	title: string;
	date: string;
	id: number;
}

export type TicketInfoType = {
	title: string;
	value: string;
	valueBold?: boolean;
};

export type TicketsItemType = {
	ticket_id: number;
	title: string;
	description: string;
	status: string;
	priority: string;
	category_id: number | null;
	assigned_to: { id: number; username: string } | null;
	created_by: { id: number; username: string } | null;
	created_at: string;
	resolved_at: null | string;
	estimated_time: null | string;
	actual_time: null | string;
	ai_confidence: null | number;
	attachments: null;
	username: string;
	setUpdateTicket?: Dispatch<SetStateAction<boolean>>;
	ticketUserName?: string;
}

export type AssigneesItemType = {
	avatar_url: string;
	created_at: string;
	current_workload: number;
	email: string;
	employee_id: number;
	max_workload: number;
	username: string;
	rating: string;
	skills: string[];
	specialization: string;
	role: string;
	id: number;
}

export type IconType = {
	src: string;
	bgColor?: string;
	size: number
}

export type NewTicketType = {
	title: string;
	description: string;
}

export type AssigneesType = {
	username: string;
	email: string;
	role?: string;
	password?: string;
}

export type OpenModal = {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export type UpdateAssigneesType = {
	username: string;
	email: string;
	open: boolean;
	setOpen: (open: boolean) => void;
	role: string;
	employeeid: number;
	id: number;
}

export type CommentType = {
	comment_id: number;
	ticket_id: number;
	author_id: number;
	content: string;
	created_at: string;
	is_internal: boolean;
	username?: string;
}