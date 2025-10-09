import axios from 'axios';

const base = import.meta.env.VITE_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export const makeRequest = axios.create({
  baseURL: base.replace(/\/$/, ''), // trim trailing slash
});

// attach JWT from localStorage on each request (if present)
makeRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default makeRequest;
