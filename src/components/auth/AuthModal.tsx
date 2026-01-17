import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { sendMagicLink } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap for accessibility
  useFocusTrap(modalRef, isOpen);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await sendMagicLink(email);
      if (error) {
        setError(error.message);
      } else {
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setError(null);
    setSent(false);
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(resetForm, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden="true" />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fade-in"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {sent ? (
          // Success state
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 id="auth-modal-title" className="text-xl font-semibold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-4">
              We sent a magic link to<br />
              <span className="font-medium text-gray-900">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Click the link in the email to sign in. You can close this window.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Use a different email
            </button>
          </div>
        ) : (
          // Form state
          <>
            <div className="text-center mb-6">
              <h2 id="auth-modal-title" className="text-xl font-semibold text-gray-900 mb-2">Sign in to VenueFinder</h2>
              <p className="text-sm text-gray-500">
                Enter your email and we'll send you a magic link to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Sending...
                  </span>
                ) : (
                  'Send Magic Link'
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-xs text-gray-400">
              No password needed. We'll email you a secure link to sign in.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
