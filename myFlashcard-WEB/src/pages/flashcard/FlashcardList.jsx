import React, { useEffect, useState } from 'react';
import { fetchMyFlashcards, createFlashcard, updateFlashcard, deleteFlashcard } from '../../api/flashcard';
import { uploadFlashcardImage } from '../../api/flashcardImage';
import Flashcard from '../../components/Flashcard';
import FlashcardEditModal from '../../components/FlashcardEditModal';
import useAuthStore from '../../store/auth-store';
import useDocumentTitle from '../../utils/useDocumentTitle';

function FlashcardList() {
  useDocumentTitle('My Flashcards');

  const token = useAuthStore((state) => state.token);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadFlashcards = () => {
    setLoading(true);
    fetchMyFlashcards(token)
      .then(data => {
        setFlashcards(data.flashcards || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load flashcards');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!token) return;
    loadFlashcards();
    // eslint-disable-next-line
  }, [token]);

  const handleCreate = () => {
    setEditCard(null);
    setModalOpen(true);
  };

  const handleEdit = (card) => {
    setEditCard(card);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this flashcard?')) return;
    setLoading(true);
    try {
      await deleteFlashcard(id, token);
      loadFlashcards();
    } catch {
      alert('Failed to delete flashcard.');
      setLoading(false);
    }
  };

  const handleSave = async (values) => {
    setModalLoading(true);
    try {
      let questionPicUrl = values.questionPic;
      let answerPicUrl = values.answerPic;

      // If editing and no new image is selected, preserve the old image URL
      if (editCard) {
        if (!values.questionPic && editCard.questionPic) {
          questionPicUrl = editCard.questionPic;
        }
        if (!values.answerPic && editCard.answerPic) {
          answerPicUrl = editCard.answerPic;
        }
      }

      // Upload question image if it's a File
      if (values.questionPic && values.questionPic instanceof File) {
        const res = await uploadFlashcardImage(values.questionPic, token);
        questionPicUrl = res.url;
      }
      // Upload answer image if it's a File
      if (values.answerPic && values.answerPic instanceof File) {
        const res = await uploadFlashcardImage(values.answerPic, token);
        answerPicUrl = res.url;
      }

      const payload = {
        question: values.question,
        answer: values.answer,
        detail: values.detail,
        questionPic: questionPicUrl || '',
        answerPic: answerPicUrl || '',
        tags: values.tags || [],
      };

      if (editCard) {
        await updateFlashcard(editCard.id, payload, token);
      } else {
        await createFlashcard(payload, token);
      }
      setModalOpen(false);
      loadFlashcards();
    } catch {
      alert('Failed to save flashcard.');
    }
    setModalLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Flashcards</h1>
        </div>
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-center items-center py-6">
                <div className="loading loading-spinner loading-lg text-primary"></div>
                <span className="ml-3 text-lg">Loading your flashcards...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">My Flashcards</h1>
        </div>
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Flashcards</h1>
          <p className="text-sm text-gray-500">Manage your {flashcards.length} flashcard{flashcards.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Flashcard
        </button>
      </div>
      <div className="space-y-6">
      {flashcards.length === 0 ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-6">
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">No flashcards yet</h3>
            <p className="text-base-content/50 mb-4">Create your first flashcard to start studying!</p>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create Your First Flashcard
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-8">
          {flashcards.map((card) => (
            <div key={card.id} className="flex flex-col items-center gap-4">
              <Flashcard
                question={card.question}
                questionPic={card.questionPic}
                answer={card.answer}
                answerPic={card.answerPic}
                detail={card.detail}
                tags={card.tags}
              />
              <div className="flex gap-2">
                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(card)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-error" onClick={() => handleDelete(card.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal */}
      <FlashcardEditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        loading={modalLoading}
        initial={editCard}
      />
      </div>
    </div>
  );
}

export default FlashcardList;
