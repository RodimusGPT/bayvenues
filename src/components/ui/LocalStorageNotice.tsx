import { useState, useEffect } from 'react';

const STORAGE_KEY = 'venue-notice-dismissed';

export function LocalStorageNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if notice was already dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-4 py-3">
      <div className="flex items-start sm:items-center justify-between gap-3 max-w-7xl mx-auto">
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 p-1.5 bg-amber-100 rounded-full">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-amber-800">
            <span className="font-medium">Quick note:</span>{' '}
            <span className="text-amber-700">
              Your favorites and hidden venues are saved locally in this browser.
              They won't sync across devices or persist if you clear browser data.
            </span>
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-100 rounded-full transition-colors"
          aria-label="Dismiss notice"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
