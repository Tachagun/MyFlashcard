import React from 'react';

export default function ConfirmModal({ open, title = 'Are you sure?', message, onConfirm, onCancel, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-base-200 rounded-xl shadow-lg p-6 w-full max-w-xs">
        <div className="font-bold text-lg mb-2">{title}</div>
        {message && <div className="mb-4 text-gray-700 dark:text-gray-200">{message}</div>}
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-sm" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-sm btn-error" onClick={onConfirm} disabled={loading}>Remove</button>
        </div>
      </div>
    </div>
  );
}
