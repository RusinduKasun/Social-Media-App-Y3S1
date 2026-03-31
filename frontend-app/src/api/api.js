import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

// Posts API
export const getPosts = (page = 1, limit = 10) =>
  API.get(`/posts?page=${page}&limit=${limit}`);

export const getPostById = (id) => API.get(`/posts/${id}`);

export const getPostsByUser = (userId) => API.get(`/posts/user/${userId}`);

export const createPost = (formData) =>
  API.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const updatePost = (id, formData) =>
  API.put(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deletePost = (id) => API.delete(`/posts/${id}`);

export const toggleLike = (id) => API.post(`/posts/${id}/like`);

export const addComment = (id, text) =>
  API.post(`/posts/${id}/comment`, { text });

export default API;
