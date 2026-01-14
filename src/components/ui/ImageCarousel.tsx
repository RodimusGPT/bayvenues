import { useState, useEffect, useCallback, useRef } from 'react';
import type { GalleryImage, HeaderImage } from '../../types/venue';
import { ImageModal } from './ImageModal';

interface ImageCarouselProps {
  images: GalleryImage[];
  fallbackImage?: HeaderImage;
  venueName: string;
  onImageError?: (index: number) => void;
}

export function ImageCarousel({ images, fallbackImage, venueName, onImageError }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Filter out failed images
  const validImages = images.filter((_, index) => !failedImages.has(index));

  // Build display images array - use gallery images or fallback
  const displayImages = validImages.length > 0
    ? validImages
    : fallbackImage
      ? [{ url: fallbackImage.url, source: fallbackImage.source as GalleryImage['source'] }]
      : [];

  // Reset index when venue changes
  useEffect(() => {
    setCurrentIndex(0);
    setFailedImages(new Set());
  }, [venueName]);

  // Ensure current index is valid
  useEffect(() => {
    if (currentIndex >= displayImages.length && displayImages.length > 0) {
      setCurrentIndex(0);
    }
  }, [currentIndex, displayImages.length]);

  const handleImageError = useCallback((originalIndex: number) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(originalIndex);
      return newSet;
    });
    onImageError?.(originalIndex);
  }, [onImageError]);

  const goToNext = useCallback(() => {
    if (displayImages.length <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [displayImages.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (displayImages.length <= 1 || isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [displayImages.length, isTransitioning]);

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 300);
  }, [isTransitioning, currentIndex]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Auto-advance every 5 seconds (optional - can be removed)
  // useEffect(() => {
  //   if (displayImages.length <= 1) return;
  //   const timer = setInterval(goToNext, 5000);
  //   return () => clearInterval(timer);
  // }, [displayImages.length, goToNext]);

  if (displayImages.length === 0) {
    return (
      <div className="relative h-48 sm:h-56 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-48 sm:h-56 w-full overflow-hidden group"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Images */}
      <div
        className="flex transition-transform duration-300 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {displayImages.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="min-w-full h-full flex-shrink-0 cursor-zoom-in"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={image.url}
              alt={`${venueName} - Image ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
              onError={() => handleImageError(images.indexOf(image))}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Navigation arrows - only show if multiple images */}
      {displayImages.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); goToPrev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators - only show if multiple images */}
      {displayImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {displayImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => { e.stopPropagation(); goToIndex(index); }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white w-4'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image counter badge */}
      {displayImages.length > 1 && (
        <span className="absolute top-3 left-3 px-2 py-1 bg-black/40 text-white text-xs rounded-full z-10">
          {currentIndex + 1} / {displayImages.length}
        </span>
      )}

      {/* Expand hint icon */}
      <div className="absolute top-3 right-12 p-1.5 bg-black/40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={displayImages}
        initialIndex={currentIndex}
        venueName={venueName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
