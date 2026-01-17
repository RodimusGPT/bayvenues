import { useState } from 'react';

export type IconVariant =
  | 'rings'           // Wedding rings
  | 'heart'           // Heart
  | 'champagne'       // Champagne glasses
  | 'diamond'         // Diamond ring
  | 'chapel'          // Chapel/church
  | 'map-pin';        // Original map pin

interface LogoIconProps {
  variant?: IconVariant;
  showSwitcher?: boolean;
  onVariantChange?: (variant: IconVariant) => void;
  className?: string;
}

const VARIANTS: { id: IconVariant; name: string; emoji: string }[] = [
  { id: 'rings', name: 'Wedding Rings', emoji: '💍' },
  { id: 'heart', name: 'Heart', emoji: '❤️' },
  { id: 'champagne', name: 'Champagne', emoji: '🥂' },
  { id: 'diamond', name: 'Diamond', emoji: '💎' },
  { id: 'chapel', name: 'Chapel', emoji: '⛪' },
  { id: 'map-pin', name: 'Map Pin', emoji: '📍' },
];

export function LogoIcon({ variant = 'rings', showSwitcher = false, onVariantChange, className = '' }: LogoIconProps) {
  const [showMenu, setShowMenu] = useState(false);

  const renderIcon = () => {
    const baseClass = "w-8 h-8 text-primary-600";

    switch (variant) {
      case 'rings':
        // Interlocking wedding rings
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="9" cy="12" r="5" />
            <circle cx="15" cy="12" r="5" />
          </svg>
        );

      case 'heart':
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );

      case 'champagne':
        // Two champagne glasses clinking
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            {/* Left glass */}
            <path d="M6 2L4 10a4 4 0 0 0 4 4h0a4 4 0 0 0 4-4L10 2" />
            <path d="M8 14v6" />
            <path d="M5 20h6" />
            {/* Right glass */}
            <path d="M14 2l2 8a4 4 0 0 1-4 4h0a4 4 0 0 1-4-4" opacity="0" />
            <path d="M18 2l-2 8a4 4 0 0 1-4 4" />
            <path d="M16 14v6" />
            <path d="M13 20h6" />
            {/* Clink sparkle */}
            <path d="M12 5l1-2M12 5l-1-2M12 5l1.5 1M12 5l-1.5 1" strokeWidth={1} />
          </svg>
        );

      case 'diamond':
        // Diamond/engagement ring
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            {/* Diamond top */}
            <polygon points="12,2 6,8 12,14 18,8" fill="currentColor" opacity="0.2" />
            <path d="M12 2L6 8l6 6 6-6-6-6z" />
            <path d="M6 8h12" />
            <path d="M12 2v6" />
            {/* Ring band */}
            <ellipse cx="12" cy="18" rx="6" ry="3" />
          </svg>
        );

      case 'chapel':
        // Simple chapel/church
        return (
          <svg className={baseClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            {/* Steeple */}
            <path d="M12 2v4" />
            <path d="M10 4h4" />
            {/* Roof */}
            <path d="M12 6L4 12h16L12 6z" fill="currentColor" opacity="0.15" />
            <path d="M12 6L4 12h16L12 6z" />
            {/* Building */}
            <rect x="5" y="12" width="14" height="10" fill="currentColor" opacity="0.1" />
            <path d="M5 12v10h14V12" />
            {/* Door */}
            <path d="M10 22v-5a2 2 0 0 1 4 0v5" />
            {/* Window */}
            <circle cx="12" cy="14" r="1.5" />
          </svg>
        );

      case 'map-pin':
      default:
        return (
          <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        {renderIcon()}

        {showSwitcher && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="ml-1 p-0.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
            aria-label="Change icon style"
            title="Change icon style"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Variant Switcher Menu */}
      {showSwitcher && showMenu && (
        <div
          className="absolute top-full left-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Icon Style</p>
          </div>
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                onVariantChange?.(v.id);
                setShowMenu(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                variant === v.id ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
              }`}
            >
              <span className="text-base">{v.emoji}</span>
              <span className="flex-1">{v.name}</span>
              {variant === v.id && (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
