'use client';

// Per-chat wallpaper persistence, mirroring the mobile ChatWallpaperService.
// A wallpaper is either the default (theme background) or a solid color.

export interface ChatWallpaper {
  kind: 'default' | 'solid';
  color?: string;
}

export const LIGHT_PRESETS = [
  '#FDF6EC', // warm cream
  '#EAF4EE', // soft mint
  '#EDF2FB', // pale blue
  '#FBEDF1', // blush pink
  '#F3EEFB', // lavender
  '#F5F1E8', // sand
];

export const DARK_PRESETS = [
  '#1A2027', // slate
  '#1E2320', // deep moss
  '#201B26', // plum
  '#241E1B', // espresso
  '#1B2430', // midnight blue
  '#26202A', // charcoal violet
];

const KEY_PREFIX = 'aos-chat-wallpaper:';

export function getWallpaper(chatKey: string): ChatWallpaper {
  if (typeof window === 'undefined') return { kind: 'default' };
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + chatKey);
    if (!raw) return { kind: 'default' };
    return JSON.parse(raw) as ChatWallpaper;
  } catch {
    return { kind: 'default' };
  }
}

export function setWallpaper(chatKey: string, wallpaper: ChatWallpaper) {
  try {
    if (wallpaper.kind === 'default') {
      window.localStorage.removeItem(KEY_PREFIX + chatKey);
    } else {
      window.localStorage.setItem(KEY_PREFIX + chatKey, JSON.stringify(wallpaper));
    }
  } catch {
    // storage unavailable — wallpaper just won't persist
  }
}
