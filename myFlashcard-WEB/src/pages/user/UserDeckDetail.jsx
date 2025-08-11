// import StudyModeModal from '../../components/StudyModeModal';
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDeckDetail, fetchMyDecks, updateDeck, deleteDeck } from '../../api/deck';
import useAuthStore from '../../store/auth-store';
import FlashcardEditModal from '../../components/FlashcardEditModal';
import AddFlashcardToDeckModal from '../../components/AddFlashcardToDeckModal';
import { addFlashcardToDeck, removeFlashcardFromDeck } from '../../api/deckFlashcard';
import { createFlashcard, updateFlashcard } from '../../api/flashcard';
import { uploadFlashcardImage } from '../../api/flashcardImage';
import useDocumentTitle from '../../utils/useDocumentTitle';

function UserDeckDetail() {
  // const [studyModeOpen, setStudyModeOpen] = useState(false);
  const removeBtnRefs = useRef([]);
  const handleRemoveFlashcard = async (flashcardId) => {
    setActionLoading(true);
    try {
      await removeFlashcardFromDeck(flashcardId, deckId, token);
      // Refresh deck data after removal
      const data = await fetchMyDecks(token);
      const found = (data.decks || []).find(d => d.id === deckId || d.id === Number(deckId));
      if (found) setDeck(found);
    } catch {
      alert('Failed to remove flashcard from deck.');
    }
    setActionLoading(false);
  };
  const { deckId } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFlashcard, setEditFlashcard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addExistingOpen, setAddExistingOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Dynamic title based on deck name
  useDocumentTitle(deck ? `Edit: ${deck.title}` : 'Edit Deck');

  useEffect(() => {
    if (!deckId || !token) return;
    setLoading(true);
    fetchMyDecks(token)
      .then(data => {
        // Find the deck by id from user's own decks
        const found = (data.decks || []).find(d => d.id === deckId || d.id === Number(deckId));
        if (found) {
          setDeck(found);
        } else {
          setError('Deck not found or not owned by you.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load deck');
        setLoading(false);
      });
  }, [deckId, token, modalOpen]);

  const handleEditFlashcard = (flashcard) => {
    setEditFlashcard(flashcard);
    setModalOpen(true);
  };

  const handleAddFlashcard = () => {
    setAddExistingOpen(true);
  };

  const handleAddExisting = async (flashcard) => {
    setActionLoading(true);
    try {
      await addFlashcardToDeck(flashcard.id, deckId, token);
      // Refresh deck data after adding
      const data = await fetchMyDecks(token);
      const found = (data.decks || []).find(d => d.id === deckId || d.id === Number(deckId));
      if (found) setDeck(found);
      // Do NOT close modal here
    } catch {
      alert('Failed to add flashcard to deck.');
    }
    setActionLoading(false);
  };

  // Save logic for flashcard (create or update)
  const handleSaveFlashcard = async (values) => {
    setActionLoading(true);
    try {
      let questionPicUrl = values.questionPic;
      let answerPicUrl = values.answerPic;
      // If file objects, upload them
      if (values.questionPic && values.questionPic instanceof File) {
        const res = await uploadFlashcardImage(values.questionPic, token);
        questionPicUrl = res.url || res;
      }
      if (values.answerPic && values.answerPic instanceof File) {
        const res = await uploadFlashcardImage(values.answerPic, token);
        answerPicUrl = res.url || res;
      }
      const payload = {
        ...values,
        questionPic: questionPicUrl || '',
        answerPic: answerPicUrl || '',
      };
      if (editFlashcard && editFlashcard.id) {
        // Update existing flashcard
        await updateFlashcard(editFlashcard.id, payload, token);
      } else {
        // Create new flashcard and add to deck
        const newCard = await createFlashcard(payload, token);
        await addFlashcardToDeck(newCard.id, deckId, token);
      }
      // Refresh deck data after save
      const data = await fetchMyDecks(token);
      const found = (data.decks || []).find(d => d.id === deckId || d.id === Number(deckId));
      if (found) setDeck(found);
      setModalOpen(false);
    } catch (err) {
      // Show more specific error messages
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || 'Failed to save flashcard.';
      if (status === 409) {
        alert('This flashcard is already in the deck.');
      } else if (status === 400 && msg.includes('Invalid flashcard or deck ID')) {
        alert('Invalid flashcard or deck ID. Please try again.');
      } else {
        alert(msg);
      }
    }
    setActionLoading(false);
  };

  if (loading) return <div className="text-center py-4">Loading deck...</div>;
  if (error) return <div className="text-center text-error py-4">{error}</div>;
  if (!deck) return <div className="text-center py-4">Deck not found.</div>;

  const isOwner = true;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <button className="btn btn-sm mb-4" onClick={() => navigate('/profile/decks')}>&larr; Back</button>
      <div className="flex justify-end mb-4">
        <button className="btn btn-accent btn-sm" onClick={() => navigate(`/decks/${deckId}/study`)}>Study Mode</button>
      </div>
      <div className="bg-white dark:bg-base-200 rounded-2xl shadow-lg border border-gray-200 dark:border-base-300 p-6 mb-6">
        {deck.coverImage && deck.coverImage.trim() !== '' && (
          <div className="w-full flex justify-center mb-4">
            <img
              src={deck.coverImage}
              alt="Deck Cover"
              className="w-full max-w-lg h-48 object-cover rounded-xl border border-base-300 shadow"
              style={{ background: '#f3f4f6' }}
            />
          </div>
        )}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h2 className="text-3xl font-black text-primary mr-2">{deck.title}</h2>
          {deck.category?.name && (
            <span className="badge badge-info text-xs font-semibold px-2 py-1 rounded-md">{deck.category.name}</span>
          )}
          {deck.isPublic === false && <span className="badge badge-warning">Private</span>}
        </div>
        <div className="text-base text-gray-700 dark:text-gray-200 mb-2">
          {deck.description || <span className="italic text-gray-400">No description</span>}
        </div>
        <div className="flex justify-end items-end mt-2 gap-2">
          <div className="badge badge-outline px-3 py-1 rounded-lg text-gray-700 dark:text-gray-200 font-semibold">
            {Array.isArray(deck.flashcards) ? deck.flashcards.length : 0} cards
          </div>
        </div>
      </div>
      {/* Flashcards List */}
      <div className="bg-base-100 rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Flashcards</h3>
          <div className="flex gap-2">
            {isOwner && (
              <>
                <button className="btn btn-primary btn-sm" onClick={() => setModalOpen(true)}>+ Create New</button>
                <button className="btn btn-outline btn-sm" onClick={handleAddFlashcard}>Add Existing</button>
              </>
            )}
          </div>
        </div>
      {/* StudyModeModal removed: now use dedicated StudyDeckPage */}
        {deck.flashcards && deck.flashcards.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {deck.flashcards.map(card => (
              <li
                key={card.flashcard?.id || card.id}
                className="relative rounded-2xl shadow-xl border border-base-300 p-6 flex flex-col gap-3 bg-white/60 dark:bg-base-200/70 backdrop-blur-md transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl group overflow-hidden"
              >
                <span className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-primary to-blue-400 rounded-l-2xl opacity-70 group-hover:opacity-100 transition-all"></span>
                <div className="font-bold text-lg text-primary mb-1 drop-shadow-sm flex items-center gap-2">
                  Q: {card.flashcard?.question}
                </div>
                <div className="text-base text-gray-700 dark:text-gray-200 mb-2 font-medium bg-blue-50/60 dark:bg-blue-900/30 rounded px-2 py-1 shadow-inner">
                  <span className="text-blue-500 font-bold">A:</span> {card.flashcard?.answer}
                </div>
                {card.flashcard?.detail && (
                  <div className="text-xs text-gray-500 italic mt-1">{card.flashcard.detail}</div>
                )}
                {isOwner && (
                  <div className="flex gap-2 mt-2 self-end">
                    <button className="btn btn-xs btn-outline" onClick={() => handleEditFlashcard(card.flashcard)}>Edit</button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleRemoveFlashcard(card.flashcard?.id || card.id)}
                      disabled={actionLoading}
                      title="Remove from deck"
                    >Remove</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 italic">No flashcards in this deck.</div>
        )}
      </div>
      <FlashcardEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveFlashcard}
        initial={editFlashcard}
        loading={actionLoading}
      />
      <AddFlashcardToDeckModal
        open={addExistingOpen}
        onClose={() => setAddExistingOpen(false)}
        onSelect={handleAddExisting}
        loading={actionLoading}
        deckFlashcardIds={deck.flashcards ? deck.flashcards.map(f => f.flashcard?.id || f.id) : []}
        token={token}
      />

    </div>
  );
}

export default UserDeckDetail;
