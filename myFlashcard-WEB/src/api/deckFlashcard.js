// Remove a flashcard from a deck
export const removeFlashcardFromDeck = async (flashcardId, deckId, token) => {
  const res = await axios.delete(`/api/flashcards/${flashcardId}/decks/${deckId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
import axios from './axios';

// Add an existing flashcard to a deck
export const addFlashcardToDeck = async (flashcardId, deckId, token) => {
  const res = await axios.post(`/api/flashcards/${flashcardId}/decks/${deckId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
