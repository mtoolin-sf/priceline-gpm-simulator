import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Powered by</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-700">Salesforce</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">Loyalty Management</span>
              <span className="text-gray-300">+</span>
              <span className="text-xs text-gray-500">Global Promotions Management</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Demo environment — not a real transaction
          </div>
        </div>
      </div>
    </footer>
  );
}
