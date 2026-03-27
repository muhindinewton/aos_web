'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, PlusCircle, MessageCircle, User, Search, Heart, Bell, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../providers/auth-provider';
import { useTheme } from '../providers/theme-provider';

export function Navbar() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/categories', label: 'Categories' },
    { href: '/shop', label: 'Shop' },
    { href: '/sell', label: 'Sell' },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <header className="hidden md:block sticky top-0 z-50 bg-surface border-b border-theme">
        <div className="bg-primary text-white text-xs py-1.5">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>Nairobi, Kenya</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="hover:underline">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
              {isLoggedIn ? (
                <Link href="/account" className="hover:underline">My Account</Link>
              ) : (
                <div className="flex gap-3">
                  <Link href="/auth/login" className="hover:underline">Login</Link>
                  <Link href="/auth/signup" className="hover:underline">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-primary shrink-0">
            Africa Online Stores
          </Link>
          <Link href="/search" className="flex-1 max-w-2xl relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
            <div className="w-full bg-elevated border border-theme rounded-lg py-2.5 pl-10 pr-4 text-sm text-theme-muted cursor-text">
              Search products, categories, brands...
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary bg-primary/5'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-elevated'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/contact" className="p-2 rounded-lg hover:bg-elevated text-theme-secondary">
              <MessageCircle className="w-5 h-5" />
            </Link>
            <Link href="/account/wishlist" className="p-2 rounded-lg hover:bg-elevated text-theme-secondary">
              <Heart className="w-5 h-5" />
            </Link>
            <Link
              href="/sell"
              className="ml-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Sell Now
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar */}
      <header className="md:hidden sticky top-0 z-50 bg-surface border-b border-theme px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold text-primary shrink-0">AOS</Link>
          <Link href="/search" className="flex-1 relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
            <div className="w-full bg-elevated border border-theme rounded-lg py-2 pl-9 pr-3 text-sm text-theme-muted">
              Search...
            </div>
          </Link>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-elevated text-theme-secondary">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-theme z-50 shadow-nav">
        <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
          {[
            { href: '/', label: 'Home', icon: Home, special: false },
            { href: '/categories', label: 'Categories', icon: LayoutGrid, special: false },
            { href: '/sell', label: 'Sell', icon: PlusCircle, special: true },
            { href: '/contact', label: 'Chat', icon: MessageCircle, special: false },
            { href: '/account', label: 'Account', icon: User, special: false },
          ].map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            if (item.special) {
              return (
                <Link key={item.href} href={item.href} className="relative -top-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 ${isActive ? 'text-primary' : 'text-theme-muted'}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
