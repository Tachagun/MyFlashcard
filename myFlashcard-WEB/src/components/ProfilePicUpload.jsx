import React from 'react';

function ProfilePicUpload({ file, setFile }) {
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  const removePic = (e) => {
    e.stopPropagation();
    setFile(null);
    document.getElementById('profile-pic-input').value = '';
  };
  return (
    <div className="flex flex-col p-2 border rounded-lg">
      <div
        className="bg-slate-100 min-h-40 relative cursor-pointer hover:bg-slate-200 flex items-center justify-center"
        onClick={() => document.getElementById('profile-pic-input').click()}
      >
        <input
          type="file"
          className="hidden"
          id="profile-pic-input"
          accept="image/*"
          onChange={handleFileChange}
        />
        {file ? (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="h-24 w-24 object-cover rounded-full mx-auto"
            />
            <button
              className="btn btn-sm btn-circle btn-error absolute top-1 right-1 opacity-60"
              onClick={removePic}
              type="button"
            >
              x
            </button>
          </>
        ) : (
          <span className="text-gray-400">Click to select image</span>
        )}
      </div>
    </div>
  );
}

export default ProfilePicUpload;
