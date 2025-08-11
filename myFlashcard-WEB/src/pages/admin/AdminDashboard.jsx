
import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/auth-store';
import { toast } from 'react-toastify';
import useDocumentTitle from '../../utils/useDocumentTitle';
import { fetchDeckReports, resolveDeckReport, fetchAllDecks, fetchAllFlashcards, hardDeleteDeck, hardDeleteFlashcard } from '../../api/admin';

function AdminDashboard() {
  useDocumentTitle('Admin Dashboard');
  const user = useAuthStore((state) => state.user);
  // State for tab selection
  const [tab, setTab] = useState('reports');

  // Placeholder states for data
  const [reports, setReports] = useState([]);
  const [decks, setDecks] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [users, setUsers] = useState([]);


  // Fetch deck reports when tab is 'reports'
  const token = useAuthStore((state) => state.token);
  // Fetch data for each tab
  useEffect(() => {
    if (tab === 'reports' && token) {
      fetchDeckReports(token)
        .then(setReports)
        .catch(() => setReports([]));
    } else if (tab === 'delete' && token) {
      fetchAllDecks(token)
        .then(setDecks)
        .catch(() => setDecks([]));
      fetchAllFlashcards(token)
        .then(setFlashcards)
        .catch(() => setFlashcards([]));
    }
  }, [tab, token]);
  // Handle hard delete deck
  const handleHardDeleteDeck = async (deckId) => {
    try {
      await hardDeleteDeck(deckId, token);
      toast.success('Deck hard deleted');
      fetchAllDecks(token).then(setDecks);
    } catch (e) {
      toast.error('Failed to hard delete deck');
    }
  };

  // Handle hard delete flashcard
  const handleHardDeleteFlashcard = async (flashcardId) => {
    try {
      await hardDeleteFlashcard(flashcardId, token);
      toast.success('Flashcard hard deleted');
      fetchAllFlashcards(token).then(setFlashcards);
    } catch (e) {
      toast.error('Failed to hard delete flashcard');
    }
  };

  // Handle resolve report
  const handleResolve = async (reportId) => {
    try {
      await resolveDeckReport(reportId, token);
      toast.success('Report resolved');
      // Refresh reports
      fetchDeckReports(token).then(setReports);
    } catch (e) {
      toast.error('Failed to resolve report');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-4">Admin Dashboard</h1>
      <div className="card bg-base-100 shadow-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <div className="font-semibold">Username: <span className="text-primary">{user?.username}</span></div>
            <div className="text-sm text-gray-400">Email: {user?.email}</div>
            <div className="text-sm text-gray-400">Role: {user?.role}</div>
          </div>
          <img src={user?.profilePic || '/default-profile.png'} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-primary bg-gray-100" />
        </div>
      </div>
      {/* Tabs */}
      <div className="tabs tabs-boxed mb-4">
        <button className={`tab${tab==='reports' ? ' tab-active' : ''}`} onClick={()=>setTab('reports')}>Deck Reports</button>
        <button className={`tab${tab==='delete' ? ' tab-active' : ''}`} onClick={()=>setTab('delete')}>Hard Delete</button>
        <button className={`tab${tab==='ban' ? ' tab-active' : ''}`} onClick={()=>setTab('ban')}>Ban Users</button>
      </div>
      {/* Tab Content */}
      <div>
        {tab === 'reports' && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-white">Deck Reports</h2>
            {reports.length === 0 ? (
              <div className="text-gray-400">No reports found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Deck</th>
                      <th>Reason</th>
                      <th>Reporter</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id} className={r.reportStatus === 'RESOLVED' ? 'opacity-60' : ''}>
                        <td>{r.deck?.title || 'N/A'}</td>
                        <td>{r.reportReason}</td>
                        <td>{r.reporter?.username || 'N/A'}</td>
                        <td>{r.reportStatus}</td>
                        <td>
                          {r.reportStatus !== 'RESOLVED' && (
                            <button className="btn btn-xs btn-success" onClick={() => handleResolve(r.id)}>Resolve</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {tab === 'delete' && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-white">Hard Delete Decks/Flashcards</h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Decks</h3>
              {decks.length === 0 ? (
                <div className="text-gray-400">No decks found.</div>
              ) : (
                <div className="overflow-x-auto mb-4">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Owner</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {decks.map((d) => (
                        <tr key={d.id}>
                          <td>{d.title}</td>
                          <td>{d.owner?.username || 'N/A'}</td>
                          <td>
                            <button className="btn btn-xs btn-error" onClick={() => handleHardDeleteDeck(d.id)}>Hard Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Flashcards</h3>
              {flashcards.length === 0 ? (
                <div className="text-gray-400">No flashcards found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Owner</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {flashcards.map((f) => (
                        <tr key={f.id}>
                          <td>{f.question}</td>
                          <td>{f.owner?.username || 'N/A'}</td>
                          <td>
                            <button className="btn btn-xs btn-error" onClick={() => handleHardDeleteFlashcard(f.id)}>Hard Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
        {tab === 'ban' && (
          <div>
            <h2 className="text-xl font-bold mb-2 text-white">Ban Users</h2>
            {/* TODO: List users, add ban button */}
            <div className="text-gray-400">(Ban user UI goes here)</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
