import { useState } from 'react';
import {
  Heart,
  Gem,
  Church,
  Wine,
  MapPin,
  Sparkles,
  Crown,
  Castle,
  Flower2,
  PartyPopper,
  type LucideIcon,
} from 'lucide-react';

export type IconVariant =
  | 'heart'           // Heart
  | 'gem'             // Diamond/gem
  | 'church'          // Church
  | 'wine'            // Champagne/wine glass
  | 'sparkles'        // Sparkles/magic
  | 'crown'           // Crown
  | 'castle'          // Castle venue
  | 'flower'          // Flower/bouquet
  | 'party'           // Party popper
  | 'map-pin';        // Map pin

interface LogoIconProps {
  variant?: IconVariant;
  showSwitcher?: boolean;
  onVariantChange?: (variant: IconVariant) => void;
  className?: string;
}

const VARIANTS: { id: IconVariant; name: string; emoji: string; icon: LucideIcon }[] = [
  { id: 'heart', name: 'Heart', emoji: '❤️', icon: Heart },
  { id: 'gem', name: 'Diamond', emoji: '💎', icon: Gem },
  { id: 'church', name: 'Church', emoji: '⛪', icon: Church },
  { id: 'wine', name: 'Champagne', emoji: '🥂', icon: Wine },
  { id: 'sparkles', name: 'Sparkles', emoji: '✨', icon: Sparkles },
  { id: 'crown', name: 'Crown', emoji: '👑', icon: Crown },
  { id: 'castle', name: 'Castle', emoji: '🏰', icon: Castle },
  { id: 'flower', name: 'Bouquet', emoji: '💐', icon: Flower2 },
  { id: 'party', name: 'Celebrate', emoji: '🎉', icon: PartyPopper },
  { id: 'map-pin', name: 'Map Pin', emoji: '📍', icon: MapPin },
];

export function LogoIcon({ variant = 'heart', showSwitcher = false, onVariantChange, className = '' }: LogoIconProps) {
  const [showMenu, setShowMenu] = useState(false);

  const currentVariant = VARIANTS.find(v => v.id === variant) || VARIANTS[0];
  const IconComponent = currentVariant.icon;

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center">
        <IconComponent
          className="w-8 h-8 text-primary-600"
          strokeWidth={1.5}
          fill={variant === 'heart' ? 'currentColor' : 'none'}
        />

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
