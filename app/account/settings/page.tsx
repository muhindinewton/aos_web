'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/protected-route';
import { 
  ArrowLeft, 
  ChevronRight, 
  Globe, 
  MapPin, 
  DollarSign, 
  Bell, 
  Shield, 
  Moon, 
  Sun,
  FileText,
  HelpCircle,
  LogOut,
  User,
  Lock,
  Eye,
  Smartphone,
  Check
} from 'lucide-react';
import { useTheme } from '../../providers/theme-provider';
import { useAuth } from '../../providers/auth-provider';
import { useLocation } from '../../providers/location-provider';
import { LocationPickerModal } from '../../components/location-picker-modal';

interface SettingItemProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  value?: string;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
}

function SettingItem({ icon: Icon, title, subtitle, value, onClick, href, danger }: SettingItemProps) {
  const content = (
    <div className={`flex items-center gap-4 p-4 rounded-xl ${danger ? 'hover:bg-red-50 dark:hover:bg-red-500/10' : 'hover:bg-elevated'} transition-colors cursor-pointer`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? 'bg-red-50 dark:bg-red-500/10' : 'bg-primary/10'}`}>
        <Icon className={`w-5 h-5 ${danger ? 'text-red-500' : 'text-primary'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${danger ? 'text-red-500' : 'text-theme-primary'}`}>{title}</p>
        {subtitle && <p className="text-sm text-theme-muted truncate">{subtitle}</p>}
      </div>
      {value && <span className="text-sm text-theme-secondary">{value}</span>}
      <ChevronRight className="w-5 h-5 text-theme-muted" />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
}

function SettingsPage() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const { country } = useLocation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('KES');

  const languages = ['English', 'Swahili', 'French', 'Arabic', 'Portuguese'];
  const currencies = [
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  ];

  return (
    <div className="min-h-screen bg-theme pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-6 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account" className="p-2 rounded-xl border border-theme hover:bg-elevated transition-colors">
            <ArrowLeft className="w-5 h-5 text-theme-primary" />
          </Link>
          <h1 className="text-xl font-bold text-theme-primary">Settings</h1>
        </div>

        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-3 px-1">Account</h2>
          <div className="bg-surface border border-theme rounded-2xl overflow-hidden">
            <SettingItem 
              icon={User} 
              title="Edit Profile" 
              subtitle="Update your personal information"
              href="/account/profile"
            />
            <SettingItem 
              icon={Lock} 
              title="Change Password" 
              subtitle="Update your password"
              href="/account/password"
            />
            <SettingItem 
              icon={Shield} 
              title="Security" 
              subtitle="Two-factor authentication, login history"
              href="/account/security"
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-3 px-1">Preferences</h2>
          <div className="bg-surface border border-theme rounded-2xl overflow-hidden">
            <SettingItem 
              icon={Globe} 
              title="Language" 
              value={selectedLanguage}
              onClick={() => setShowLanguageModal(true)}
            />
            <SettingItem 
              icon={DollarSign} 
              title="Currency" 
              value={selectedCurrency}
              onClick={() => setShowCurrencyModal(true)}
            />
            <SettingItem 
              icon={MapPin} 
              title="Location" 
              value={country.name}
              onClick={() => setShowLocationPicker(true)}
            />
            <div className="flex items-center gap-4 p-4 hover:bg-elevated transition-colors cursor-pointer" onClick={toggleTheme}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-theme-primary">Dark Mode</p>
                <p className="text-sm text-theme-muted">{isDarkMode ? 'On' : 'Off'}</p>
              </div>
              <div className={`w-12 h-7 rounded-full transition-colors ${isDarkMode ? 'bg-primary' : 'bg-gray-300'} relative`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-3 px-1">Notifications</h2>
          <div className="bg-surface border border-theme rounded-2xl overflow-hidden">
            <SettingItem 
              icon={Bell} 
              title="Push Notifications" 
              subtitle="Manage notification preferences"
              href="/account/notifications"
            />
            <SettingItem 
              icon={Smartphone} 
              title="SMS Notifications" 
              subtitle="Receive updates via SMS"
              href="/account/sms-notifications"
            />
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-3 px-1">Privacy</h2>
          <div className="bg-surface border border-theme rounded-2xl overflow-hidden">
            <SettingItem 
              icon={Eye} 
              title="Privacy Settings" 
              subtitle="Control who can see your activity"
              href="/account/privacy"
            />
          </div>
        </div>

        {/* Support Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-3 px-1">Support</h2>
          <div className="bg-surface border border-theme rounded-2xl overflow-hidden">
            <SettingItem 
              icon={HelpCircle} 
              title="Help Center" 
              subtitle="FAQs and support articles"
              href="/help"
            />
            <SettingItem 
              icon={FileText} 
              title="Terms of Service" 
              subtitle="Read our terms and conditions"
              href="/legal/terms"
            />
            <SettingItem 
              icon={Shield} 
              title="Privacy Policy" 
              subtitle="Learn how we protect your data"
              href="/legal/privacy"
            />
          </div>
        </div>

        {/* Logout */}
        <div className="mb-6">
          <div className="bg-surface border border-theme rounded-2xl overflow-hidden">
            <SettingItem 
              icon={LogOut} 
              title="Log Out" 
              subtitle="Sign out of your account"
              onClick={logout}
              danger
            />
          </div>
        </div>

        {/* App Version */}
        <p className="text-center text-sm text-theme-muted">
          AOS Web v1.0.0
        </p>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={() => setShowLanguageModal(false)}>
          <div className="bg-surface w-full max-w-md rounded-t-3xl md:rounded-3xl p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-theme-primary mb-4">Select Language</h2>
            <div className="space-y-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    setShowLanguageModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    selectedLanguage === lang ? 'bg-primary/10 border border-primary' : 'hover:bg-elevated border border-transparent'
                  }`}
                >
                  <span className={selectedLanguage === lang ? 'text-primary font-medium' : 'text-theme-primary'}>{lang}</span>
                  {selectedLanguage === lang && <Check className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={() => setShowCurrencyModal(false)}>
          <div className="bg-surface w-full max-w-md rounded-t-3xl md:rounded-3xl p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-theme-primary mb-4">Select Currency</h2>
            <div className="space-y-2">
              {currencies.map(curr => (
                <button
                  key={curr.code}
                  onClick={() => {
                    setSelectedCurrency(curr.code);
                    setShowCurrencyModal(false);
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    selectedCurrency === curr.code ? 'bg-primary/10 border border-primary' : 'hover:bg-elevated border border-transparent'
                  }`}
                >
                  <div>
                    <span className={selectedCurrency === curr.code ? 'text-primary font-medium' : 'text-theme-primary'}>{curr.name}</span>
                    <span className="text-theme-muted ml-2">({curr.symbol})</span>
                  </div>
                  {selectedCurrency === curr.code && <Check className="w-5 h-5 text-primary" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showLocationPicker && <LocationPickerModal onClose={() => setShowLocationPicker(false)} />}
    </div>
  );
}

export default function SettingsPageWrapper() {
  return <ProtectedRoute><SettingsPage /></ProtectedRoute>;
}
