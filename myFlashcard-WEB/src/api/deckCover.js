import axios from './axios';

export const uploadDeckCover = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post('/api/decks/cover-upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};
