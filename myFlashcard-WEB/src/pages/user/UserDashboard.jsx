import React, { useEffect, useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { User, Layers, BookOpen, PlusCircle, StickyNote, Folder, FileText } from 'lucide-react';
import useAuthStore from '../../store/auth-store';
import { getMe } from '../../api/user';
import { fetchMyFlashcards } from '../../api/flashcard';
import useDocumentTitle from '../../utils/useDocumentTitle';

function UserDashboard() {
  useDocumentTitle('Dashboard');

  const userStore = useAuthStore();
  const token = userStore.token;
  const setUser = userStore.setUser;
  const [user, setUserState] = useState(userStore.user);
  // Fetch latest user info on mount (ensures aboutMe is always up to date)
  useEffect(() => {
    if (!token) return;
    getMe(token).then(data => {
      if (data.user) setUser(data.user);
    });
    // eslint-disable-next-line
  }, [token, setUser]);
  // Update local user state when store changes
  useEffect(() => {
    setUserState(userStore.user);
  }, [userStore.user]);

  const SIDEBAR_OPTIONS = [
    { key: 'profile', label: 'Profile', icon: <User className="w-4 h-4 mr-2" />, path: '/profile' },
    { key: 'edit-profile', label: 'Edit Profile', icon: <User className="w-4 h-4 mr-2" />, path: '/profile/edit' },
    {
      key: 'decks-group',
      label: 'Decks',
      icon: <Folder className="w-4 h-4 mr-2" />,
      children: [
        { key: 'my-decks', label: 'My Decks', icon: <Layers className="w-4 h-4 mr-2" />, path: '/profile/decks' },
        { key: 'create-deck', label: 'Create Deck', icon: <PlusCircle className="w-4 h-4 mr-2" />, path: '/profile/create' },
      ]
    },
    {
      key: 'flashcards-group',
      label: 'Flashcards',
      icon: <FileText className="w-4 h-4 mr-2" />,
      children: [
        { key: 'my-flashcards', label: 'My Flashcards', icon: <StickyNote className="w-4 h-4 mr-2" />, path: '/profile/flashcards' },
      ]
    },
  ];

  const location = useLocation();
  const deckCount = user?.ownedDecks?.length || 0;
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    fetchMyFlashcards(token).then(data => {
      if (Array.isArray(data)) setCardCount(data.length);
      else if (Array.isArray(data.flashcards)) setCardCount(data.flashcards.length);
      else setCardCount(0);
    });
  }, [token]);

  // Determine selected tab from path
  let selected = 'profile';
  if (location.pathname.startsWith('/profile/edit')) selected = 'edit-profile';
  else if (location.pathname.startsWith('/profile/decks')) selected = 'my-decks';
  else if (location.pathname.startsWith('/profile/flashcards')) selected = 'my-flashcards';
  else if (location.pathname.startsWith('/profile/browse')) selected = 'browse-decks';
  else if (location.pathname.startsWith('/profile/create')) selected = 'create-deck';

  return (
    <div className="min-h-screen bg-base-100">
      <main className="p-3 ml-0">
        <Outlet context={{ user, deckCount, cardCount }} />
        {/* Add more sections here as you add more dashboard features */}
      </main>
    </div>
  );
}

export default UserDashboard;
