import { useState } from 'react';
import type { Video } from '../../types/venue';
import { extractVideoId, getYouTubeThumbnail } from '../../utils/formatters';

interface VenueVideosProps {
  videos: Video[];
}

export function VenueVideos({ videos }: VenueVideosProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Wedding Videos</h3>
      <div className="space-y-3">
        {videos.map((video, index) => (
          <LazyYouTubeEmbed key={index} video={video} />
        ))}
      </div>
    </div>
  );
}

function LazyYouTubeEmbed({ video }: { video: Video }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoId = extractVideoId(video.url);

  if (!videoId) {
    return (
      <a
        href={video.url}
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
