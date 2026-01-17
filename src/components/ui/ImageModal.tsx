import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { GalleryImage } from '../../types/venue';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface ImageModalProps {
  images: GalleryImage[];
  initialIndex: number;
  venueName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageModal({ images, initialIndex, venueName, isOpen, onClose }: ImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap for accessibility
  useFocusTrap(modalRef, isOpen);

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
    }
  }, [isOpen, initialIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case 'ArrowRight':
          goToNext();
          break;
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

  const goToNext = useCallback(() => {
    if (images.length <= 1) return;
    setIsLoading(true);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    if (images.length <= 1) return;
    setIsLoading(true);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

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

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const modalContent = (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Image gallery for ${venueName}`}
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-white/10 text-white text-sm rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Venue name */}
      <div className="absolute bottom-4 left-4 right-4 z-10 text-center">
        <p className="text-white/80 text-sm">{venueName}</p>
      </div>

      {/* Main image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 sm:p-12"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Image */}
        <img
          src={currentImage.url}
          alt={`${venueName} - Image ${currentIndex + 1}`}
          className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              aria-label="Next image"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip at bottom */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto" role="tablist" aria-label="Image thumbnails">
          {images.map((img, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`View image ${index + 1} of ${images.length}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsLoading(true);
              }}
              className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-white opacity-100 scale-105'
                  : 'border-transparent opacity-50 hover:opacity-75'
              }`}
            >
              <img
                src={img.thumbnail || img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // Render modal in portal at document root
  return createPortal(modalContent, document.body);
}
