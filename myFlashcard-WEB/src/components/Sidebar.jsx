
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth-store';

const Sidebar = ({ selected, options }) => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [openGroups, setOpenGroups] = useState({});

  const renderSidebarButton = (opt) => (
    <button
      key={opt.key}
      className={`btn btn-ghost w-full flex items-center justify-start hover:bg-gray-700 ${selected === opt.key ? 'bg-base-300' : ''} py-1 text-sm transition-all duration-200`}
      onClick={() => navigate(opt.path)}
    >
      <span className="mr-2">{opt.icon}</span>
      {opt.label}
    </button>
  );

  const renderGroup = (opt) => {
    const isOpen = openGroups[opt.key];
    return (
      <div key={opt.key} className="w-full relative group">
        <button
          className={`btn btn-ghost w-full flex items-center justify-between py-1 text-sm hover:bg-gray-700`}
          onClick={() => setOpenGroups(prev => ({ ...prev, [opt.key]: !isOpen }))}
          title={opt.label}
        >
          <span className="flex items-center">{opt.icon}{opt.label}</span>
          <svg
            className={`w-3 h-3 ml-2 transition-transform ${isOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {isOpen && (
          <div className="ml-4 flex flex-col gap-1">
            {opt.children.map(child =>
              child.children ? renderGroup(child) : renderSidebarButton(child)
            )}
          </div>
        )}
      </div>
    );
  };

  // Render Profile|Edit row if both exist
  const filtered = options.filter(opt => opt.key !== 'edit-profile');
  const profileIdx = filtered.findIndex(opt => opt.key === 'profile');
  let menuList;
  if (profileIdx !== -1 && options.some(o => o.key === 'edit-profile')) {
    const editOpt = options.find(o => o.key === 'edit-profile');
    const before = filtered.slice(0, profileIdx);
    const after = filtered.slice(profileIdx + 1);
    menuList = [
      ...before.map(opt => opt.children ? renderGroup(opt) : renderSidebarButton(opt)),
      <div key="profile-edit-row" className="flex flex-row w-full">
        <button
          className={`btn btn-ghost grow-[8] basis-0 justify-start rounded-r-none border border-primary border-r-0 hover:bg-gray-700 ${selected === 'profile' ? 'bg-base-300' : ''} py-1 text-sm`}
          onClick={() => navigate('/profile')}
        >
          {filtered[profileIdx].icon}
          {filtered[profileIdx].label}
        </button>
        <button
          className={`btn btn-ghost grow-[1.2] basis-0 justify-center rounded-l-none border-l border-primary bg-base-100 text-primary py-1 text-sm transition-colors duration-150 hover:bg-primary/10 hover:text-primary focus:ring-2 focus:ring-primary/30`}
          onClick={() => navigate(editOpt.path)}
          title="Edit Profile"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="inline w-3 h-3 mr-1 align-text-bottom" viewBox="0 0 16 16" fill="currentColor">
            <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708l-9.439 9.439a.5.5 0 0 1-.168.11l-4 1.5a.5.5 0 0 1-.65-.65l1.5-4a.5.5 0 0 1 .11-.168l9.439-9.439zm.708-.708a1.5 1.5 0 0 0-2.121 0l-9.439 9.439a1.5 1.5 0 0 0-.329.504l-1.5 4a1.5 1.5 0 0 0 1.95 1.95l4-1.5a1.5 1.5 0 0 0 .504-.329l9.439-9.439a1.5 1.5 0 0 0 0-2.121l-2.292-2.292z"/>
          </svg>
          Edit
        </button>
      </div>,
      <hr key="profile-edit-row-hr" className=" border-white mt-3 mb-2" />,
      ...after.map(opt => opt.children ? renderGroup(opt) : renderSidebarButton(opt))
    ];
  } else {
    menuList = filtered.map(opt => opt.children ? renderGroup(opt) : renderSidebarButton(opt));
  }

  return (
    <aside className="w-56 bg-base-200 p-4 flex flex-col gap-4 border-r h-full flex-shrink-0">
      <div className="flex flex-col items-center gap-2">
        <img
          src={user?.profilePic ? user.profilePic : '/default-profile.png'}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover border-2 border-primary bg-gray-100"
        />
        <span className="font-semibold">{user?.username || ''}</span>
        <span className="text-xs text-gray-500">{user?.email || ''}</span>
      </div>
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto min-h-0">
        {menuList}
      </div>
    </aside>
  );
};

export default Sidebar;
