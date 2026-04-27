'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { LocationPickerModal } from './location-picker-modal';

export function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { country } = useLocation();
  const [searchFocused, setSearchFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

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

  const [catOpen,       setCatOpen]       = useState(false);
  const [selectedCat,   setSelectedCat]   = useState('All Categories');
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/feed', label: 'Shorts', badge: 'Live' },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <header className="hidden md:block sticky top-0 z-50">
        {/* Top Utility Bar */}
        <div className="bg-gradient-to-r from-primary via-primary to-red-700 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-9">
              <div className="flex items-center gap-6 text-xs">
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="flex items-center gap-1.5 hover:text-white/80 transition-colors group"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{mounted ? `${flagEmoji(country.code)} ${country.name}` : 'Kenya'}</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="h-3 w-px bg-white/20" />
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5" />
                    24/7 Support
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <button 
                  onClick={toggleTheme} 
                  className="flex items-center gap-1.5 hover:text-white/80 transition-colors"
                >
                  {mounted && isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{mounted && isDarkMode ? 'Light' : 'Dark'}</span>
                </button>
                <div className="h-3 w-px bg-white/20" />
                {mounted && isLoggedIn ? (
                  <Link href="/account" className="hover:text-white/80 transition-colors">My Account</Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/auth/login" className="hover:text-white/80 transition-colors">Login</Link>
                    <span className="text-white/40">|</span>
                    <Link href="/auth/signup" className="hover:text-white/80 transition-colors">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-surface border-b border-theme shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-8 h-[72px]">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-theme-primary leading-tight">AOS</span>
                  <span className="text-[10px] text-theme-muted font-medium tracking-wide">MARKETPLACE</span>
                </div>
              </Link>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl">
                <div className={`relative flex items-center transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                  {/* Custom category dropdown */}
                  <div ref={catRef} className="absolute left-0 h-full flex items-center z-50">
                    <button
                      onClick={() => setCatOpen(o => !o)}
                      className="h-full flex items-center gap-1.5 pl-3.5 pr-3 bg-elevated border-r border-theme rounded-l-xl text-xs font-medium text-theme-secondary hover:text-theme-primary transition-colors whitespace-nowrap"
                    >
                      {(() => { const Icon = CAT_ICONS[selectedCat] || LayoutGrid; return <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />; })()}
                      <span className="max-w-[88px] truncate">{selectedCat === 'All Categories' ? 'All' : selectedCat}</span>
                      <ChevronDown className={`w-3 h-3 flex-shrink-0 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {catOpen && (
                      <div className="absolute top-full left-0 mt-1 w-52 bg-surface border border-theme rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-1.5 max-h-72 overflow-y-auto hide-scrollbar">
                          {catItems.map(({ label }) => {
                            const Icon = CAT_ICONS[label] || LayoutGrid;
                            const active = selectedCat === label;
                            return (
                              <button
                                key={label}
                                onClick={() => { setSelectedCat(label); setCatOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-medium transition-colors ${
                                  active
                                    ? 'bg-primary text-white'
                                    : 'text-theme-primary hover:bg-elevated'
                                }`}
                              >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  active ? 'bg-white/20' : 'bg-primary/10'
                                }`}>
                                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-primary'}`} />
                                </div>
                                {label}
                                {active && <ChevronRight className="w-3 h-3 ml-auto opacity-70" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Search for products, brands and more..."
                    className="w-full bg-elevated border border-theme rounded-xl py-3 pl-36 pr-12 text-sm text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary hover:bg-primary-hover rounded-lg flex items-center justify-center transition-colors">
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-1">
                <Link 
                  href="/notifications" 
                  className="relative p-2.5 rounded-xl hover:bg-elevated text-theme-secondary hover:text-theme-primary transition-colors group"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface" />
                </Link>
                <Link 
                  href="/account/wishlist" 
                  className="relative p-2.5 rounded-xl hover:bg-elevated text-theme-secondary hover:text-theme-primary transition-colors group"
                >
                  <Heart className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">3</span>
                </Link>
                <Link 
                  href="/contact" 
                  className="relative p-2.5 rounded-xl hover:bg-elevated text-theme-secondary hover:text-theme-primary transition-colors group"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">2</span>
                </Link>
                {mounted && isLoggedIn && user && (
                  <Link
                    href="/account"
                    className="relative p-2.5 rounded-xl hover:bg-elevated text-theme-secondary hover:text-theme-primary transition-colors group"
                    title="My Account"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white text-xs font-bold leading-none">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                  </Link>
                )}
                <div className="w-px h-6 bg-theme mx-2" />
                <Link
                  href="/sell"
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white pl-4 pr-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  Sell Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-surface border-b border-theme">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-12">
              <nav className="flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-primary bg-primary/5'
                          : 'text-theme-secondary hover:text-theme-primary hover:bg-elevated'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {link.label}
                        {link.badge && (
                          <span className="px-1.5 py-0.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[9px] font-bold rounded-md uppercase animate-pulse">
                            {link.badge}
                          </span>
                        )}
                      </span>
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex items-center gap-4 text-xs text-theme-muted">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  Buyer Protection
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-50">
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
                Search products...
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-theme z-50 shadow-nav">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
          {[
            { href: '/', label: 'Home', icon: Home, special: false },
            { href: '/categories', label: 'Shop', icon: LayoutGrid, special: false },
            { href: '/sell', label: 'Sell', icon: Plus, special: true },
            { href: '/feed', label: 'Feed', icon: PlayCircle, special: false },
            { href: '/account', label: 'Account', icon: UserCircle, special: false },
          ].map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            if (item.special) {
              return (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 flex-1">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-semibold text-theme-primary">Sell</span>
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
