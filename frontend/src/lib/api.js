import axios from 'axios';
import { getAuthHeader } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Set up axios defaults
axios.defaults.withCredentials = false;

export const fetcher = axios.create({
  baseURL: API_URL,
});

fetcher.interceptors.request.use(
  (config) => {
    const headers = getAuthHeader();
    if (headers.Authorization) {
      config.headers.Authorization = headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export async function login(credentials) {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}

export async function register(userData) {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
}

export async function logout() {
  const headers = getAuthHeader();
  await axios.post(`${API_URL}/logout`, {}, { headers });
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Pakaian APIs
export async function getPakaian(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_URL}/pakaian?${queryString}` : `${API_URL}/pakaian`;
  const response = await axios.get(url);
  // Handle paginated responses (Laravel pagination)
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  // Handle both direct data and wrapped data responses
  return Array.isArray(response.data) ? response.data : [];
}

export async function getPakaianById(id) {
  const response = await axios.get(`${API_URL}/pakaian/${id}`);
  // Handle both direct data and wrapped data responses
  return response.data.data || response.data;
}

export async function getKategoriPakaian() {
  const response = await axios.get(`${API_URL}/kategori-pakaian`);
  // Handle both direct data and wrapped data responses
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return Array.isArray(response.data) ? response.data : [];
}

export async function getMetodePembayaran() {
  const headers = getAuthHeader();
  const response = await axios.get(`${API_URL}/metode-pembayaran`, { headers });
  // Handle both direct data and wrapped data responses
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return Array.isArray(response.data) ? response.data : [];
}

export async function createMetodePembayaran(metodeData) {
  const headers = getAuthHeader();
  const response = await axios.post(`${API_URL}/metode-pembayaran`, metodeData, { headers });
  return response.data;
}



// Pembelian APIs
export async function createPembelian(pembelianData) {
  const headers = getAuthHeader();
  // Transform data to match backend structure
  const transformedData = {
    alamat: pembelianData.alamat,
    metode_pembayaran_id: pembelianData.metode_pembayaran_id,
    catatan: pembelianData.catatan,
    items: pembelianData.items.map(item => ({
      pakaian_id: item.pakaian_id || item.id,
      jumlah: item.jumlah || item.quantity
    }))
  };
  const response = await axios.post(`${API_URL}/pembelian`, transformedData, { headers });
  return response.data;
}

export async function getPembelian(params = {}) {
  const headers = getAuthHeader();
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_URL}/pembelian?${queryString}` : `${API_URL}/pembelian`;
  const response = await axios.get(url, { headers });
  return response.data;
}

export async function getPembelianById(id) {
  const headers = getAuthHeader();
  const response = await axios.get(`${API_URL}/pembelian/${id}`, { headers });
  return response.data;
}

export async function updateAkun(akunData) {
  const headers = getAuthHeader();
  const response = await axios.put(`${API_URL}/akun`, akunData, { headers });
  return response.data;
}

// Admin APIs
export async function getAdminPakaian(params = {}) {
  const headers = getAuthHeader();
  const response = await axios.get(`${API_URL}/admin/pakaian`, { headers, params });
  return response.data;
}

export async function getAdminPakaianById(id) {
  const headers = getAuthHeader();
  const response = await axios.get(`${API_URL}/admin/pakaian/${id}`, { headers });
  return response.data;
}

export async function createPakaian(pakaianData) {
  const headers = getAuthHeader();
  const response = await axios.post(`${API_URL}/admin/pakaian`, pakaianData, { headers });
  return response.data;
}

export async function updatePakaian(id, pakaianData) {
  const headers = getAuthHeader();
  const response = await axios.put(`${API_URL}/admin/pakaian/${id}`, pakaianData, { headers });
  return response.data;
}

export async function deletePakaian(id) {
  const headers = getAuthHeader();
  const response = await axios.delete(`${API_URL}/admin/pakaian/${id}`, { headers });
  return response.data;
}

export async function createKategoriPakaian(kategoriData) {
  const headers = getAuthHeader();
  const response = await axios.post(`${API_URL}/admin/kategori-pakaian`, kategoriData, { headers });
  return response.data;
}

export async function updateKategoriPakaian(id, kategoriData) {
  const headers = getAuthHeader();
  const response = await axios.put(`${API_URL}/admin/kategori-pakaian/${id}`, kategoriData, { headers });
  return response.data;
}

export async function deleteKategoriPakaian(id) {
  const headers = getAuthHeader();
  const response = await axios.delete(`${API_URL}/admin/kategori-pakaian/${id}`, { headers });
  return response.data;
}

export async function getAdminPembelian(params = {}) {
  const headers = getAuthHeader();
  const response = await axios.get(`${API_URL}/admin/pembelian`, { headers, params });
  return response.data;
}

export async function getAdminPembelianById(id) {
  const headers = getAuthHeader();
  const response = await axios.get(`${API_URL}/admin/pembelian/${id}`, { headers });
  return response.data;
}

export async function updatePembelianStatus(id, statusData) {
  const headers = getAuthHeader();
  const response = await axios.put(`${API_URL}/admin/pembelian/${id}/status`, statusData, { headers });
  return response.data;
}

export async function createAdminPembelian(pembelianData) {
  const headers = getAuthHeader();
  const response = await axios.post(`${API_URL}/admin/pembelian`, pembelianData, { headers });
  return response.data;
}

export async function updateAdminPembelian(id, pembelianData) {
  const headers = getAuthHeader();
  const response = await axios.put(`${API_URL}/admin/pembelian/${id}`, pembelianData, { headers });
  return response.data;
}

export async function deleteAdminPembelian(id) {
  const headers = getAuthHeader();
  const response = await axios.delete(`${API_URL}/admin/pembelian/${id}`, { headers });
  return response.data;
}

// Admin User APIs
export async function getAdminUsers() {
  const headers = getAuthHeader();
  const response = await axios.get(`${API_URL}/admin/users`, { headers });
  return response.data;
}

export async function createAdminUser(userData) {
  const headers = getAuthHeader();
  const response = await axios.post(`${API_URL}/admin/users`, userData, { headers });
  return response.data;
}

export async function updateAdminUser(id, userData) {
  const headers = getAuthHeader();
  const response = await axios.put(`${API_URL}/admin/users/${id}`, userData, { headers });
  return response.data;
}

export async function deleteAdminUser(id) {
  const headers = getAuthHeader();
  const response = await axios.delete(`${API_URL}/admin/users/${id}`, { headers });
  return response.data;
}

// Admin Stats
export async function getAdminStats() {
  const headers = getAuthHeader();
  const response = await axios.get(`${API_URL}/admin/stats`, { headers });
  return response.data;
}
