'use client';

import React from 'react';
import { Search, Mic, Camera } from 'lucide-react';

interface SearchBarProps {
  variant?: 'default' | 'home';
  onSearch?: (query: string) => void;
}

export function SearchBar({ variant = 'default', onSearch }: SearchBarProps) {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const isHome = variant === 'home';

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
      {/* Search input — pill shape */}
      <div className="flex-1 bg-surface rounded-full border border-theme flex items-center gap-2 px-4 py-2.5">
        <Search className="w-4 h-4 text-theme-muted flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search here..."
          className="flex-1 bg-transparent outline-none text-theme-primary placeholder:text-theme-muted text-sm"
        />
      </div>
      {/* Mic button */}
      <button
        type="button"
        className="w-10 h-10 rounded-xl bg-elevated border border-theme flex items-center justify-center hover:bg-primary/10 transition-colors flex-shrink-0"
      >
        <Mic className="w-4 h-4 text-theme-muted" />
      </button>
      {/* Camera button */}
      <button
        type="button"
        className="w-10 h-10 rounded-xl bg-elevated border border-theme flex items-center justify-center hover:bg-primary/10 transition-colors flex-shrink-0"
      >
        <Camera className="w-4 h-4 text-theme-muted" />
      </button>
    </form>
  );
}
