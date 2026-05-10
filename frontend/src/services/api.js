import axios from 'axios';

// Axios instance configured with base URL and JWT token interceptor
// VITE_API_URL is set during build for deployment (e.g., https://your-backend.onrender.com/api)
// Falls back to localhost for local development
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle 401 errors (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH API ============
export const loginApi = (username, password) =>
  api.post('/auth/login', { username, password });

// ============ TRAINING CRUD API ============
export const getTrainings = () => api.get('/trainings');
export const createTraining = (data) => api.post('/trainings', data);
export const updateTraining = (id, data) => api.put(`/trainings/${id}`, data);
export const deleteTraining = (id) => api.delete(`/trainings/${id}`);

// ============ AI API ============
export const generateDescription = (title) =>
  api.post('/ai/describe', { title });

export const getRecommendations = (training) =>
  api.post('/ai/recommend', { training });

export const queryAi = (question) =>
  api.post('/ai/query', { question });

export default api;
