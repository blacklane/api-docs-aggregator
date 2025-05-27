import React from 'react';
import { Search } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
  className?: string;
  showShortcut?: boolean;
}

export default function SearchButton({ onClick, className = '', showShortcut = true }: SearchButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn btn-ghost gap-2 text-base-content/70 hover:text-base-content ${className}`}
      title="Search APIs and Events (⌘K)"
    >
      <Search className="h-4 w-4" />
      <span>Search</span>
      {showShortcut && (
        <kbd className="kbd kbd-sm hidden sm:inline">⌘K</kbd>
      )}
    </button>
  );
} 