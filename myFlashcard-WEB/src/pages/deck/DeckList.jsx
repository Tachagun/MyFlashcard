import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPublicDecks } from '../../api/deck';
import axios from '../../api/axios';
import useAuthStore from '../../store/auth-store';
import useDocumentTitle from '../../utils/useDocumentTitle';


function DeckList() {
  useDocumentTitle('Browse Decks');

  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportingId, setReportingId] = useState(null);
  const [reportText, setReportText] = useState("");
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    fetchPublicDecks()
      .then(data => {
        setDecks(data.decks || data); // support both {decks:[]} and []
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load decks');
        setLoading(false);
      });
  }, []);

  // Like handler
  const handleLike = async (deckId) => {
    if (!token) return;
    setDecks(decks => decks.map(deck =>
      deck.id === deckId
        ? { ...deck, likes: deck.likes?.length && deck.likes.some(l => l.userId === (useAuthStore.getState().user?.id))
            ? deck.likes.filter(l => l.userId !== useAuthStore.getState().user?.id)
            : [...(deck.likes || []), { userId: useAuthStore.getState().user?.id }] }
        : deck
    ));
    try {
      await axios.post(`/api/decks/${deckId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      // revert optimistic update on error
      setDecks(await fetchPublicDecks().then(data => data.decks || data));
    }
  };

  // Report handler
  const handleReport = async (deckId) => {
    if (!token || !reportText.trim()) return;
    try {
      await axios.post(`/api/decks/${deckId}/report`, { reportReason: reportText, reportDetail: "" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReportingId(null);
      setReportText("");
      alert("Report submitted!");
    } catch (e) {
      alert("Failed to report deck.");
    }
  };

  if (loading) return <div className="text-center py-4">Loading decks...</div>;
  if (error) return <div className="text-center text-error py-4">{error}</div>;

  return (
    <div className="w-full mx-auto px-4">
      <div className="flex justify-center mb-8 mt-4">
        <h2 className="text-4xl font-black text-center text-primary tracking-tight relative inline-block">
          🌐 Public Decks
          <span className="block w-2/3 mx-auto h-1 mt-2 bg-gradient-to-r from-primary to-blue-400 rounded-full"></span>
        </h2>
      </div>
      {decks.length === 0 ? (
        <div className="text-center text-lg text-gray-400">No public decks found.</div>
      ) : (
        <div className="w-full flex justify-center">
          <div className="flex flex-wrap justify-center" style={{width: '100%'}}>
            {decks.map((deck, idx) => {
              const liked = isAuthenticated && deck.likes?.some(l => l.userId === useAuthStore.getState().user?.id);
              return (
                <div
                  key={deck.id}
                  className="bg-white dark:bg-base-200 rounded-2xl shadow-lg border border-gray-200 dark:border-base-300 p-6 flex flex-col gap-3 hover:shadow-2xl transition-shadow duration-200 group cursor-pointer"
                  style={{minWidth: '260px', maxWidth: '380px', width: '100%', margin: '0 12px 32px 12px'}}
                >
                  <div className="w-full flex justify-center mb-2">
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
                    </div>
                  </div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Link
                  to={`/decks/${deck.id}`}
                  className="text-2xl font-extrabold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-150 hover:underline"
                >
                  {deck.title}
                </Link>
                {deck.category?.name && (
                  <span className="badge badge-info text-xs font-semibold px-2 py-1 rounded-md">
                    {deck.category.name}
                  </span>
                )}
                {deck.isPublic === false && (
                  <span className="badge badge-warning">Private</span>
                )}
              </div>
              <div className="text-base text-gray-700 dark:text-gray-200 min-h-[2.5rem]">
                {deck.description || <span className="italic text-gray-400">No description</span>}
              </div>
              <div className="flex justify-between items-end mt-2 gap-2">
                <div className="text-xs text-gray-500 dark:text-gray-300 font-medium">
                  By: {deck.owner?.username || 'Unknown'}
                </div>
                <div className="badge badge-outline px-3 py-1 rounded-lg text-gray-700 dark:text-gray-200 font-semibold">
                  {Array.isArray(deck.flashcards) ? deck.flashcards.length : 0} cards
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  className={`btn btn-sm flex items-center gap-1 ${isAuthenticated ? (liked ? 'btn-primary' : 'btn-outline-primary') : 'btn-disabled btn-outline-primary opacity-60 cursor-not-allowed'}`}
                  onClick={isAuthenticated ? () => handleLike(deck.id) : undefined}
                  disabled={!isAuthenticated}
                  tabIndex={isAuthenticated ? 0 : -1}
                  aria-disabled={!isAuthenticated}
                >
                  <span>{liked ? '♥' : '♡'}</span> Like {deck.likes?.length || 0}
                </button>
                {isAuthenticated && (
                  <button
                    className="btn btn-sm btn-outline btn-error"
                    onClick={() => setReportingId(deck.id)}
                  >
                    Report
                  </button>
                )}
              </div>
              {/* Report Modal */}
              {reportingId === deck.id && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white dark:bg-base-200 p-6 rounded-xl shadow-xl w-full max-w-xs flex flex-col gap-3">
                    <h3 className="font-bold text-lg mb-2">Report Deck</h3>
                    <textarea
                      className="textarea textarea-bordered"
                      rows={3}
                      placeholder="Reason for report..."
                      value={reportText}
                      onChange={e => setReportText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <button className="btn btn-sm btn-ghost" onClick={() => setReportingId(null)}>Cancel</button>
                      <button className="btn btn-sm btn-error" onClick={() => handleReport(deck.id)}>Submit</button>
                    </div>
                  </div>
                </div>
              )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeckList;