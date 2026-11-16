import axios from 'axios';

// Resolve API base URL: Use VITE_API_URL environment variable if set (e.g., on Vercel),
// otherwise default to relative '/api' for local Vite proxy or unified full-stack deployments
const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
const baseURL = rawApiUrl ? `${rawApiUrl}/api` : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eva_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid, clear localStorage if not on login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/login') && !currentPath.includes('/signup') && currentPath !== '/') {
        localStorage.removeItem('eva_token');
        localStorage.removeItem('eva_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
