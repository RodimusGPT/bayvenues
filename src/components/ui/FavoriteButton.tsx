import { useFavoriteStore } from '../../stores/favoriteStore';

interface FavoriteButtonProps {
  venueId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function FavoriteButton({ venueId, size = 'md', className = '' }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const favorited = isFavorite(venueId);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(venueId);
      }}
      className={`p-2 rounded-full transition-all duration-200 ${
        favorited
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-400'
      } ${className}`}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={sizeClasses[size]}
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={favorited ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
