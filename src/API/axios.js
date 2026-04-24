import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Attach token to every request automatically (except login)
API.interceptors.request.use((config) => {
  // Skip token attachment for login endpoints
  if (config.url === '/auth/login' || config.url === '/auth/register' || config.url === '/auth/send-otp' || config.url === '/auth/verify-otp') {
    return config;
  }
  
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto refresh token if expired (but not for auth endpoints)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Skip retry logic for auth endpoints
    if (originalRequest.url.includes('/auth/')) {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh-token',
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