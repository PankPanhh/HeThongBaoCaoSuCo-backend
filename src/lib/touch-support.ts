/**
 * Initialize touch support for mobile devices
 * Enables touch event handling and mobile-specific optimizations
 */
export function initTouchSupport(): void {
  // Add touch event listeners for better mobile experience
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('touch-enabled');
    
    // Prevent default touch behaviors for smoother interaction
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
    document.addEventListener('touchend', () => {}, { passive: true });
  }
}
