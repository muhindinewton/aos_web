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
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`bg-theme-surface rounded-xl border border-theme-border/30 flex items-center gap-2 ${isHome ? 'px-3 py-1.5' : 'px-4 py-3'}`}>
        <Search className="w-5 h-5 text-theme-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="flex-1 bg-transparent outline-none text-theme-primary placeholder:text-theme-muted text-base"
        />
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="p-2 rounded-lg bg-theme-elevated hover:bg-primary/10 transition-colors"
          >
            <Mic className="w-5 h-5 text-theme-muted" />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg bg-theme-elevated hover:bg-primary/10 transition-colors"
          >
            <Camera className="w-5 h-5 text-theme-muted" />
          </button>
        </div>
      </div>
    </form>
  );
}
