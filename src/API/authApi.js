import API from './axios';

export const loginUser = async ({ email, mobile, password }) => {
  const res = await API.post('/auth/login', { email, mobile, password });
  return res.data;
};

export const sendOTP = async (mobile) => {
  const res = await API.post('/auth/send-otp', { mobile });
  return res.data;
};

export const verifyOTP = async (mobile, otp) => {
  const res = await API.post('/auth/verify-otp', { mobile, otp });
  return res.data;
};

export const registerApplicant = async (formData) => {
  const res = await API.post('/auth/register', formData);
  return res.data;
};

export const logoutUser = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const res = await API.post('/auth/logout', { refreshToken });
  return res.data;
};