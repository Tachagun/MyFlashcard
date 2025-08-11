import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/auth-store';
import { getMe, updateMe, uploadProfilePic } from '../../api/user';
import ProfilePicUpload from '../../components/ProfilePicUpload';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateProfileSchema } from '../../validators/updateProfileSchema';
import useDocumentTitle from '../../utils/useDocumentTitle';

function UserProfile() {
  useDocumentTitle('Profile Settings');

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileError, setFileError] = useState('');
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [editAboutMe, setEditAboutMe] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPicForm, setShowPicForm] = useState(false);

  const { register, handleSubmit, setValue, reset, getValues, formState: { errors, isDirty, isSubmitting, dirtyFields } } = useForm({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      username: user?.username || '',
      aboutMe: user?.aboutMe || '',
    },
  });

  // Fetch latest user info on mount
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getMe(token)
      .then(data => {
        if (data.user && JSON.stringify(data.user) !== JSON.stringify(user)) {
          setUser(data.user);
          reset({
            username: data.user.username || '',
            aboutMe: data.user.aboutMe || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
    // eslint-disable-next-line
  }, [token, setUser, reset, user]);

  // Separate handler for profile picture upload
  const handleProfilePicUpload = async (e) => {
    e.preventDefault();
    setFileError('');
    if (!file) {
      setFileError('Please select an image to upload.');
      return;
    }
    setUploading(true);
    try {
      const data = await uploadProfilePic(file, token);
      if (data.user && data.user.profilePic) {
        setUser && setUser(data.user);
        setFile(null);
        setShowPicForm(false);
      }
    } catch (e) {
      setFileError(e?.response?.data?.error || 'Image upload failed');
    }
    setUploading(false);
  };

  // Handler for updating username only
  const onSubmitUsername = async (values) => {
    setServerError('');
    try {
      const data = await updateMe({ username: values.username }, token);
      if (data.user) {
        setUser && setUser(data.user);
        setEditUsername(false);
        setValue('username', data.user.username || '', { shouldDirty: false });
      }
    } catch (e) {
      setServerError(e?.response?.data?.message || 'Update failed');
    }
  };

  // Handler for updating aboutMe only
  const onSubmitAboutMe = async (values) => {
    setServerError('');
    try {
      const data = await updateMe({ aboutMe: values.aboutMe }, token);
      if (data.user) {
        setUser && setUser(data.user);
        setEditAboutMe(false);
        setValue('aboutMe', data.user.aboutMe || '', { shouldDirty: false });
      }
    } catch (e) {
      setServerError(e?.response?.data?.message || 'Update failed');
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        </div>
        <div className="space-y-6">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body text-center">
              <span>No user info available.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
        <div className="text-sm text-gray-500">Update your profile information and settings</div>
      </div>
      <div className="space-y-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body space-y-8">
          <div className="relative group">
            <img
              src={user.profilePic ? user.profilePic : '/default-profile.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary bg-gray-100 shadow-md cursor-pointer hover:opacity-80 transition"
              onClick={() => setShowPicForm(true)}
              title="Click to change profile picture"
            />
            <button
              className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1 shadow hover:bg-primary-focus transition-opacity opacity-80 group-hover:opacity-100"
              style={{ fontSize: 14 }}
              onClick={() => setShowPicForm(true)}
              title="Change profile picture"
              type="button"
            >
              <span role="img" aria-label="edit">✏️</span>
            </button>
          </div>
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-xl font-semibold">{user.username}</span>
            <span className="text-gray-500">{user.email}</span>
            <span className="badge badge-info capitalize">{user.role}</span>
          </div>
        </div>
        {showPicForm && (
          <form className="space-y-4 mb-4 animate-fade-in" onSubmit={handleProfilePicUpload}>
            <div>
              <label className="font-semibold">Profile Picture</label>
              <ProfilePicUpload file={file} setFile={setFile} />
              <div className="text-xs text-gray-500 mt-1">JPG, PNG, or GIF. Max 2MB.</div>
              {fileError && <div className="text-error text-xs">{fileError}</div>}
              {uploading && <div className="text-info text-xs">Uploading image...</div>}
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" className="btn btn-ghost" onClick={() => { setShowPicForm(false); setFile(null); setFileError(''); }}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={uploading}>Change Picture</button>
            </div>
          </form>
        )}
        <div className="pt-2 space-y-6">
          {/* Username Section */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-lg">Username</span>
            </div>
            {editUsername ? (
              <form className="flex flex-col gap-2 animate-fade-in" onSubmit={handleSubmit(onSubmitUsername)}>
                <input
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary transition"
                  {...register('username')}
                  autoFocus
                />
                <div className="text-xs text-gray-500 mt-1">This will be visible to others.</div>
                {errors.username && <div className="text-error text-xs">{errors.username.message}</div>}
                {serverError && <div className="text-error text-xs">{serverError}</div>}
                <div className="flex gap-2 justify-end">
                  <button type="button" className="btn btn-ghost" onClick={() => { setEditUsername(false); reset({ ...getValues(), username: user.username }); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || !dirtyFields.username}>Save</button>
                </div>
              </form>
            ) : (
              <div
                className="rounded-lg p-2 bg-base-200 border text-base cursor-pointer hover:bg-base-300 transition w-fit px-4 flex items-center gap-2"
                onClick={() => { setEditUsername(true); setEditAboutMe(false); reset({ ...getValues(), aboutMe: user.aboutMe }); }}
                title="Click to edit your username"
                style={{ minWidth: '120px' }}
              >
                <span>{user.username}</span>
                <span className="ml-1 text-gray-400" role="img" aria-label="edit">✏️</span>
              </div>
            )}
          </div>
          {/* About Me Section */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-lg">About Me</span>
            </div>
            {editAboutMe ? (
              <form className="flex flex-col gap-2 animate-fade-in" onSubmit={handleSubmit(onSubmitAboutMe)}>
                <textarea
                  className="textarea textarea-bordered w-full focus:ring-2 focus:ring-primary transition"
                  rows={3}
                  {...register('aboutMe')}
                  autoFocus
                />
                <div className="text-xs text-gray-500 mt-1">Share a little about yourself.</div>
                {errors.aboutMe && <div className="text-error text-xs">{errors.aboutMe.message}</div>}
                {serverError && <div className="text-error text-xs">{serverError}</div>}
                <div className="flex gap-2 justify-end">
                  <button type="button" className="btn btn-ghost" onClick={() => { setEditAboutMe(false); reset({ ...getValues(), aboutMe: user.aboutMe }); }}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || !dirtyFields.aboutMe}>Save</button>
                </div>
              </form>
            ) : (
              <div
                className={`rounded-lg p-4 bg-base-200 border ${user.aboutMe ? 'text-base' : 'italic text-gray-400'} cursor-pointer hover:bg-base-300 transition flex items-center gap-2`}
                style={{ minHeight: '56px' }}
                onClick={() => { setEditAboutMe(true); setEditUsername(false); reset({ ...getValues(), username: user.username }); }}
                title="Click to edit your About Me"
              >
                <span>{user.aboutMe || 'No bio yet. Click to add something about yourself!'}</span>
                <span className="ml-1 text-gray-400" role="img" aria-label="edit">✏️</span>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default UserProfile;
