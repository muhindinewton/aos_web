'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  Home, 
  Plus,
  MessageCircle,
  Search,
  Mic,
  Camera,
  Heart, 
  Bell, 
  MapPin, 
  ChevronDown,
  PlayCircle,
  Sun,
  Moon,
  ShoppingBag,
  Headphones,
  Shield,
  Menu,
  X,
  UserCircle,
} from 'lucide-react';
import { useAuth } from '../providers/auth-provider';
import { useTheme } from '../providers/theme-provider';
import { useLocation, flagEmoji } from '../providers/location-provider';
import { usePreferences } from '../providers/preferences-provider';
import { LocationPickerModal } from './location-picker-modal';

// The AOS Connect screen (all three aliases) is full-bleed on mobile — it has
// its own floating Chats/Calls bar, so the global tab bar hides there.
export const CONNECT_ROUTES = ['/chat', '/calls', '/contact'];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { country, city } = useLocation();
  const { t } = usePreferences();
  const [mounted, setMounted] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Header search query. Synced from ?q= by <SearchQuerySync> below, so the box
  // reflects the active search however it was started — typed here, or picked
  // from the recent/trending lists on /search.
  const [query, setQuery] = useState('');

  const navLinks = [
    { href: '/', label: t('nav_home') },
    { href: '/shop', label: t('nav_shop') },
    { href: '/feed', label: t('nav_shorts'), badge: 'Live' },
    { href: '/account/wishlist', label: 'Wishlist' },
    { href: '/chat', label: 'Connect' },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <header className="hidden lg:block sticky top-0 z-50">
        {/* Main Header */}
        <div className="bg-surface border-b border-theme">
          <div className="max-w-7xl mx-auto px-6">
            {/* Logo and actions sit in equal-width rails (flex-1 basis-0) so the
                search bar lands on the true centre of the header rather than
                hugging the logo. Neither rail has min-w-0, so at narrow widths
                they floor at their content width instead of overflowing — the
                bar just drifts slightly off-centre rather than breaking. */}
            <div className="flex items-center gap-6 h-[68px]">
              {/* Logo */}
              <div className="flex-1 basis-0 flex items-center">
              <Link href="/" className="flex items-center gap-2.5 shrink-0">
                <div className="w-9 h-9 bg-[#17181C] rounded-xl flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/aos-logo.png" alt="AOS logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-bold text-theme-primary tracking-tight">AOS</span>
              </Link>
              </div>

              {/* Search Bar */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const q = query.trim();
                  // Carry the query so /search runs it on arrival. Submitting an
                  // empty box just opens the browse view.
                  router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
                }}
                className="w-full max-w-2xl min-w-0"
              >
                <Suspense fallback={null}><SearchQuerySync onQuery={setQuery} /></Suspense>
                <div className="flex items-center bg-elevated rounded-full border border-transparent focus-within:border-primary/40 focus-within:bg-surface transition-colors">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-theme-muted pointer-events-none" />
                    <input
                      type="search"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      placeholder={t('search_placeholder')}
                      aria-label="Search"
                      className="w-full bg-transparent rounded-full py-2.5 pl-11 pr-2 text-sm text-theme-primary placeholder:text-theme-muted outline-none [&::-webkit-search-cancel-button]:hidden"
                    />
                  </div>
                  {/* Voice / image search — same destinations as the /search page.
                      type="button" so they don't submit the surrounding form. */}
                  <div className="flex items-center gap-0.5 pr-1.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => router.push('/search/voice')}
                      aria-label="Voice search"
                      title="Voice search"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-theme-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Mic className="w-[17px] h-[17px]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push('/search/image')}
                      aria-label="Image search"
                      title="Image search"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-theme-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Camera className="w-[17px] h-[17px]" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Actions */}
              {/* min-w-max: the rail may grow to balance the logo side, but never
                  compresses below its content — without it the Post Now label
                  wraps to two lines at the lg breakpoint. */}
              <div className="flex-1 basis-0 min-w-max flex items-center justify-end gap-0.5">
                <Link
                  href="/notifications"
                  className="relative p-2.5 rounded-full hover:bg-elevated text-theme-secondary hover:text-theme-primary transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface" />
                </Link>

                {/* Account dropdown — houses profile, theme, support, auth */}
                <div ref={accountRef} className="relative ml-1">
                  <button
                    onClick={() => setAccountOpen(o => !o)}
                    className="flex items-center gap-1 p-1.5 rounded-full hover:bg-elevated transition-colors"
                    title="Account"
                  >
                    {mounted && isLoggedIn && user ? (
                      <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold leading-none">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </span>
                    ) : (
                      <UserCircle className="w-6 h-6 text-theme-secondary" />
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-theme-muted transition-transform ${accountOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-surface border border-theme rounded-2xl shadow-2xl overflow-hidden z-[60] py-1.5">
                      {mounted && isLoggedIn ? (
                        <Link href="/account" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors">
                          <UserCircle className="w-4.5 h-4.5 w-[18px] h-[18px] text-theme-muted" /> {t('top_my_account')}
                        </Link>
                      ) : (
                        <div className="flex gap-2 px-3 py-2">
                          <Link href="/auth/login" onClick={() => setAccountOpen(false)} className="flex-1 py-2 rounded-full border border-theme text-center text-xs font-semibold text-theme-primary hover:bg-elevated transition-colors">
                            {t('top_login')}
                          </Link>
                          <Link href="/auth/signup" onClick={() => setAccountOpen(false)} className="flex-1 py-2 rounded-full bg-primary text-center text-xs font-semibold text-white hover:bg-primary-hover transition-colors">
                            {t('top_register')}
                          </Link>
                        </div>
                      )}
                      <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors"
                      >
                        {mounted && isDarkMode
                          ? <Sun className="w-[18px] h-[18px] text-theme-muted" />
                          : <Moon className="w-[18px] h-[18px] text-theme-muted" />}
                        {mounted && isDarkMode ? t('top_light') : t('top_dark')}
                      </button>
                      <Link href="/help" onClick={() => setAccountOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-theme-primary hover:bg-elevated transition-colors">
                        <Headphones className="w-[18px] h-[18px] text-theme-muted" /> {t('top_support')}
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/sell"
                  className="ml-2 flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  {t('nav_post_now')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-surface border-b border-theme">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative flex items-center h-11">
              {/* Location — leftmost; shows the picked city when one is chosen */}
              <button
                onClick={() => setShowLocationPicker(true)}
                className="flex items-center gap-1.5 text-xs text-theme-secondary hover:text-theme-primary transition-colors max-w-[220px]"
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {mounted
                    ? `${flagEmoji(country.code)} ${city ? `${city}, ` : ''}${country.name}`
                    : 'Kenya'}
                </span>
                <ChevronDown className="w-3 h-3 flex-shrink-0" />
              </button>

              {/* Nav links — centered */}
              <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'text-primary'
                          : 'text-theme-secondary hover:text-theme-primary hover:bg-elevated'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {link.label}
                        {link.badge && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" title={link.badge} />
                        )}
                      </span>
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <span className="ml-auto flex items-center gap-1.5 text-xs text-theme-muted">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                {t('top_buyer_protect')}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar — only on home & categories */}
      <header className={`lg:hidden sticky top-0 z-50 ${pathname === '/' || pathname === '/categories' ? '' : 'hidden'}`}>
        {/* Mini utility bar */}
        <div className="bg-gradient-to-r from-primary to-red-600 text-white px-4 py-1.5">
          <div className="flex justify-between items-center text-[10px]">
            <button
              onClick={() => setShowLocationPicker(true)}
              className="flex items-center gap-1 hover:text-white/80 transition-colors"
            >
              <MapPin className="w-3 h-3" />
              <span>{mounted ? `${flagEmoji(country.code)} ${country.name}` : 'Kenya'}</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
        {/* Main mobile header */}
        <div className="bg-surface border-b border-theme px-4 py-2.5">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 bg-[#17181C] rounded-lg flex items-center justify-center p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/aos-logo.png" alt="AOS logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-base font-bold text-theme-primary">AOS</span>
            </Link>
            <Link href="/search" className="flex-1 relative block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
              <div className="w-full bg-elevated border border-theme rounded-xl py-2.5 pl-9 pr-3 text-sm text-theme-muted">
                {t('search_placeholder_mobile')}
              </div>
            </Link>
            <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-elevated text-theme-secondary">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav — hidden on the Connect screen, which brings its
          own floating Chats/Calls bar */}
      {!CONNECT_ROUTES.includes(pathname) && (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-theme z-50 shadow-nav">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {[
            { href: '/', label: t('nav_home'), icon: Home, special: false },
            { href: '/feed', label: t('nav_feed'), icon: PlayCircle, special: false },
            { href: '/sell', label: 'Post', icon: Plus, special: true },
            { href: '/chat', label: 'Connect', icon: MessageCircle, special: false },
            { href: '/account', label: t('nav_account'), icon: UserCircle, special: false },
          ].map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            if (item.special) {
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-semibold text-theme-primary">Post</span>
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <div className={`p-2 rounded-xl transition-colors ${
                  isActive ? 'bg-primary/10' : ''
                }`}>
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-theme-muted'}`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary font-semibold' : 'text-theme-muted'
                }`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      )}
      {showLocationPicker && <LocationPickerModal onClose={() => setShowLocationPicker(false)} />}
    </>
  );
}

// Mirrors ?q= into the header box, and clears it when you leave the results.
//
// Split into its own component purely so the caller can wrap it in <Suspense>:
// useSearchParams() forces everything up to the nearest boundary to render on
// the client, and BottomNav lives in the root layout — calling it inline would
// opt every page in the app out of static rendering. Isolated like this, only
// this null-rendering leaf deopts.
function SearchQuerySync({ onQuery }: { onQuery: (q: string) => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') ?? '';

  useEffect(() => {
    onQuery(pathname === '/search' ? q : '');
  }, [pathname, q, onQuery]);

  return null;
}
