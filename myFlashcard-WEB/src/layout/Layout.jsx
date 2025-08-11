

import React, { useEffect, useState } from 'react';
import MainNav from '../components/MainNav';
import Sidebar from '../components/Sidebar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth-store';
import { getMe } from '../api/user';
import { User, Layers, PlusCircle, StickyNote, Folder, FileText, ArrowLeft } from 'lucide-react';

function Layout() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user info after login if missing (e.g., after admin login)
  useEffect(() => {
    if (isAuthenticated && token && (!user || !user.profilePic || !user.email)) {
      getMe(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, token]);

  // Check if we're on a profile page (but not the main profile page) or study page
  const isProfileSubPage = location.pathname.startsWith('/profile/');
  const isStudyPage = location.pathname.includes('/study');
  const isMainProfilePage = location.pathname === '/profile';
  const showBackButton = isProfileSubPage || isStudyPage;

  // Sidebar options from original UserDashboard
  const sidebarOptions = [
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

  // Determine selected tab from path
  let selected = 'profile';
  if (location.pathname.startsWith('/profile/edit')) selected = 'edit-profile';
  else if (location.pathname.startsWith('/profile/decks')) selected = 'my-decks';
  else if (location.pathname.startsWith('/profile/flashcards')) selected = 'my-flashcards';
  else if (location.pathname.startsWith('/profile/browse')) selected = 'browse-decks';
  else if (location.pathname.startsWith('/profile/create')) selected = 'create-deck';

  return (
    <div className="h-screen bg-base-100 flex flex-col overflow-hidden">
      {/* Header at top - always visible */}
      <MainNav key={user?.id + '-' + (user?.profilePic || '')} />
      
      {isAuthenticated ? (
        /* Main layout with sidebar and content - fills remaining height */
        <div className="flex flex-1 min-h-0">
          {/* Sidebar on left - always visible */}
          <Sidebar key={user?.id + '-' + (user?.profilePic || '')} selected={selected} options={sidebarOptions} />
          
          {/* Main content area - only this scrolls */}
          <main className="flex-1 overflow-auto relative">
            {/* Back Button for Profile Sub-pages and Study Pages */}
            {showBackButton && (
              <div className={`sticky top-2 z-10 ${isStudyPage ? 'left-6' : 'left-6'} mb-2`}>
                <button
                  className="btn btn-ghost btn-sm flex items-center gap-2 bg-base-100 shadow-md border border-base-300 hover:bg-base-200 ml-6"
                  onClick={() => navigate(-1)}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            )}
            
            {/* Page content with minimal padding */}
            <div className="px-6 py-2">
              <Outlet />
            </div>
          </main>
        </div>
      ) : (
        /* For non-authenticated users - only content scrolls */
        <main className="flex-1 overflow-auto">
          <div className="px-6 py-2">
            <Outlet />
          </div>
        </main>
      )}
    </div>
  );
}

export default Layout;