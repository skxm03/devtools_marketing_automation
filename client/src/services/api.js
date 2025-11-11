import axios from 'axios';

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with defaults
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000, // 10 seconds
});

// Request interceptor (for future auth tokens)
api.interceptors.request.use(
	(config) => {
		// Add auth token here if needed in the future
		// const token = localStorage.getItem('token');
		// if (token) {
		//   config.headers.Authorization = `Bearer ${token}`;
		// }
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor (for error handling)
api.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		// Handle errors globally
		const message =
			error.response?.data?.message ||
			error.message ||
			'Something went wrong';
		console.error('API Error:', message);
		return Promise.reject(error);
	}
);

export default api;
