import { useEffect } from 'react';

let openOverlays = 0;

/**
 * Shared behaviour for every dialog/drawer: Escape closes it, the page behind
 * it stops scrolling, and focus is moved into the overlay for keyboard users.
 */
export default function useOverlay(isOpen, onClose, containerRef) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      }
    };

    const previouslyFocused = document.activeElement;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;

    openOverlays += 1;
    if (openOverlays === 1) {
      document.body.style.overflow = 'hidden';
      if (scrollbarGap > 0) document.body.style.paddingLeft = `${scrollbarGap}px`;
    }

    document.addEventListener('keydown', handleKeyDown);

    const focusTarget = containerRef?.current;
    if (focusTarget) {
      const focusable = focusTarget.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (focusable || focusTarget).focus?.({ preventScroll: true });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      openOverlays = Math.max(0, openOverlays - 1);
      if (openOverlays === 0) {
        document.body.style.overflow = '';
        document.body.style.paddingLeft = '';
      }
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [isOpen, onClose, containerRef]);
}
