import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/auth-store';

function MainNav() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  return (
    <nav className="navbar bg-primary text-primary-content shadow-lg px-8 h-16 flex-shrink-0">
      <div className="flex-1 flex gap-4 items-center">
        <Link className="normal-case text-xl p-0 mr-2 flex items-center" to="/">
          <img src="/myFlashcard-navLogo.png" alt="myFlashcard logo" className="h-10 w-auto max-h-10 min-w-[40px] align-middle" />
        </Link>
        <Link className="btn btn-ghost" to="/">Home</Link>
        <Link className="btn btn-ghost" to="/decks">Public Decks</Link>
      </div>
      <div className="flex-none flex gap-2">
        {!isAuthenticated && <Link className="btn btn-outline" to="/register">Register</Link>}
        {!isAuthenticated && <Link className="btn" to="/login">Login</Link>}
        {isAuthenticated && (
          <Link className="btn btn-outline flex items-center gap-2" to="/profile">
            <img
              src={user?.profilePic ? user.profilePic : '/default-profile.png'}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover border border-primary-content bg-gray-100"
            />
            Profile
          </Link>
        )}
        {isAdmin && (
          <Link className="btn btn-warning" to="/admin">Admin</Link>
        )}
        {isAuthenticated && <button className="btn btn-error" onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}

export default MainNav;
