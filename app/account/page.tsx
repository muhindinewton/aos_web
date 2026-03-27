'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, HelpCircle, Settings, ChevronRight, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../providers/auth-provider';
import { useTheme } from '../providers/theme-provider';

export default function AccountPage() {
  const { user, isLoggedIn, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold text-theme-primary mb-6">Account</h1>

      {/* Profile */}
      {isLoggedIn ? (
        <div className="bg-surface border border-theme rounded-xl p-5 flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{user?.displayName?.[0] || 'U'}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-theme-primary">{user?.displayName || 'User'}</h2>
            <p className="text-sm text-theme-muted">{user?.email}</p>
          </div>
          <button className="p-2.5 rounded-lg bg-elevated hover:bg-primary/5 transition-colors">
            <Settings className="w-5 h-5 text-theme-secondary" />
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-theme rounded-xl p-6 mb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="font-semibold text-theme-primary mb-1">Welcome to AOS</h2>
          <p className="text-sm text-theme-muted mb-4">Sign in to access your account and listings</p>
          <div className="flex gap-3 max-w-xs mx-auto">
            <Link href="/auth/login" className="flex-1 bg-primary text-white py-2.5 rounded-lg text-center font-semibold text-sm hover:bg-primary-hover transition-colors">
              Login
            </Link>
            <Link href="/auth/signup" className="flex-1 border border-theme text-theme-primary py-2.5 rounded-lg text-center font-semibold text-sm hover:bg-elevated transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Menu */}
      <div className="space-y-1.5">
        {isLoggedIn && (
          <>
            <MenuItem href="/account/wishlist" icon={Heart} label="My Wishlist" />
            <MenuItem href="/sell" icon={ShoppingBag} label="My Listings" />
          </>
        )}
        <button onClick={toggleTheme} className="w-full bg-surface border border-theme rounded-xl p-4 flex items-center gap-3 hover:shadow-soft transition-shadow">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            {isDarkMode ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
          </div>
          <span className="flex-1 font-medium text-theme-primary text-left">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          <div className={`w-11 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
        </button>
        <MenuItem href="/help" icon={HelpCircle} label="Help & Support" />
        {isLoggedIn && (
          <button onClick={handleLogout} className="w-full bg-surface border border-theme rounded-xl p-4 flex items-center gap-3 hover:shadow-soft transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="flex-1 font-medium text-red-500 text-left">Logout</span>
          </button>
        )}
      </div>
    </div>
  );
}

function MenuItem({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <Link href={href} className="bg-surface border border-theme rounded-xl p-4 flex items-center gap-3 hover:shadow-soft transition-shadow">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <span className="flex-1 font-medium text-theme-primary">{label}</span>
      <ChevronRight className="w-5 h-5 text-theme-muted" />
    </Link>
  );
}
