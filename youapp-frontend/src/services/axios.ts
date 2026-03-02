import axios from "axios";

/**
 * API Configuration
 * To switch between Local Backend and Company API:
 * 1. Open .env.local
 * 2. Update NEXT_PUBLIC_API_URL:
 *    - http://localhost:3001/api (Local Backend)
 *    - https://techtest.youapp.ai/api (Company API)
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  const isCompanyApi = config.baseURL?.includes('techtest.youapp.ai');

  if (token) {
    if (isCompanyApi) {
      // Company API strictly uses x-access-token
      config.headers['x-access-token'] = token;
    } else {
      // Local Backend uses standard Bearer token
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});


export default api;
