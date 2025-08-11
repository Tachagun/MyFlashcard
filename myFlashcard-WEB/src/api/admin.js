
// Fetch all decks (admin only)
export const fetchAllDecks = async (token) => {
  const res = await axios.get('/api/admin/decks', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Fetch all flashcards (admin only)
export const fetchAllFlashcards = async (token) => {
  const res = await axios.get('/api/admin/flashcards', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Hard delete a deck (admin only)
export const hardDeleteDeck = async (deckId, token) => {
  const res = await axios.post(`/api/admin/decks/${deckId}/delete`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Hard delete a flashcard (admin only)
export const hardDeleteFlashcard = async (flashcardId, token) => {
  const res = await axios.post(`/api/admin/flashcards/${flashcardId}/delete`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
import axios from './axios';

// Fetch all deck reports (admin only)
export const fetchDeckReports = async (token) => {
  const res = await axios.get('/api/admin/reports', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Resolve a report (admin only)
export const resolveDeckReport = async (reportId, token) => {
  const res = await axios.put(`/api/admin/reports/${reportId}/resolve`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
