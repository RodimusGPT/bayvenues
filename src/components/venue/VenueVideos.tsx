import { useState } from 'react';
import type { Video } from '../../types/venue';
import { extractVideoId, getYouTubeThumbnail, sanitizeUrl } from '../../utils/formatters';

interface VenueVideosProps {
  videos?: Video[];
  youtubeSearch?: string;
}

export function VenueVideos({ videos, youtubeSearch }: VenueVideosProps) {
  const hasVideos = videos && videos.length > 0;
  const safeYoutubeSearch = sanitizeUrl(youtubeSearch);

  // If no videos and no search URL, don't render anything
  if (!hasVideos && !safeYoutubeSearch) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Wedding Videos</h3>
      <div className="space-y-3">
        {hasVideos ? (
          videos.map((video, index) => (
            <LazyYouTubeEmbed key={index} video={video} />
          ))
        ) : safeYoutubeSearch ? (
          <a
            href={safeYoutubeSearch}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl text-white hover:opacity-90 transition-opacity"
          >
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-sm font-medium">Search on YouTube</span>
              <span className="block text-xs opacity-80">Find wedding videos for this venue</span>
            </div>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : null}
      </div>
    </div>
  );
}

function LazyYouTubeEmbed({ video }: { video: Video }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = extractVideoId(video.url);
  const safeVideoUrl = sanitizeUrl(video.url);

  if (!videoId) {
    // Don't render external links with unsafe URLs
    if (!safeVideoUrl) return null;

    return (
      <a
        href={safeVideoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-3 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
      >
        {video.title} (External Link)
      </a>
    );
  }

  if (!isLoaded) {
    return (
      <button
        onClick={() => setIsLoaded(true)}
        className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <img
          src={getYouTubeThumbnail(videoId)}
          alt={video.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <span className="text-white text-sm font-medium line-clamp-2">{video.title}</span>
        </div>
      </button>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={video.title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
