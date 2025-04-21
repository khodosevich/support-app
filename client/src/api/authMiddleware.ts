import axios from 'axios';

const API_URL = 'http://localhost:5001';

const api = axios.create({
	baseURL: API_URL,
	headers: {
		['Content-Type']: 'application/json; charset=utf8',
	},
});

api.interceptors.request.use((config) => {
	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');

	if (config.url?.includes('/auth/refresh') || config.url?.includes('/auth/logout')) {
		if (refreshToken) {
			config.headers.Authorization = `Bearer ${refreshToken}`;
		}
		return config;
	}

	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = localStorage.getItem('refreshToken');
				const { data } = await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken });

				localStorage.setItem('accessToken', data.accessToken);
				localStorage.setItem('refreshToken', data.refreshToken);

				originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
				return api(originalRequest);
			} catch (error) {
				console.error('Token refresh failed:', error);

				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				window.location.href = '/login';
			}
		}

		return Promise.reject(error);
	},
);

export default api;
