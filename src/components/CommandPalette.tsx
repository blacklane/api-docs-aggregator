import React, { useState, useEffect, useMemo } from 'react';
import { Command } from 'cmdk';
import { Search, FileText, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import type { ApiItem } from '../config/apis';
import type { EventItem } from '../config/events';
import { useSearchIndex } from '../hooks/useSearchIndex';
import type { SearchResult } from '../types/search';

interface CommandPaletteProps {
  apis: ApiItem[];
  events: EventItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ apis, events, isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const { search: searchFunction, isLoading, error } = useSearchIndex();
  
  // Get search results
  const searchResults = useMemo(() => {
    if (!search.trim()) {
      // If no search query, return all items from search index (with rich descriptions)
      if (!searchFunction || isLoading) {
        // Fallback to basic format while loading
        const allApis: SearchResult[] = apis.map(api => ({
          type: 'api' as const,
          item: {
            name: api.name,
            url: api.url,
            description: 'API Documentation',
            keywords: [api.name.toLowerCase()],
            repository: null
          },
          score: 0
        }));
        
        const allEvents: SearchResult[] = events.map(event => ({
          type: 'event' as const,
          item: {
            name: event.name,
            url: event.url,
            description: 'Event Documentation',
            keywords: [event.name.toLowerCase()],
            repository: null
          },
          score: 0
        }));
        
        return [...allApis, ...allEvents];
      }
      
      // Return all items from search index with rich descriptions
      return searchFunction('');
    }
    
    return searchFunction(search);
  }, [search, searchFunction, apis, events, isLoading]);

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
    const encodedName = encodeURIComponent(name).toLowerCase();
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
            {isLoading && (
              <div className="py-8 text-center text-base-content/60">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                Loading search index...
              </div>
            )}
            
            {error && (
              <div className="py-8 text-center text-base-content/60">
                <div className="text-red-500 mb-2">Failed to load search index</div>
                <div className="text-xs">{error}</div>
              </div>
            )}
            
            {!isLoading && !error && (
              <>
                <Command.Empty className="py-8 text-center text-base-content/60">
                  No results found.
                </Command.Empty>
                
                {searchResults.filter(result => result.type === 'api').length > 0 && (
                  <Command.Group heading="APIs" className="mb-4">
                    <div className="text-xs font-semibold text-base-content/60 px-3 py-2 mb-1">
                      APIs
                    </div>
                    {searchResults
                      .filter(result => result.type === 'api')
                      .map((result) => (
                        <Command.Item
                          key={`api-${result.item.name}`}
                          value={`api ${result.item.name} ${result.item.description} ${result.item.keywords.join(' ')}`}
                          onSelect={() => handleSelect('api', result.item.name)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-base-200 data-[selected=true]:bg-base-200 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-primary" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-base-content">{result.item.name}</div>
                              {result.item.language && (
                                <span className="inline-block px-1.5 py-0.5 text-xs bg-base-200 text-base-content/70 rounded">
                                  {result.item.language}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-base-content/60 truncate">{result.item.description}</div>
                            {result.item.topics && result.item.topics.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {result.item.topics.slice(0, 3).map((topic) => (
                                  <span
                                    key={topic}
                                    className="inline-block px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded"
                                  >
                                    {topic}
                                  </span>
                                ))}
                                {result.item.topics.length > 3 && (
                                  <span className="text-xs text-base-content/40">+{result.item.topics.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <ExternalLink className="w-3 h-3 text-base-content/40" />
                        </Command.Item>
                      ))}
                  </Command.Group>
                )}
                
                {searchResults.filter(result => result.type === 'event').length > 0 && (
                  <Command.Group heading="Events" className="mb-4">
                    <div className="text-xs font-semibold text-base-content/60 px-3 py-2 mb-1">
                      Events
                    </div>
                    {searchResults
                      .filter(result => result.type === 'event')
                      .map((result) => (
                        <Command.Item
                          key={`event-${result.item.name}`}
                          value={`event ${result.item.name} ${result.item.description} ${result.item.keywords.join(' ')}`}
                          onSelect={() => handleSelect('event', result.item.name)}
                          className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-base-200 data-[selected=true]:bg-base-200 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-secondary" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-base-content">{result.item.name}</div>
                              {result.item.language && (
                                <span className="inline-block px-1.5 py-0.5 text-xs bg-base-200 text-base-content/70 rounded">
                                  {result.item.language}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-base-content/60 truncate">{result.item.description}</div>
                            {result.item.topics && result.item.topics.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {result.item.topics.slice(0, 3).map((topic) => (
                                  <span
                                    key={topic}
                                    className="inline-block px-1.5 py-0.5 text-xs bg-secondary/10 text-secondary rounded"
                                  >
                                    {topic}
                                  </span>
                                ))}
                                {result.item.topics.length > 3 && (
                                  <span className="text-xs text-base-content/40">+{result.item.topics.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                          <ExternalLink className="w-3 h-3 text-base-content/40" />
                        </Command.Item>
                      ))}
                  </Command.Group>
                )}
              </>
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