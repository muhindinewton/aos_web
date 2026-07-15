'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  HelpCircle,
  ChevronRight,
  Moon,
  Sun,
  LogOut,
  User,
  Edit3,
  Lock,
  ShieldCheck,
  Activity,
  Trash2,
  Store,
  ListOrdered,
  Bell,
  Sliders,
  FileText,
  Shield,
  AlertTriangle,
  X,
  ChevronLeft,
} from 'lucide-react';
import { useAuth } from '../providers/auth-provider';
import { useTheme } from '../providers/theme-provider';

export default function AccountPage() {
  const { user, isLoggedIn, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    router.push('/');
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="w-11 h-11 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">Account</h1>
          <button className="w-11 h-11 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors">
            <Lock className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card or Login Prompt */}
        {mounted && isLoggedIn ? (
          <div className="bg-surface border border-theme rounded-2xl p-4 flex items-center gap-4 mb-5">
            <Link href="/account/profile" className="flex items-center gap-4 flex-1 min-w-0">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold text-theme-primary truncate">
                  {user?.displayName || 'User'}
                </h2>
                <p className="text-sm text-theme-muted truncate">{user?.email}</p>
              </div>
            </Link>
            <Link
              href="/account/profile"
              className="w-11 h-11 rounded-full bg-elevated flex items-center justify-center text-theme-primary hover:bg-primary/5 transition-colors flex-shrink-0"
              aria-label="Edit profile"
            >
              <Edit3 className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="bg-surface border border-theme rounded-2xl p-6 mb-5 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-theme-primary mb-2">Welcome to AOS</h2>
            <p className="text-sm text-theme-muted mb-5">
              Sign in to access your account, manage listings, and more.
            </p>
            <div className="flex gap-3">
              <Link
                href="/auth/login"
                className="flex-1 border border-theme text-theme-primary py-3 rounded-full text-center font-semibold text-sm hover:bg-elevated transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 bg-primary text-white py-3 rounded-full text-center font-semibold text-sm hover:bg-primary-hover transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}

        {/* Get Verified banner - Only for logged in users */}
        {mounted && isLoggedIn && (
          <Link
            href="/account/verification"
            className="block bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6 hover:bg-primary/15 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-theme-primary">Get Verified</h3>
                <p className="text-xs text-theme-secondary">Verify as an individual or a business</p>
              </div>
              <ChevronRight className="w-5 h-5 text-theme-muted flex-shrink-0" />
            </div>
          </Link>
        )}

        {/* My Items Section - Only for logged in users */}
        {mounted && isLoggedIn && (
          <MenuCard>
            <MenuItem href="/sell/listings" icon={ListOrdered} label="My Listings" />
            <MenuItem href="/account/storefront" icon={Store} label="My Storefront" />
            <MenuItem href="/account/wishlist" icon={Heart} label="My Wishlist" />
            <MenuItem href="/account/activity" icon={Activity} label="Activity Center" />
          </MenuCard>
        )}

        {/* Account Settings Section - Only for logged in users */}
        {mounted && isLoggedIn && (
          <>
            <SectionTitle>Account settings</SectionTitle>
            <MenuCard>
              <MenuItem href="/account/security" icon={Lock} label="Password & Security" />
              <MenuItem href="/account/notifications" icon={Bell} label="Notifications Preferences" />
              <MenuItem href="/account/preferences" icon={Sliders} label="Application Preferences" />
              <ThemeToggle isDarkMode={mounted && isDarkMode} onToggle={toggleTheme} />
              <MenuItem href="/account/delete" icon={Trash2} label="Delete account" danger />
            </MenuCard>
          </>
        )}

        {/* Other Section */}
        <SectionTitle>Other</SectionTitle>
        <MenuCard>
          <MenuItem href="/terms" icon={FileText} label="Terms & Conditions" />
          <MenuItem href="/privacy" icon={Shield} label="Privacy Policy" />
          <MenuItem href="/help" icon={HelpCircle} label="Help & Support" />
        </MenuCard>

        {/* Logout Button - Only for logged in users */}
        {mounted && isLoggedIn && (
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full mt-6 py-4 rounded-full border border-red-500 text-red-500 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        )}

        <div className="h-24" />
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-surface rounded-t-3xl md:rounded-3xl w-full max-w-md p-6 animate-slide-up">
            {/* Handle bar */}
            <div className="w-10 h-1 bg-theme rounded-full mx-auto mb-6 md:hidden" />

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-theme-primary text-center mb-3">Logout</h2>

            {/* Description */}
            <p className="text-sm text-theme-muted text-center mb-6 leading-relaxed">
              Are you sure you want to log out? You will need to sign in again to access your
              account.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 py-3.5 rounded-full border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
              >
                Logout
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-theme-muted mt-6 mb-3">{children}</h3>
  );
}

function MenuCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-theme rounded-2xl overflow-hidden divide-y divide-theme">
      {children}
    </div>
  );
}

function MenuItem({
  href,
  icon: Icon,
  label,
  danger = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  danger?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 hover:bg-elevated transition-colors"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? 'bg-primary/10' : 'bg-elevated'}`}>
        <Icon className={`w-5 h-5 ${danger ? 'text-primary' : 'text-theme-secondary'}`} />
      </div>
      <span className={`flex-1 font-medium ${danger ? 'text-primary' : 'text-theme-primary'}`}>{label}</span>
      <ChevronRight className="w-5 h-5 text-theme-muted" />
    </Link>
  );
}

function ThemeToggle({
  isDarkMode,
  onToggle,
}: {
  isDarkMode: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-4 p-4 hover:bg-elevated transition-colors"
    >
      <div className="w-10 h-10 rounded-xl bg-elevated flex items-center justify-center">
        {isDarkMode ? (
          <Moon className="w-5 h-5 text-theme-secondary" />
        ) : (
          <Sun className="w-5 h-5 text-theme-secondary" />
        )}
      </div>
      <span className="flex-1 font-medium text-theme-primary text-left">Dark Mode</span>
      <div
        className={`w-12 h-7 rounded-full transition-colors flex items-center px-1 ${
          isDarkMode ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            isDarkMode ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
