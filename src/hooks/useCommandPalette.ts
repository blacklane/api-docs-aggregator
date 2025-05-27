import { useState, useEffect } from 'react';

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    const handleOpenCommandPalette = () => {
      setIsOpen(true);
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('openCommandPalette', handleOpenCommandPalette);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('openCommandPalette', handleOpenCommandPalette);
    };
  }, []);

  const openCommandPalette = () => setIsOpen(true);
  const closeCommandPalette = () => setIsOpen(false);

  return {
    isOpen,
    openCommandPalette,
    closeCommandPalette,
  };
} 