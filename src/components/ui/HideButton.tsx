import { useHiddenStore } from '../../stores/hiddenStore';

interface HideButtonProps {
  venueId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onHide?: () => void;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function HideButton({ venueId, size = 'md', className = '', onHide }: HideButtonProps) {
  const { toggleHidden, isHidden } = useHiddenStore();
  const hidden = isHidden(venueId);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleHidden(venueId);
        if (!hidden && onHide) {
          onHide();
        }
      }}
      className={`p-2 rounded-full transition-all duration-200 ${
        hidden
          ? 'text-gray-500 hover:text-gray-600 bg-gray-100'
          : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
      } ${className}`}
      aria-label={hidden ? 'Show venue' : 'Hide venue'}
      title={hidden ? 'Show this venue again' : 'Hide this venue'}
    >
      {hidden ? (
        // Eye with slash (hidden state)
        <svg
          className={sizeClasses[size]}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      ) : (
        // Eye (visible state)
        <svg
          className={sizeClasses[size]}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      )}
    </button>
  );
}
