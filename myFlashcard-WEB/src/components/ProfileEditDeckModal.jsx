import React, { useState } from 'react';
import DeckCoverUpload from './DeckCoverUpload';
import { uploadDeckCover } from '../api/deckCover';
import useAuthStore from '../store/auth-store';

const ProfileEditDeckModal = ({ deck, onSave, onClose, loading }) => {
  if (!deck) return null;
  const [title, setTitle] = useState(deck.title || '');
  const [description, setDescription] = useState(deck.description || '');
  const [categoryName, setCategoryName] = useState(deck.category?.name || '');
  const [isPublic, setIsPublic] = useState(deck.isPublic || false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverImage, setCoverImage] = useState(deck.coverImage || '');
  const [uploadingCover, setUploadingCover] = useState(false);
  const token = useAuthStore((state) => state.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let coverImageUrl = coverImage;
    if (coverFile) {
      setUploadingCover(true);
      try {
        const uploadRes = await uploadDeckCover(coverFile, token);
        coverImageUrl = uploadRes.url;
      } catch (err) {
        alert('Failed to upload cover image.');
        setUploadingCover(false);
        return;
      }
      setUploadingCover(false);
    }
    onSave({ title, description, categoryName, isPublic, coverImage: coverImageUrl });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-base-200 p-6 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-3">
        <h3 className="font-bold text-lg mb-2">Edit Deck</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="font-semibold">Cover Image</label>
          <DeckCoverUpload file={coverFile} setFile={setCoverFile} />
          {!coverFile && coverImage && (
            <div className="flex items-center gap-2 mb-2">
              <img
                src={coverImage}
                alt="Current Cover"
                className="w-32 h-20 object-cover rounded border"
              />
              <button
                type="button"
                className="btn btn-xs btn-error ml-2"
                onClick={() => setCoverImage('')}
                disabled={uploadingCover || loading}
                title="Remove cover image"
              >
                Remove
              </button>
            </div>
          )}
          {uploadingCover && <div className="text-info text-xs">Uploading cover image...</div>}
          <input
            className="input input-bordered w-full"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
          />
          <input
            className="input input-bordered w-full"
            placeholder="Category"
            value={categoryName}
            onChange={e => setCategoryName(e.target.value)}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox"
              checked={isPublic}
              onChange={e => setIsPublic(e.target.checked)}
            />
            Public
          </label>
          <div className="flex gap-2 justify-end mt-2">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditDeckModal;
