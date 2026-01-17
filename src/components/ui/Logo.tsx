import { useState } from 'react';

export type LogoVariant =
  | 'elegant-split'      // Playfair + Inter
  | 'modern-minimal'     // DM Sans with dot
  | 'playful-contrast'   // Outfit + Crimson Pro
  | 'wedding-elegant'    // Cormorant Garamond
  | 'tech-forward';      // Space Grotesk

interface LogoProps {
  variant?: LogoVariant;
  showSwitcher?: boolean;
  onVariantChange?: (variant: LogoVariant) => void;
  className?: string;
}

const VARIANTS: { id: LogoVariant; name: string }[] = [
  { id: 'elegant-split', name: 'Elegant Split' },
  { id: 'modern-minimal', name: 'Modern Minimal' },
  { id: 'playful-contrast', name: 'Playful Contrast' },
  { id: 'wedding-elegant', name: 'Wedding Elegant' },
  { id: 'tech-forward', name: 'Tech Forward' },
];

export function Logo({ variant = 'elegant-split', showSwitcher = false, onVariantChange, className = '' }: LogoProps) {
  const [showMenu, setShowMenu] = useState(false);

  const renderLogo = () => {
    switch (variant) {
      case 'elegant-split':
        return (
          <span className="flex items-baseline">
            <span
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-2xl font-semibold text-gray-800 tracking-tight"
            >
              venues
            </span>
            <span
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="text-2xl font-medium text-primary-600"
            >
              .cool
            </span>
          </span>
        );

      case 'modern-minimal':
        return (
          <span
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            className="flex items-baseline text-2xl font-semibold text-gray-800 tracking-tight"
          >
            venues
            <span className="text-primary-600 mx-0.5">●</span>
            cool
          </span>
        );

      case 'playful-contrast':
        return (
          <span className="flex items-baseline">
            <span
              style={{ fontFamily: "'Outfit', sans-serif" }}
              className="text-2xl font-bold text-gray-900 tracking-tight"
            >
              venues
            </span>
            <span
              style={{ fontFamily: "'Crimson Pro', serif" }}
              className="text-2xl font-normal italic text-primary-600"
            >
              .cool
            </span>
          </span>
        );

      case 'wedding-elegant':
        return (
          <span
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-3xl font-medium tracking-wide"
          >
            <span className="text-gray-800">venues</span>
            <span className="text-primary-600">.cool</span>
          </span>
        );

      case 'tech-forward':
        return (
          <span
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            className="flex items-baseline text-2xl font-semibold tracking-tight"
          >
            <span className="text-gray-900">venues</span>
            <span
              className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent"
            >
              .cool
            </span>
          </span>
        );

      default:
        return <span className="text-2xl font-bold text-gray-900">venues.cool</span>;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        {renderLogo()}

        {showSwitcher && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            aria-label="Change logo style"
            title="Change logo style"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
        )}
      </div>

      {/* Variant Switcher Menu */}
      {showSwitcher && showMenu && (
        <div
          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Logo Style</p>
          </div>
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              onClick={() => {
                onVariantChange?.(v.id);
                setShowMenu(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${
                variant === v.id ? 'text-primary-600 bg-primary-50' : 'text-gray-700'
              }`}
            >
              <span>{v.name}</span>
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
