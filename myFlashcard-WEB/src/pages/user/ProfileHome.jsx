import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import useDocumentTitle from '../../utils/useDocumentTitle';

const ProfileHome = () => {
  const { user, deckCount, cardCount } = useOutletContext();
  const navigate = useNavigate();
  
  useDocumentTitle(user ? `${user.username}'s Profile` : 'Profile');
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header with title and action */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.username}!</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/profile/edit')}
        >
          Edit Profile
        </button>
      </div>
      
      {/* Main content */}
      <div className="space-y-6">
        {/* Profile Info Section */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center gap-6 mb-6">
              <img
                src={user?.profilePic ? user.profilePic : '/default-profile.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-primary bg-gray-100"
              />
              <div>
                <div className="font-semibold text-xl text-base-content">{user?.username}</div>
                <div className="text-base-content/70">{user?.email}</div>
                <div className="text-sm text-base-content/50 mt-1">Role: {user?.role}</div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-base-content">About Me</h3>
              <div className="bg-base-200 rounded-lg p-4 min-h-[80px] text-base-content">
                {user?.aboutMe ? user.aboutMe : (
                  <span className="text-base-content/50 italic">No about me info yet.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <div className="text-4xl font-bold text-primary">{deckCount || 0}</div>
              <div className="text-base-content/70 text-lg">Total Decks</div>
            </div>
          </div>
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <div className="text-4xl font-bold text-secondary">{cardCount || 0}</div>
              <div className="text-base-content/70 text-lg">Total Cards</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHome;
