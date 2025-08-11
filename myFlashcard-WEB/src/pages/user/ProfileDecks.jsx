import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyDecks, updateDeck, deleteDeck } from '../../api/deck';
import ProfileEditDeckModal from '../../components/ProfileEditDeckModal';
import useAuthStore from '../../store/auth-store';
import useDocumentTitle from '../../utils/useDocumentTitle';

const ProfileDecks = () => {
  useDocumentTitle('My Decks');

  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDeck, setEditDeck] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteDeckId, setDeleteDeckId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchMyDecks(token)
      .then((data) => {
        setDecks(data.decks || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load decks.');
        setLoading(false);
      });
  }, [token]);

  // Edit deck handler
  const handleEdit = (deck) => setEditDeck(deck);
  const handleEditSave = async (values) => {
    setEditLoading(true);
    try {
      await updateDeck(editDeck.id, values, token);
      setEditDeck(null);
      // Refresh decks
      const data = await fetchMyDecks(token);
      setDecks(data.decks || []);
    } catch (e) {
      alert('Failed to update deck.');
    }
    setEditLoading(false);
  };
  // Delete deck handler
  const handleDelete = (deckId) => setDeleteDeckId(deckId);
  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteDeck(deleteDeckId, token);
      setDeleteDeckId(null);
      // Refresh decks
      const data = await fetchMyDecks(token);
      setDecks(data.decks || []);
    } catch (e) {
      alert('Failed to delete deck.');
    }
    setDeleteLoading(false);
  };

  const cancelDelete = () => setDeleteDeckId(null);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Decks</h1>
          <p className="text-sm text-gray-500">Manage your {decks.length} deck{decks.length !== 1 ? 's' : ''}</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/profile/create')}
        >
          Create New Deck
        </button>
      </div>
      <div className="space-y-6">
      {/* Search Section */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Search & Filter</h3>
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              placeholder="Search decks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-center items-center py-6">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <span className="ml-3 text-lg">Loading your decks...</span>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          </div>
        </div>
      ) : decks.length === 0 ? (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body text-center py-6">
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">No decks yet</h3>
            <p className="text-base-content/50 mb-4">Create your first deck to get started!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/profile/create')}
            >
              Create Your First Deck
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.filter(deck =>
            deck.title.toLowerCase().includes(search.toLowerCase()) ||
            (deck.description && deck.description.toLowerCase().includes(search.toLowerCase()))
          ).map((deck) => (
            <div key={deck.id} className="card bg-base-100 shadow-md border border-base-200 p-4 flex flex-col gap-3 mx-auto" style={{minWidth: '260px', maxWidth: '380px', width: '100%'}}>
              <div className="w-full flex justify-center relative">
                <div className="w-full bg-base-200 rounded-xl overflow-hidden border border-base-300 flex items-center justify-center relative" style={{height: '220px'}}>
                  {deck.coverImage && deck.coverImage.trim() !== '' ? (
                    <img
                      src={deck.coverImage}
                      alt={deck.title + ' cover'}
                      className="object-cover w-full h-full"
                      style={{height: '100%', width: '100%', objectFit: 'cover', display: 'block'}}
                    />
                  ) : (
                    <span className="text-gray-400 text-lg">No Cover</span>
                  )}
                  <span className="absolute top-2 right-2 bg-primary text-primary-content text-xs px-2 py-1 rounded-full z-10">
                    {deck.category?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>
              <div className="font-bold text-lg mb-1 truncate" title={deck.title}>{deck.title}</div>
              <div className="text-gray-500 text-sm mb-2 truncate" title={deck.description}>{deck.description}</div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-2 px-2 py-1 rounded-lg" style={{background: 'rgba(100,116,139,0.18)', border: '1px solid #64748b'}}>
                  <span className="font-medium text-gray-300">Private</span>
                  <label className="swap swap-rotate">
                    <input
                      type="checkbox"
                      checked={deck.isPublic}
                      onChange={async (e) => {
                        try {
                          await updateDeck(deck.id, { isPublic: e.target.checked }, token);
                          // Refresh decks
                          const data = await fetchMyDecks(token);
                          setDecks(data.decks || []);
                        } catch {
                          alert('Failed to update public/private status.');
                        }
                      }}
                      className="toggle toggle-primary toggle-sm border border-primary"
                    />
                  </label>
                  <span className="font-medium text-primary-content">Public</span>
                </span>
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="btn btn-sm btn-outline" onClick={() => navigate(`/profile/decks/${deck.id}`)}>View</button>
                <button className="btn btn-sm btn-primary" onClick={() => handleEdit(deck)}>Edit</button>
                <button className="btn btn-sm btn-error" onClick={() => handleDelete(deck.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modals */}
      <ProfileEditDeckModal
        deck={editDeck}
        onClose={() => setEditDeck(null)}
        onSave={handleEditSave}
        loading={editLoading}
      />
      {/* Delete confirmation modal can be added here if needed */}
      </div>
    </div>
  );
};

export default ProfileDecks;
