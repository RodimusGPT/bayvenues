import { useEffect, useRef, RefObject } from 'react';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Focus trap hook for modals and dialogs.
 * - Traps focus within the container element
 * - Restores focus to the previously focused element when unmounted
 * - Handles Shift+Tab to cycle backwards
 */
export function useFocusTrap<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  isActive: boolean,
  options: { autoFocus?: boolean } = { autoFocus: true }
): void {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const container = containerRef.current;
    if (!container) return;

    // Store the currently focused element to restore later
    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
    };

    // Auto-focus first element (or let autoFocus attribute handle it)
    if (options.autoFocus) {
      const focusable = getFocusableElements();
      // Check if any element already has autoFocus attribute
      const autoFocusElement = container.querySelector<HTMLElement>('[autofocus]');
      if (autoFocusElement) {
        autoFocusElement.focus();
      } else if (focusable.length > 0) {
        focusable[0].focus();
      }
    }

    // Handle tab key to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      // Shift+Tab on first element -> focus last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab on last element -> focus first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Restore focus to previously focused element
      if (previouslyFocusedRef.current && typeof previouslyFocusedRef.current.focus === 'function') {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [isActive, containerRef, options.autoFocus]);
}
