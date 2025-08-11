import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDeckDetail, likeDeck, reportDeck } from '../../api/deck';
import useAuthStore from '../../store/auth-store';
import useDocumentTitle from '../../utils/useDocumentTitle';

function DeckDetail() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reporting, setReporting] = useState(false);
  const [reportText, setReportText] = useState('');
  const [likeLoading, setLikeLoading] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // Dynamic title based on deck name
  useDocumentTitle(deck ? `${deck.title}` : 'Deck Details');

  useEffect(() => {
    fetchDeckDetail(deckId)
      .then(data => {
        setDeck(data.deck || data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load deck');
        setLoading(false);
      });
  }, [deckId]);

  const liked = isAuthenticated && deck?.likes?.some(l => l.userId === user?.id);

  const handleLike = async () => {
    if (!isAuthenticated || !deck) return;
    setLikeLoading(true);
    try {
      await likeDeck(deck.id, token);
      // Refetch deck detail for updated likes
      const data = await fetchDeckDetail(deckId);
      setDeck(data.deck || data);
    } catch {}
    setLikeLoading(false);
  };

  const handleReport = async () => {
    if (!isAuthenticated || !reportText.trim()) return;
    try {
      await reportDeck(deck.id, reportText, token);
      setReporting(false);
      setReportText('');
      alert('Report submitted!');
    } catch {
      alert('Failed to report deck.');
    }
  };

  if (loading) return <div className="text-center py-4">Loading deck...</div>;
  if (error) return <div className="text-center text-error py-4">{error}</div>;
  if (!deck) return <div className="text-center py-4">Deck not found.</div>;

  return (
    <div className="max-w-3xl mx-auto px-4">
      <button className="btn btn-sm mb-4" onClick={() => navigate('/decks')}>&larr; Back</button>
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
            onClick={isAuthenticated ? handleLike : undefined}
            disabled={!isAuthenticated || likeLoading}
            tabIndex={isAuthenticated ? 0 : -1}
            aria-disabled={!isAuthenticated}
          >
            <span>{liked ? '♥' : '♡'}</span> Like {deck.likes?.length || 0}
          </button>
          {isAuthenticated && (
            <button className="btn btn-sm btn-outline btn-error" onClick={() => setReporting(true)}>Report</button>
          )}
        </div>
      </div>
      {/* Flashcards List */}
      <div className="bg-base-100 rounded-xl shadow p-6">
        <h3 className="text-xl font-bold mb-4 text-white">Flashcards</h3>
        {deck.flashcards && deck.flashcards.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {deck.flashcards.map(card => (
              <li
                key={card.flashcard?.id || card.id}
                className="relative rounded-2xl shadow-xl border border-base-300 p-6 flex flex-col gap-3 bg-white/60 dark:bg-base-200/70 backdrop-blur-md transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl group overflow-hidden"
              >
                <span className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-primary to-blue-400 rounded-l-2xl opacity-70 group-hover:opacity-100 transition-all"></span>
                <div className="font-bold text-lg text-primary mb-1 drop-shadow-sm flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.88 3.549A9 9 0 1021 12.001M19.07 4.93A9 9 0 014.93 19.07" /></svg>
                  Q: {card.flashcard?.question}
                </div>
                <div className="text-base text-gray-700 dark:text-gray-200 mb-2 font-medium bg-blue-50/60 dark:bg-blue-900/30 rounded px-2 py-1 shadow-inner">
                  <span className="text-blue-500 font-bold">A:</span> {card.flashcard?.answer}
                </div>
                {card.flashcard?.detail && (
                  <div className="text-xs text-gray-500 italic mt-1">{card.flashcard.detail}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-400 italic">No flashcards in this deck.</div>
        )}
      </div>
      {/* Report Modal */}
      {reporting && (
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
              <button className="btn btn-sm btn-ghost" onClick={() => setReporting(false)}>Cancel</button>
              <button className="btn btn-sm btn-error" onClick={handleReport}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeckDetail;
