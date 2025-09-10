import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function register(userData) {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
}

export async function login(credentials) {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.user_level === 'Admin';
}

export function isPengguna() {
  const user = getCurrentUser();
  return user && user.user_level === 'Pengguna';
}
