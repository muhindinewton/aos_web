'use client';

import { useEffect, useState } from 'react';

// Tracks which sellers the buyer has contacted (called or messaged). Used to
// gate the "Review Product" CTAs — mirroring the mobile rule that you can
// only review a seller you've actually interacted with.

const KEY = 'aos_contacted_sellers';
const CHANGE_EVENT = 'aos_contacted_change';

function read(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = window.localStorage.getItem(KEY);
    return new Set<string>(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function write(set: Set<string>) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
    // Notify same-tab listeners (storage event only fires cross-tab)
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore quota / disabled-storage failures
  }
}

export function markContacted(sellerId: string | undefined | null) {
  if (!sellerId || typeof window === 'undefined') return;
  const set = read();
  if (set.has(sellerId)) return;
  set.add(sellerId);
  write(set);
}

export function useHasContactedSeller(sellerId: string | undefined | null): boolean {
  const [contacted, setContacted] = useState(false);

  useEffect(() => {
    if (!sellerId) {
      setContacted(false);
      return;
    }
    const update = () => setContacted(read().has(sellerId));
    update();
    window.addEventListener(CHANGE_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CHANGE_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, [sellerId]);

  return contacted;
}
