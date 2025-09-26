import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Set up axios defaults, bisa juga di file lain
axios.defaults.withCredentials = false;

// Fungsi untuk register pengguna baru
export async function register(userData) {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

// Fungsi untuk login dan menyimpan token serta data user
export async function login(credentials) {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 }); // expires in 7 days
      Cookies.set('user', JSON.stringify(response.data.user), { expires: 7 });
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

// Fungsi untuk logout dan menghapus data dari localStorage
export function logout() {
  Cookies.remove('token');
  Cookies.remove('user');
}

// Fungsi untuk mendapatkan data user dari localStorage
export function getCurrentUser() {
  const user = Cookies.get('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

// Fungsi untuk membuat header otorisasi
export function getAuthHeader() {
  const token = Cookies.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Fungsi untuk memeriksa apakah user sudah login
export function isAuthenticated() {
  return !!Cookies.get('token');
}

// Fungsi untuk memeriksa apakah user adalah admin
// Perhatikan properti 'user_level'
export function isAdmin() {
  const user = getCurrentUser();
  return user && user.user_level === 'Admin';
}

// Fungsi untuk memeriksa apakah user adalah pengguna biasa
// Perhatikan properti 'user_level'
export function isPengguna() {
  const user = getCurrentUser();
  return user && user.user_level === 'Pengguna';
}
