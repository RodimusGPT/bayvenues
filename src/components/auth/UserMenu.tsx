import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  // Get display name (email prefix or first part of email)
  const displayName = user.email?.split('@')[0] || 'User';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {/* User avatar */}
        <div className="w-6 h-6 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-medium">
          {displayName[0].toUpperCase()}
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {displayName}
        </span>
        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          role="menu"
          aria-label="User options"
          className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in"
        >
          {/* User info */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Sign out button */}
          <button
            role="menuitem"
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
