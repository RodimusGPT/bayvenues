import { useState, useCallback } from 'react';
import type { Venue } from '../../types/venue';
import type { ShareData, ShareMethod } from '../../utils/share';
import {
  formatVenueForSocial,
  formatVenueForEmail,
  formatFavoritesForSocial,
  canUseWebShare,
  shareViaWebShare,
  copyToClipboard,
} from '../../utils/share';
import { ShareMenu } from './ShareMenu';

interface BaseShareButtonProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onShareComplete?: (method: ShareMethod, success: boolean) => void;
  showToast?: boolean;
}

interface VenueShareButtonProps extends BaseShareButtonProps {
  type: 'venue';
  venue: Venue;
}

interface FavoritesShareButtonProps extends BaseShareButtonProps {
  type: 'favorites';
  venueIds: string[];
  venueCount: number;
}

interface SiteShareButtonProps extends BaseShareButtonProps {
  type: 'site';
}

interface CustomShareButtonProps extends BaseShareButtonProps {
  type: 'custom';
  shareData: ShareData;
  emailData?: { subject: string; body: string };
}

type ShareButtonProps = VenueShareButtonProps | FavoritesShareButtonProps | SiteShareButtonProps | CustomShareButtonProps;

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const buttonSizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
};

export function ShareButton(props: ShareButtonProps) {
  const { size = 'md', className = '', onShareComplete, showToast = true } = props;
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Generate share data based on type
  const getShareData = useCallback((): {
    shareData: ShareData;
    emailData?: { subject: string; body: string };
  } => {
    switch (props.type) {
      case 'venue': {
        const shareData = formatVenueForSocial(props.venue);
        const emailData = formatVenueForEmail(props.venue);
        return { shareData, emailData };
      }
      case 'favorites': {
        const shareData = formatFavoritesForSocial(props.venueIds, props.venueCount);
        return { shareData };
      }
      case 'site': {
        const siteUrl = window.location.origin;
        const shareData: ShareData = {
          title: 'venues.cool',
          text: 'discover the world\'s most amazing wedding venues.',
          url: siteUrl,
        };
        const emailData = {
          subject: 'venues.cool - discover the world\'s most amazing wedding venues',
          body: `discover the world's most amazing wedding venues.\n\n${siteUrl}`,
        };
        return { shareData, emailData };
      }
      case 'custom': {
        return { shareData: props.shareData, emailData: props.emailData };
      }
    }
  }, [props]);

  const handleShareComplete = useCallback(
    (method: ShareMethod, success: boolean) => {
      if (method === 'copy' && success && showToast) {
        setShowCopiedToast(true);
        setTimeout(() => setShowCopiedToast(false), 2000);
      }
      onShareComplete?.(method, success);
    },
    [onShareComplete, showToast]
  );

  // Mobile: use native share
  const handleNativeShare = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      const { shareData } = getShareData();

      const success = await shareViaWebShare(shareData);
      if (!success) {
        // Fallback to copy if share was cancelled or failed
        const copySuccess = await copyToClipboard(shareData.url);
        handleShareComplete('copy', copySuccess);
      } else {
        handleShareComplete('webshare', true);
      }
    },
    [getShareData, handleShareComplete]
  );

  const { shareData, emailData } = getShareData();
  const showPinterest = props.type === 'venue' && !!shareData.imageUrl;

  // On mobile with Web Share API, show a simple share button
  if (canUseWebShare()) {
    return (
      <div className="relative">
        <button
          onClick={handleNativeShare}
          className={`${buttonSizeClasses[size]} rounded-full transition-all duration-200 text-gray-400 hover:text-gray-600 ${className}`}
          aria-label="Share"
          title="Share"
        >
          <svg className={sizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>

        {/* Toast notification */}
        {showCopiedToast && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-full whitespace-nowrap animate-fade-in z-50">
            Link copied!
          </div>
        )}
      </div>
    );
  }

  // On desktop, show dropdown menu
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <ShareMenu
        shareData={shareData}
        emailData={emailData}
        showPinterest={showPinterest}
        onShareComplete={handleShareComplete}
        className={className}
      />

      {/* Toast notification */}
      {showCopiedToast && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-full whitespace-nowrap animate-fade-in z-50">
          Link copied!
        </div>
      )}
    </div>
  );
}

// Export a simpler version for quick sharing (copy link only)
interface QuickShareButtonProps {
  url: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function QuickShareButton({ url, size = 'md', className = '' }: QuickShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`${buttonSizeClasses[size]} rounded-full transition-all duration-200 text-gray-400 hover:text-gray-600 ${className}`}
        aria-label="Copy link"
        title="Copy link"
      >
        {copied ? (
          <svg className={sizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className={sizeClasses[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        )}
      </button>

      {/* Toast notification */}
      {copied && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-full whitespace-nowrap animate-fade-in z-50">
          Link copied!
        </div>
      )}
    </div>
  );
}
