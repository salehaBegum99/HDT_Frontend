import API from './axios';

export const getMyApplication = async () => {
  const res = await API.get('/applications/my-application');
  return res.data;
};

export const submitApplication = async (payload) => {
  const res = await API.post('/applications/submit', payload);
  return res.data;
};
export const uploadDocuments = async (files) => {
  const formData = new FormData();

  // Append each file that exists
  Object.entries(files).forEach(([key, file]) => {
    if (file) formData.append(key, file);
  });

  const res = await API.post('/applications/upload-documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const getMyNotifications = async () => {
  const res = await API.get('/notifications');
  return res.data;
};

export const markNotificationRead = async (notificationId) => {
  const res = await API.patch(`/notifications/${notificationId}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await API.patch('/notifications/mark-all-read');
  return res.data;
};