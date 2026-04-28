import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/auth/refresh-token`,
          { refreshToken }
        );
        const newToken = res.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default API;