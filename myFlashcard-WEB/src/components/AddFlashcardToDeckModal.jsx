import React, { useEffect, useState } from 'react';
import { fetchMyFlashcards } from '../api/flashcard';

  const AddFlashcardToDeckModal = ({ open, onClose, onSelect, loading, deckFlashcardIds, token }) => {
  const [myFlashcards, setMyFlashcards] = useState([]);
  const [search, setSearch] = useState('');
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (open && token) {
      setFetching(true);
      fetchMyFlashcards(token)
        .then(data => setMyFlashcards(data.flashcards || data))
        .catch(() => setMyFlashcards([]))
        .finally(() => setFetching(false));
    }
  }, [open, token]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-base-200 p-6 rounded-xl shadow-xl w-full max-w-lg flex flex-col gap-3 max-h-[90vh] overflow-y-auto relative">
        <button
          type="button"
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="font-bold text-lg mb-2">Add Existing Flashcard</h3>
        <input
          type="text"
          className="input input-bordered w-full mb-2"
          placeholder="Search your flashcards..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {fetching ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <ul className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {myFlashcards.filter(f =>
              !deckFlashcardIds.includes(f.id) &&
              (f.question.toLowerCase().includes(search.toLowerCase()) ||
                (f.answer && f.answer.toLowerCase().includes(search.toLowerCase()))
              )
            ).map(f => (
              <li key={f.id} className="border rounded-lg p-2 flex flex-col gap-1 bg-base-100">
                <div className="font-semibold text-primary">Q: {f.question}</div>
                <div className="text-sm text-gray-700">A: {f.answer}</div>
                <button className="btn btn-xs btn-primary self-end mt-1" onClick={() => onSelect(f)}>Add to Deck</button>
              </li>
            ))}
            {myFlashcards.length === 0 && <li className="text-gray-400 italic">No flashcards found.</li>}
          </ul>
        )}
        <div className="flex gap-2 justify-end mt-2">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default AddFlashcardToDeckModal;
