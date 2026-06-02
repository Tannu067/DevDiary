import axios from 'axios';

// attach token to every request automatically
const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('devdiary_user') || '{}');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
