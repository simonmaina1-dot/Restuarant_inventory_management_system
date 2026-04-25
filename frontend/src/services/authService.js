import api from './api.js';

export async function loginUser(username, password) {
  const response = await api.post('/auth/login', { username, password });
  if (response.access_token) {
    localStorage.setItem('token', response.access_token);
    return response;
  }
  throw new Error('Login failed: no access token returned');
}

export async function changePassword(currentPassword, newPassword) {
  const response = await api.put('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
  });
  return response;
}

