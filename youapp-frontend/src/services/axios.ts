import axios from "axios";

const api = axios.create({
  baseURL: "https://techtest.youapp.ai",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers['x-access-token'] = token;
  }
  return config;
});

export default api;
