'use client';

// Web port of mobile's chat_settings_screen.dart — Connect's own settings,
// reached from the ≡ menu on the AOS Connect screen.

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, ChevronRight, UserX, Wallpaper, CheckCircle2, RefreshCw,
} from 'lucide-react';
import { useTheme } from '../../providers/theme-provider';
import { useToast } from '../../providers/toast-provider';
import {
  getWallpaper, setWallpaper, LIGHT_PRESETS, DARK_PRESETS,
  DEFAULT_WALLPAPER_KEY, type ChatWallpaper,
} from '../../lib/chat-wallpaper';

type Toggles = {
  readReceipts: boolean;
  lastSeen: boolean;
  enterIsSend: boolean;
  autoDownload: boolean;
  messageNotifications: boolean;
  callNotifications: boolean;
  inAppSounds: boolean;
};

const DEFAULTS: Toggles = {
  readReceipts: true,
  lastSeen: true,
  enterIsSend: true,
  autoDownload: true,
  messageNotifications: true,
  callNotifications: true,
  inAppSounds: true,
};

const STORE_KEY = 'aos-chat-settings';

export default function ChatSettingsPage() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const [toggles, setToggles] = useState<Toggles>(DEFAULTS);
  const [wallpaperOpen, setWallpaperOpen] = useState(false);
  const [wallpaper, setWallpaperState] = useState<ChatWallpaper>({ kind: 'default' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) setToggles({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* storage unavailable */ }
    setWallpaperState(getWallpaper(DEFAULT_WALLPAPER_KEY));
  }, []);

  const flip = (key: keyof Toggles) => {
    setToggles(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const applyDefaultWallpaper = (w: ChatWallpaper) => {
    setWallpaper(DEFAULT_WALLPAPER_KEY, w);
    setWallpaperState(w);
    setWallpaperOpen(false);
    showToast('Default chat wallpaper updated');
  };

  const presets = mounted && isDarkMode ? DARK_PRESETS : LIGHT_PRESETS;

  return (
    <div className="max-w-2xl mx-auto pb-24 lg:pb-10">
      {/* App bar */}
      <div className="sticky top-0 z-20 bg-surface border-b border-theme px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-surface border border-theme flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-theme-primary" />
        </button>
        <h1 className="text-base font-semibold text-theme-primary">Chat Settings</h1>
      </div>

      <div className="px-4 pt-5 space-y-6">
        {/* ── Privacy ── */}
        <section>
          <h2 className="text-sm font-semibold text-theme-muted mb-2">Privacy</h2>
          <div className="bg-surface border border-theme rounded-2xl divide-y divide-[var(--border,#E8E8E8)] overflow-hidden">
            <ToggleRow
              title="Read receipts"
              subtitle="Send and receive read confirmations"
              on={toggles.readReceipts}
              onFlip={() => flip('readReceipts')}
            />
            <ToggleRow
              title="Last seen & online"
              subtitle="Let others see when you were last active"
              on={toggles.lastSeen}
              onFlip={() => flip('lastSeen')}
            />
            <button
              onClick={() => showToast('Blocked contacts — coming soon')}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-elevated transition-colors"
            >
              <UserX className="w-5 h-5 text-theme-muted" />
              <span className="flex-1 text-left text-sm text-theme-primary">Blocked contacts</span>
              <ChevronRight className="w-4 h-4 text-theme-muted" />
            </button>
          </div>
        </section>

        {/* ── Chats ── */}
        <section>
          <h2 className="text-sm font-semibold text-theme-muted mb-2">Chats</h2>
          <div className="bg-surface border border-theme rounded-2xl divide-y divide-[var(--border,#E8E8E8)] overflow-hidden">
            <div className="relative">
              <button
                onClick={() => setWallpaperOpen(v => !v)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-elevated transition-colors"
              >
                <Wallpaper className="w-5 h-5 text-theme-muted" />
                <span className="flex-1 text-left">
                  <span className="block text-sm text-theme-primary">Chat wallpaper</span>
                  <span className="block text-[11px] text-theme-muted">Set a default background for chats</span>
                </span>
                {mounted && wallpaper.kind === 'solid' && (
                  <span
                    className="w-6 h-6 rounded-full border border-theme"
                    style={{ backgroundColor: wallpaper.color }}
                  />
                )}
                <ChevronRight className={`w-4 h-4 text-theme-muted transition-transform ${wallpaperOpen ? 'rotate-90' : ''}`} />
              </button>

              {/* Anchored wallpaper picker */}
              {wallpaperOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-theme bg-elevated/40">
                  <button
                    onClick={() => applyDefaultWallpaper({ kind: 'default' })}
                    className={`mt-3 w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                      wallpaper.kind === 'default'
                        ? 'border-primary bg-primary/5 text-primary font-semibold'
                        : 'border-theme bg-surface text-theme-primary'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="flex-1 text-left">Default</span>
                    {wallpaper.kind === 'default' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {presets.map(color => {
                      const selected = wallpaper.kind === 'solid' && wallpaper.color === color;
                      return (
                        <button
                          key={color}
                          onClick={() => applyDefaultWallpaper({ kind: 'solid', color })}
                          className={`w-11 h-11 rounded-full border transition-all flex items-center justify-center ${
                            selected ? 'border-primary border-2 scale-105' : 'border-theme'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Wallpaper ${color}`}
                        >
                          {selected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <ToggleRow
              title="Enter is send"
              subtitle="Enter key sends your message"
              on={toggles.enterIsSend}
              onFlip={() => flip('enterIsSend')}
            />
            <ToggleRow
              title="Media auto-download"
              subtitle="Automatically save incoming photos"
              on={toggles.autoDownload}
              onFlip={() => flip('autoDownload')}
            />
          </div>
        </section>

        {/* ── Notifications ── */}
        <section>
          <h2 className="text-sm font-semibold text-theme-muted mb-2">Notifications</h2>
          <div className="bg-surface border border-theme rounded-2xl divide-y divide-[var(--border,#E8E8E8)] overflow-hidden">
            <ToggleRow
              title="Message notifications"
              subtitle="Alerts for new messages"
              on={toggles.messageNotifications}
              onFlip={() => flip('messageNotifications')}
            />
            <ToggleRow
              title="Call notifications"
              subtitle="Alerts for incoming calls"
              on={toggles.callNotifications}
              onFlip={() => flip('callNotifications')}
            />
            <ToggleRow
              title="In-app sounds"
              subtitle="Play sounds for messages and calls"
              on={toggles.inAppSounds}
              onFlip={() => flip('inAppSounds')}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ToggleRow({
  title, subtitle, on, onFlip,
}: { title: string; subtitle: string; on: boolean; onFlip: () => void }) {
  return (
    <button
      onClick={onFlip}
      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-elevated transition-colors"
      role="switch"
      aria-checked={on}
    >
      <span className="flex-1 text-left">
        <span className="block text-sm text-theme-primary">{title}</span>
        <span className="block text-[11px] text-theme-muted">{subtitle}</span>
      </span>
      <span className={`w-11 h-[26px] rounded-full p-0.5 transition-colors flex-shrink-0 ${on ? 'bg-primary' : 'bg-theme-muted/30'}`}>
        <span className={`block w-[22px] h-[22px] rounded-full bg-white shadow transition-transform ${on ? 'translate-x-[18px]' : ''}`} />
      </span>
    </button>
  );
}
