// Auth service
import api from './api';

export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user));
  return res.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => !!localStorage.getItem('token');


