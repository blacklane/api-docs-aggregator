export interface SearchableApiItem {
  name: string;
  url: string;
  description: string;
  keywords: string[];
  repository: string | null;
  language?: string;
  topics?: string[];
}

export interface SearchableEventItem {
  name: string;
  url: string;
  description: string;
  keywords: string[];
  repository: string | null;
  language?: string;
  topics?: string[];
}

export interface SearchIndex {
  apis: SearchableApiItem[];
  events: SearchableEventItem[];
  lastUpdated: string;
}

export interface SearchResult {
  type: 'api' | 'event';
  item: SearchableApiItem | SearchableEventItem;
  score: number;
} 