const API_BASE = '/api';

const api = {
  get: async (endpoint) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    if (!response.ok) {
      throw new Error(`API ${response.status}: ${await response.text()}`);
    }
    return response.json();
  },
  post: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API ${response.status}: ${await response.text()}`);
    }
    return response.json();
  },
  put: async (endpoint, data) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API ${response.status}: ${await response.text()}`);
    }
    return response.json();
  },
  delete: async (endpoint) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    });
    if (!response.ok) {
      throw new Error(`API ${response.status}: ${await response.text()}`);
    }
    if (response.status === 204) {
      return null;
    }
    return response.json();
  }
};

export default api;

