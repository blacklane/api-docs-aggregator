import { useState, useEffect, useMemo } from 'react';
import type { SearchIndex, SearchResult, SearchableApiItem, SearchableEventItem } from '../types/search';

/**
 * Custom hook for loading and searching the search index
 */
export function useSearchIndex() {
  const [searchIndex, setSearchIndex] = useState<SearchIndex | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load search index on mount
  useEffect(() => {
    async function loadSearchIndex() {
      try {
        const response = await fetch('/search-index.json');
        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.status}`);
        }
        const data: SearchIndex = await response.json();
        setSearchIndex(data);
      } catch (err) {
        console.error('Error loading search index:', err);
        setError(err instanceof Error ? err.message : 'Failed to load search index');
      } finally {
        setIsLoading(false);
      }
    }

    loadSearchIndex();
  }, []);

  // Search function
  const search = useMemo(() => {
    return (query: string): SearchResult[] => {
      if (!searchIndex) {
        return [];
      }

      const normalizedQuery = query.toLowerCase().trim();
      const results: SearchResult[] = [];

      // If no query, return all items with score 0 (for display purposes)
      if (!normalizedQuery) {
        // Add all APIs
        for (const api of searchIndex.apis) {
          results.push({
            type: 'api',
            item: api,
            score: 0
          });
        }

        // Add all Events
        for (const event of searchIndex.events) {
          results.push({
            type: 'event',
            item: event,
            score: 0
          });
        }

        // Sort alphabetically by name when no search query
        return results.sort((a, b) => a.item.name.localeCompare(b.item.name));
      }

      // Search APIs
      for (const api of searchIndex.apis) {
        const score = calculateScore(api, normalizedQuery);
        if (score > 0) {
          results.push({
            type: 'api',
            item: api,
            score
          });
        }
      }

      // Search Events
      for (const event of searchIndex.events) {
        const score = calculateScore(event, normalizedQuery);
        if (score > 0) {
          results.push({
            type: 'event',
            item: event,
            score
          });
        }
      }

      // Sort by score (highest first)
      return results.sort((a, b) => b.score - a.score);
    };
  }, [searchIndex]);

  return {
    searchIndex,
    search,
    isLoading,
    error
  };
}

/**
 * Calculate relevance score for a search item
 */
function calculateScore(item: SearchableApiItem | SearchableEventItem, query: string): number {
  const queryWords = query.split(/\s+/).filter(word => word.length > 0);
  let score = 0;

  for (const queryWord of queryWords) {
    // Exact name match (highest score)
    if (item.name.toLowerCase().includes(queryWord)) {
      score += 100;
    }

    // Description match
    if (item.description.toLowerCase().includes(queryWord)) {
      score += 50;
    }

    // Keywords match
    for (const keyword of item.keywords) {
      if (keyword.includes(queryWord)) {
        score += 25;
      }
    }

    // Repository name match
    if (item.repository?.toLowerCase().includes(queryWord)) {
      score += 10;
    }

    // Topics match (GitHub repository topics)
    if (item.topics) {
      for (const topic of item.topics) {
        if (topic.toLowerCase().includes(queryWord)) {
          score += 15;
        }
      }
    }

    // Language match
    if (item.language?.toLowerCase().includes(queryWord)) {
      score += 5;
    }
  }

  return score;
} 