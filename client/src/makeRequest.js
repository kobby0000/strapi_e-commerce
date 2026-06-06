import axios from 'axios';
import { API_URL } from './config/env';

export const makeRequest = axios.create({
  baseURL: API_URL,
});

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
