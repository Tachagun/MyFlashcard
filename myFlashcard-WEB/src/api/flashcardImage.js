import axios from './axios';

export const uploadFlashcardImage = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axios.post('/api/flashcards/image-upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data; // should return { url: '...' }
};
