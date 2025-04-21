import { AssigneesItemType, AssigneesType, NewTicketType, UserConfig } from '../types/type.ts';
import api from './authMiddleware.ts';

export const methods = {
	auth: {
		async login(user: UserConfig) {
			return await api.post('/auth/login', user);
		},
		async register(user: UserConfig) {
			return await api.post('/auth/register', user);
		},
		async logout() {
			return await api.post(`/auth/logout`);
		},
	},
	tickets: {
		async getTickets() {
			return await api.get('/tickets');
		},
		async getTicketsById(id: number) {
			return await api.get(`/tickets/${id}`);
		},
		async createTicket(ticket: NewTicketType) {
			return await api.post(`/tickets`, {
				title: ticket.title,
				description: ticket.description,
			})
		},
		async deleteTicket(id: number) {
			return await api.delete(`/tickets/${id}`);
		},
		async getOldestTicket() {
			return await api.get(`/ticket/oldest`)
		},
		async getTicketsByAssignee(employee_id: number) {
			return await api.get(`/assignee/tickets/${employee_id}`);
		},
		async changeTicketStatus(ticketId: number, newStatus: string) {
			return await api.put(`/tickets/${ticketId}/status`, {
				status: newStatus
			});
		},
		updateTicket: (id: number, data: { field: string; value: any }) => {
			return api.put(`/tickets/${id}/update`, data);
		},
	},
	assignees: {
		async getAssignees() {
			return await api.get('/assignees');
		},
		async createAssignees(assignees: AssigneesType) {
			return await api.post(`/auth/register`, assignees);
		},
		async deleteAssigneesById(id: number) {
			return await api.delete(`/assignees/${id}`);
		},
		//тут id смотрю по UserId
		async getAssigneesById(id: number) {
			return await api.get(`/assignees/${id}`);
		},
		async updateAssignees(id: number, assignees: AssigneesItemType) {
			return await api.put(`/assignees/${id}`, assignees);
		}
	},
	users: {
		async deleteUser(userId: number) {
			return await api.delete(`/users/${userId}`);
		},
		async getUsers() {
			return await api.get(`/users`);
		},
		async getUserById(id: number) {
			return await api.get(`/users/${id}`);
		},
		async updateUser(userId: number, user: { username: string; email: string }) {
			return await api.put(`/users/${userId}`, user)
		},
		async updateUserRole(userId: number, newRole: string) {
			return await api.put(`/users/${userId}/role`, {
				role: newRole
			})
		},
		async updateUserPassword(userId: number, passwords: { password: string, newPassword: string }) {
			return await api.put(`/users/${userId}/password`, passwords);
		}
	},
	comments: {
		getComments: (ticketId: number) => {
			return api.get(`/tickets/${ticketId}/comments`);
		},
		addComment: (ticketId: number, data: { content: string; is_internal?: boolean }) => {
			return api.post(`/tickets/${ticketId}/comments`, data);
		}
	},
	categories: {
		getCategories: () => {
			return api.get('/ticket-categories');
		},
		createCategory: (data: { name: string; description: string; default_priority: string }) => {
			return api.post('/ticket-categories', data);
		},
		updateCategory: (id: number, data: { name: string; description: string; default_priority: string }) => {
			return api.put(`/ticket-categories/${id}`, data);
		},
		deleteCategory: (id: number) => {
			return api.delete(`/ticket-categories/${id}`);
		}
	}
};