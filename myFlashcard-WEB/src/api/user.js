export const uploadProfilePic = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post('/api/users/me/profile-pic', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
import axios from './axios';

export const getMe = async (token) => {
  const res = await axios.get('/api/users/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const updateMe = async (data, token) => {
  const res = await axios.put('/api/users/me', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
