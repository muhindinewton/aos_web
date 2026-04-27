'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import ProtectedRoute from '../../components/protected-route';

function NotificationsPreferencesPage() {
  const router = useRouter();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [promotionalAlerts, setPromotionalAlerts] = useState(true);
  const [priceDropAlerts, setPriceDropAlerts] = useState(true);
  const [newMessageAlerts, setNewMessageAlerts] = useState(true);

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-11 h-11 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">
          Notifications
        </h1>
        <div className="w-11" />
      </div>

      {/* General */}
      <SectionTitle>General</SectionTitle>
      <div className="space-y-3 mb-7">
        <ToggleCard
          title="Push Notifications"
          subtitle="Receive push notifications on your device"
          value={pushNotifications}
          onChange={setPushNotifications}
        />
        <ToggleCard
          title="Email Notifications"
          subtitle="Receive updates via email"
          value={emailNotifications}
          onChange={setEmailNotifications}
        />
        <ToggleCard
          title="SMS Notifications"
          subtitle="Receive updates via SMS"
          value={smsNotifications}
          onChange={setSmsNotifications}
        />
      </div>

      {/* Alerts */}
      <SectionTitle>Alerts</SectionTitle>
      <div className="space-y-3">
        <ToggleCard
          title="Promotional Alerts"
          subtitle="Get notified about deals and promotions"
          value={promotionalAlerts}
          onChange={setPromotionalAlerts}
        />
        <ToggleCard
          title="Price Drop Alerts"
          subtitle="Get notified when prices drop on wishlist items"
          value={priceDropAlerts}
          onChange={setPriceDropAlerts}
        />
        <ToggleCard
          title="New Message Alerts"
          subtitle="Get notified when you receive a new message"
          value={newMessageAlerts}
          onChange={setNewMessageAlerts}
        />
      </div>
    </div>
  );
}

export default function NotificationsPageWrapper() {
  return <ProtectedRoute><NotificationsPreferencesPage /></ProtectedRoute>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-semibold text-theme-muted mb-3">{children}</h3>;
}

function ToggleCard({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="bg-surface border border-theme rounded-2xl px-4 py-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-theme-primary">{title}</p>
        <p className="text-xs text-theme-muted mt-0.5">{subtitle}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full transition-colors flex-shrink-0 flex items-center px-1 ${
          value ? 'bg-theme-primary' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-surface shadow-sm transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
