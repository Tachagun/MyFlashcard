import axios from './axios';


// Fetch all flashcards for the current user
export const fetchMyFlashcards = async (token) => {
  const res = await axios.get('/api/flashcards/', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Create a new flashcard
export const createFlashcard = async (data, token) => {
  const res = await axios.post('/api/flashcards/', data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Update a flashcard
export const updateFlashcard = async (id, data, token) => {
  const res = await axios.put(`/api/flashcards/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Delete a flashcard
export const deleteFlashcard = async (id, token) => {
  const res = await axios.delete(`/api/flashcards/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
