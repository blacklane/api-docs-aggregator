import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, FileText, Calendar, ExternalLink } from 'lucide-react';
import type { ApiItem } from '../config/apis';
import type { EventItem } from '../config/events';

interface CommandPaletteProps {
  apis: ApiItem[];
  events: EventItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ apis, events, isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelect = (type: 'api' | 'event', name: string) => {
    const encodedName = encodeURIComponent(name).toLocaleLowerCase();
    if (type === 'api') {
      window.location.href = `/apis/${encodedName}`;
    } else {
      window.location.href = `/events/${encodedName}`;
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl mx-4">
        <Command className="bg-base-100 rounded-lg shadow-2xl border border-base-300 overflow-hidden">
          <div className="flex items-center border-b border-base-300 px-4">
            <Search className="w-5 h-5 text-base-content/60 mr-3" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search APIs and Events..."
              className="flex-1 py-4 bg-transparent outline-none text-base-content placeholder:text-base-content/60"
              autoFocus
            />
          </div>
          
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="py-8 text-center text-base-content/60">
              No results found.
            </Command.Empty>
            
            {apis.length > 0 && (
              <Command.Group heading="APIs" className="mb-4">
                <div className="text-xs font-semibold text-base-content/60 px-3 py-2 mb-1">
                  APIs
                </div>
                {apis.map((api) => (
                  <Command.Item
                    key={`api-${api.name}`}
                    value={`api ${api.name}`}
                    onSelect={() => handleSelect('api', api.name)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-base-200 data-[selected=true]:bg-base-200 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-base-content">{api.name}</div>
                      <div className="text-xs text-base-content/60 truncate">API Documentation</div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-base-content/40" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            
            {events.length > 0 && (
              <Command.Group heading="Events" className="mb-4">
                <div className="text-xs font-semibold text-base-content/60 px-3 py-2 mb-1">
                  Events
                </div>
                {events.map((event) => (
                  <Command.Item
                    key={`event-${event.name}`}
                    value={`event ${event.name}`}
                    onSelect={() => handleSelect('event', event.name)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-base-200 data-[selected=true]:bg-base-200 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-secondary" />
                    <div className="flex-1">
                      <div className="font-medium text-base-content">{event.name}</div>
                      <div className="text-xs text-base-content/60 truncate">Event Documentation</div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-base-content/40" />
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
          
          <div className="border-t border-base-300 px-4 py-3 text-xs text-base-content/60">
            <div className="flex items-center justify-between">
              <span>Use ↑↓ to navigate, ↵ to select, ESC to close</span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-base-200 rounded text-xs">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-base-200 rounded text-xs">K</kbd>
                <span className="ml-1">to open</span>
              </span>
            </div>
          </div>
        </Command>
      </div>
    </div>
  );
} 