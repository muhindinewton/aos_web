'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, MapPin, Check, Navigation } from 'lucide-react';
import { COUNTRIES, flagEmoji, useLocation } from '../providers/location-provider';

interface LocationPickerModalProps {
  onClose: () => void;
}

export function LocationPickerModal({ onClose }: LocationPickerModalProps) {
  const { country: selected, setCountry } = useLocation();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    setTimeout(() => selectedRef.current?.scrollIntoView({ block: 'center' }), 80);
  }, []);

  const filtered = query.trim()
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : COUNTRIES;

  const handleSelect = (code: string, name: string) => {
    setCountry({ code, name });
    onClose();
  };

  const handleAutoDetect = () => {
    handleSelect('KE', 'Kenya');
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-lg rounded-t-3xl md:rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        style={{ maxHeight: '90dvh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-elevated" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-theme flex-shrink-0">
          <h2 className="text-lg font-bold text-theme-primary">Select Country</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-elevated flex items-center justify-center hover:bg-theme transition-colors"
          >
            <X className="w-4 h-4 text-theme-muted" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country..."
              className="w-full bg-elevated border border-theme rounded-xl py-2.5 pl-10 pr-10 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted hover:text-theme-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Auto-detect (only when not searching) */}
        {!query && (
          <div className="px-5 pb-3 flex-shrink-0">
            <button
              onClick={handleAutoDetect}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-elevated border border-theme hover:border-primary/40 transition-colors group"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Navigation className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-theme-primary">Use my current location</p>
                <p className="text-xs text-theme-muted mt-0.5">Automatically detect your country</p>
              </div>
            </button>
          </div>
        )}

        {/* Divider label */}
        {!query && (
          <p className="px-5 pb-2 text-xs font-semibold text-theme-muted uppercase tracking-wider flex-shrink-0">
            All Countries
          </p>
        )}

        {/* Country list */}
        <div className="overflow-y-auto flex-1 pb-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-theme-muted">
              <MapPin className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No countries found</p>
            </div>
          ) : (
            <ul>
              {filtered.map((c, idx) => {
                const isSelected = c.code === selected.code;
                const isLast = idx === filtered.length - 1;
                return (
                  <li key={c.code}>
                    <button
                      ref={isSelected ? selectedRef : undefined}
                      onClick={() => handleSelect(c.code, c.name)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors ${
                        isSelected ? 'bg-primary/5' : 'hover:bg-elevated'
                      }`}
                    >
                      <span className="text-2xl leading-none select-none w-8 text-center" aria-hidden>
                        {flagEmoji(c.code)}
                      </span>
                      <span className={`flex-1 text-sm ${isSelected ? 'font-semibold text-theme-primary' : 'text-theme-secondary'}`}>
                        {c.name}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                    </button>
                    {!isLast && <div className="mx-5 h-px bg-theme opacity-60" />}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
