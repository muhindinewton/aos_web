'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Plus,
  MessageCircle, 
  Search, 
  Heart, 
  Bell, 
  MapPin, 
  ChevronDown,
  ChevronRight,
  PlayCircle,
  Sun,
  Moon,
  ShoppingBag,
  Headphones,
  Shield,
  Menu,
  X,
  Store,
  LayoutGrid,
  UserCircle,
  Car,
  Smartphone,
  Monitor,
  Sofa,
  Shirt,
  Sparkles,
  Wrench,
  Baby,
  Cat,
} from 'lucide-react';
import { useAuth } from '../providers/auth-provider';
import { categories } from '../lib/data';
import { useTheme } from '../providers/theme-provider';
import { useLocation, flagEmoji } from '../providers/location-provider';
import { usePreferences } from '../providers/preferences-provider';
import { LocationPickerModal } from './location-picker-modal';

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

  const CAT_ICONS: Record<string, React.ElementType> = {
    'All Categories': LayoutGrid,
    'Vehicles':       Car,
    'Property':       Home,
    'Phones':         Smartphone,
    'Electronics':    Monitor,
    'Furniture':      Sofa,
    'Fashion':        Shirt,
    'Beauty':         Sparkles,
    'Services':       Wrench,
    'Kids':           Baby,
    'Pets':           Cat,
  };

  const catItems = [
    { label: 'All Categories' },
    ...categories.filter(c => c.id !== 'all').map(c => ({ label: c.name })),
  ];

  const [catOpen, setCatOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
            <div className="flex items-center gap-6 h-[68px]">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 shrink-0">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <Store className="w-[18px] h-[18px] text-white" />
                </div>
                <span className="text-xl font-bold text-theme-primary tracking-tight">AOS</span>
              </Link>

              {/* Search Bar — category scope + query, like the big marketplaces */}
              <form
                onSubmit={e => {
                  e.preventDefault();
                  router.push(
                    selectedCat === 'All Categories'
                      ? '/search'
                      : `/shop?category=${encodeURIComponent(selectedCat)}`,
                  );
                }}
                className="flex-1 max-w-2xl"
              >
                <div className="flex items-center bg-elevated rounded-full border border-transparent focus-within:border-primary/40 focus-within:bg-surface transition-colors">
                  {/* Category scope */}
                  <div ref={catRef} className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setCatOpen(o => !o)}
                      className="flex items-center gap-1.5 pl-4 pr-3 py-2.5 rounded-l-full text-xs font-medium text-theme-secondary hover:text-theme-primary transition-colors whitespace-nowrap"
                    >
                      {(() => { const Icon = CAT_ICONS[selectedCat] || LayoutGrid; return <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />; })()}
                      <span className="max-w-[96px] truncate">{selectedCat === 'All Categories' ? 'All' : selectedCat}</span>
                      <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {catOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-surface border border-theme rounded-2xl shadow-2xl overflow-hidden z-[60]">
                        <div className="p-1.5 max-h-80 overflow-y-auto hide-scrollbar">
                          {catItems.map(({ label }) => {
                            const Icon = CAT_ICONS[label] || LayoutGrid;
                            const active = selectedCat === label;
                            return (
                              <button
                                key={label}
                                type="button"
                                onClick={() => { setSelectedCat(label); setCatOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm font-medium transition-colors ${
                                  active ? 'bg-primary/10 text-primary' : 'text-theme-primary hover:bg-elevated'
                                }`}
                              >
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary/15' : 'bg-primary/10'}`}>
                                  <Icon className="w-3.5 h-3.5 text-primary" />
                                </span>
                                {label}
                                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="w-px h-5 bg-theme flex-shrink-0" />
                  {/* Query */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-theme-muted pointer-events-none" />
                    <input
                      type="text"
                      placeholder={t('search_placeholder')}
                      className="w-full bg-transparent rounded-r-full py-2.5 pl-10 pr-4 text-sm text-theme-primary placeholder:text-theme-muted outline-none"
                    />
                  </div>
                </div>
              </form>

              {/* Actions */}
              <div className="flex items-center gap-0.5 ml-auto">
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
                  className="ml-2 flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('nav_sell_now')}
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
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-red-600 rounded-lg flex items-center justify-center">
                <Store className="w-4 h-4 text-white" />
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

      {/* Mobile Bottom Nav */}
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
      {showLocationPicker && <LocationPickerModal onClose={() => setShowLocationPicker(false)} />}
    </>
  );
}
