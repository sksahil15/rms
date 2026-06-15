'use client';

import { useEffect } from 'react';

export default function DisableDarkMobileTheme() {
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const htmlElement = document.documentElement;
      
      if (isMobile) {
        // Remove dark class on mobile
        htmlElement.classList.remove('dark');
        htmlElement.style.colorScheme = 'light';
      } else {
        // Restore system preference on desktop
        htmlElement.style.colorScheme = '';
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          htmlElement.classList.add('dark');
        }
      }
    };

    // Run on mount
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return null;
}
