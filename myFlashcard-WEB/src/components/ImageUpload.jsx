import React from 'react';

const ImageUpload = ({ file, setFile, label, previewUrl, setPreviewUrl, disabled }) => {
  const handleChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreviewUrl(URL.createObjectURL(selected));
    } else {
      setPreviewUrl('');
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setFile(null);
    setPreviewUrl('');
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium">{label}</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="file-input file-input-bordered w-full"
        disabled={disabled}
      />
      <div className="w-full mx-auto mt-2 flex flex-col items-center">
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt={label + ' Preview'}
              className="w-full max-w-full h-40 object-contain rounded border"
            />
            <button
              type="button"
              className="btn btn-sm btn-error mt-2"
              onClick={handleRemove}
              aria-label={`Remove ${label.toLowerCase()} image`}
            >Remove</button>
          </>
        ) : (
          <div className="w-full h-40 flex items-center justify-center bg-base-200 text-gray-400 rounded border"></div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
