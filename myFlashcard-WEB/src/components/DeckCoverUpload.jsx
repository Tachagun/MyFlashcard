import React from 'react';

const DeckCoverUpload = ({ file, setFile }) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files[0])}
        className="file-input file-input-bordered w-full"
      />
      {file && (
        <img
          src={URL.createObjectURL(file)}
          alt="Cover Preview"
          className="w-32 h-20 object-cover rounded border mt-2"
        />
      )}
    </div>
  );
};

export default DeckCoverUpload;
