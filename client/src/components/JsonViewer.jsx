import React, { useState } from 'react';

export default function JsonViewer({ title, data }) {
  const [open, setOpen] = useState(false);
  if (!data) return null;
  return (
    <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors"
      >
        <span>🔍 {title || 'Raw API Response'}</span>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <pre className="p-4 text-xs text-gray-700 overflow-auto max-h-64 bg-gray-50 font-mono leading-relaxed">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
