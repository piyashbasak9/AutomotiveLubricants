import axios from 'axios';
import { getToken } from '../utils/storage';
import { Platform } from 'react-native';

// Your computer's correct local IP (obtained from ip addr show)
const COMPUTER_IP = '192.168.0.110';   // ← use this IP
const BASE_URL = `http://${COMPUTER_IP}:8000`;

console.log('API BASE_URL set to:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Attach request log and auth token
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API request ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;