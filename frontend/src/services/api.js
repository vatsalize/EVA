import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
