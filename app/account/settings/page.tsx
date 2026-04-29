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
import { usePreferences, LANGUAGES, CURRENCIES } from '../../providers/preferences-provider';

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
  const { language, setLanguage, currency, setCurrencyCode, t } = usePreferences();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  return (
    <div className="min-h-screen bg-theme pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 py-6 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/account" className="p-2 rounded-xl border border-theme hover:bg-elevated transition-colors">
            <ArrowLeft className="w-5 h-5 text-theme-primary" />
          </Link>
          <h1 className="text-xl font-bold text-theme-primary">{t('settings')}</h1>
        </div>

        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-3 px-1">{t('nav_account')}</h2>
          <div className="bg-surface border border-theme rounded-2xl overflow-hidden">
            <SettingItem 
              icon={User} 
              title={t('edit_profile')} 
              subtitle="Update your personal information"
              href="/account/profile"
            />
            <SettingItem 
              icon={Lock} 
              title={t('change_password')} 
              subtitle="Update your password"
              href="/account/password"
            />
            <SettingItem 
              icon={Shield} 
              title={t('security')} 
              subtitle="Two-factor authentication, login history"
              href="/account/security"
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-theme-muted uppercase tracking-wider mb-3 px-1">{t('preferences')}</h2>
          <div className="bg-surface border border-theme rounded-2xl overflow-hidden">
            <SettingItem 
              icon={Globe} 
              title={t('pref_language')} 
              value={language}
              onClick={() => setShowLanguageModal(true)}
            />
            <SettingItem 
              icon={DollarSign} 
              title={t('pref_currency')} 
              value={`${currency.symbol} ${currency.code}`}
              onClick={() => setShowCurrencyModal(true)}
            />
            <SettingItem 
              icon={MapPin} 
              title={t('pref_country')} 
              value={country.name}
              onClick={() => setShowLocationPicker(true)}
            />
            <div className="flex items-center gap-4 p-4 hover:bg-elevated transition-colors cursor-pointer" onClick={toggleTheme}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                {isDarkMode ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-theme-primary">{t('dark_mode')}</p>
                <p className="text-sm text-theme-muted">{isDarkMode ? t('dark_mode_on') : t('dark_mode_off')}</p>
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
              title={t('notifications')} 
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
              title={t('privacy')} 
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
              title={t('help_center')} 
              subtitle="FAQs and support articles"
              href="/help"
            />
            <SettingItem 
              icon={FileText} 
              title={t('terms')} 
              subtitle="Read our terms and conditions"
              href="/legal/terms"
            />
            <SettingItem 
              icon={Shield} 
              title={t('privacy_policy')} 
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
              title={t('logout')} 
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
            <h2 className="text-xl font-bold text-theme-primary mb-4">{t('select_language')}</h2>
            <div className="space-y-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.name); setShowLanguageModal(false); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    language === lang.name ? 'bg-primary/10 border border-primary' : 'hover:bg-elevated border border-transparent'
                  }`}
                >
                  <span className={language === lang.name ? 'text-primary font-medium' : 'text-theme-primary'}>{lang.name}</span>
                  {language === lang.name && <Check className="w-5 h-5 text-primary" />}
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
            <h2 className="text-xl font-bold text-theme-primary mb-4">{t('select_currency')}</h2>
            <div className="space-y-2">
              {CURRENCIES.map(curr => (
                <button
                  key={curr.code}
                  onClick={() => { setCurrencyCode(curr.code); setShowCurrencyModal(false); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                    currency.code === curr.code ? 'bg-primary/10 border border-primary' : 'hover:bg-elevated border border-transparent'
                  }`}
                >
                  <div>
                    <span className={currency.code === curr.code ? 'text-primary font-medium' : 'text-theme-primary'}>{curr.name}</span>
                    <span className="text-theme-muted ml-2">({curr.symbol})</span>
                  </div>
                  {currency.code === curr.code && <Check className="w-5 h-5 text-primary" />}
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
