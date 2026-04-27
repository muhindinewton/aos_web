'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Languages, MapPin, DollarSign } from 'lucide-react';
import ProtectedRoute from '../../components/protected-route';

const languages = ['English', 'Swahili', 'French', 'Arabic', 'Portuguese'];
const countries = ['Kenya', 'Uganda', 'Tanzania', 'Nigeria', 'Ghana', 'South Africa'];
const currencies = ['KES', 'UGX', 'TZS', 'NGN', 'GHS', 'ZAR', 'USD'];

type SheetType = 'language' | 'country' | 'currency' | null;

function PreferencesPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('English');
  const [country, setCountry] = useState('Kenya');
  const [currency, setCurrency] = useState('KES');
  const [openSheet, setOpenSheet] = useState<SheetType>(null);

  const preferences = [
    {
      key: 'language' as SheetType,
      icon: Languages,
      title: 'Language',
      value: language,
      description: 'Controls how text appears in the app.',
    },
    {
      key: 'country' as SheetType,
      icon: MapPin,
      title: 'Country',
      value: country,
      description: 'Determines nearby listings and where your ads appear.',
    },
    {
      key: 'currency' as SheetType,
      icon: DollarSign,
      title: 'Currency',
      value: currency,
      description: 'Used for prices when viewing and posting listings.',
    },
  ];

  const sheetOptions: Record<string, string[]> = {
    language: languages,
    country: countries,
    currency: currencies,
  };

  const sheetTitle: Record<string, string> = {
    language: 'Select Language',
    country: 'Select Country',
    currency: 'Select Currency',
  };

  const handleSelect = (value: string) => {
    if (openSheet === 'language') setLanguage(value);
    else if (openSheet === 'country') setCountry(value);
    else if (openSheet === 'currency') setCurrency(value);
    setOpenSheet(null);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">
            Preferences
          </h1>
          <div className="w-11" />
        </div>
        <p className="text-sm text-theme-muted mb-6 text-center">
          Manage how the app works for you
        </p>

        <div className="space-y-3">
          {preferences.map(({ key, icon: Icon, title, value, description }) => (
            <button
              key={key}
              onClick={() => setOpenSheet(key)}
              className="w-full bg-surface border border-theme rounded-2xl p-4 flex items-start gap-4 hover:bg-elevated transition-colors text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-theme-primary">{title}</span>
                  <span className="text-sm font-medium text-theme-secondary">{value}</span>
                  <ChevronRight className="w-4 h-4 text-theme-muted ml-auto" />
                </div>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Sheet */}
      {openSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenSheet(null)} />
          <div className="relative bg-surface rounded-t-3xl w-full max-w-md animate-slide-up">
            <div className="p-5">
              <div className="w-10 h-1 bg-theme rounded-full mx-auto mb-4" />
              <h3 className="text-base font-semibold text-theme-primary mb-4">
                {sheetTitle[openSheet]}
              </h3>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {sheetOptions[openSheet].map((opt) => {
                  const current =
                    openSheet === 'language'
                      ? language
                      : openSheet === 'country'
                      ? country
                      : currency;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(opt)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                        opt === current
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-elevated text-theme-primary'
                      }`}
                    >
                      <span className="font-medium">{opt}</span>
                      {opt === current && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="h-4" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function PreferencesPageWrapper() {
  return <ProtectedRoute><PreferencesPage /></ProtectedRoute>;
}
