// Update a deck
export const updateDeck = async (deckId, deckData, token) => {
  const res = await axios.put(`/api/decks/${deckId}`, deckData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Delete (soft-delete) a deck
export const deleteDeck = async (deckId, token) => {
  const res = await axios.delete(`/api/decks/${deckId}/soft-delete`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
import axios from './axios';

// Fetch all public decks
export const fetchPublicDecks = async () => {
  const res = await axios.get('/api/decks/');
  return res.data;
};

// Fetch a single deck by ID (with flashcards)
export const fetchDeckDetail = async (deckId) => {
  const res = await axios.get(`/api/decks/${deckId}`);
  return res.data;
};

// Like a deck
export const likeDeck = async (deckId, token) => {
  return axios.post(`/api/decks/${deckId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Report a deck
export const reportDeck = async (deckId, reportReason, token) => {
  return axios.post(`/api/decks/${deckId}/report`, { reportReason, reportDetail: '' }, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Fetch all decks owned by the current user
export const fetchMyDecks = async (token) => {
  const res = await axios.get('/api/decks/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

// Create a new deck
export const createDeck = async (deckData, token) => {
  const res = await axios.post('/api/decks', deckData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
