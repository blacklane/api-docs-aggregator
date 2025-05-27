import React from 'react';
import CommandPalette from './CommandPalette';
import { useCommandPalette } from '../hooks/useCommandPalette';
import type { ApiItem } from '../config/apis';
import type { EventItem } from '../config/events';

interface GlobalCommandPaletteProps {
  apis: ApiItem[];
  events: EventItem[];
}

export default function GlobalCommandPalette({ apis, events }: GlobalCommandPaletteProps) {
  const { isOpen, closeCommandPalette } = useCommandPalette();

  return (
    <CommandPalette
      apis={apis}
      events={events}
      isOpen={isOpen}
      onClose={closeCommandPalette}
    />
  );
} 