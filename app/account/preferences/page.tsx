'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Languages, MapPin, DollarSign, Search, X, Check } from 'lucide-react';
import ProtectedRoute from '../../components/protected-route';
import { useLocation, COUNTRIES, flagEmoji } from '../../providers/location-provider';
import { usePreferences, CURRENCIES, LANGUAGES, COUNTRY_DEFAULT_CURRENCY } from '../../providers/preferences-provider';

type SheetType = 'language' | 'country' | 'currency' | null;

function PreferencesPage() {
  const router = useRouter();
  const { country, setCountry } = useLocation();
  const { language, setLanguage, currency, setCurrencyCode } = usePreferences();
  const [openSheet, setOpenSheet] = useState<SheetType>(null);
  const [query, setQuery] = useState('');

  const handleCountrySelect = (code: string, name: string) => {
    setCountry({ code, name });
    const defaultCur = COUNTRY_DEFAULT_CURRENCY[code];
    if (defaultCur) setCurrencyCode(defaultCur);
    setOpenSheet(null);
    setQuery('');
  };

  const handleLanguageSelect = (lang: string) => {
    setLanguage(lang);
    setOpenSheet(null);
    setQuery('');
  };

  const handleCurrencySelect = (code: string) => {
    setCurrencyCode(code);
    setOpenSheet(null);
    setQuery('');
  };

  const filteredCountries = query
    ? COUNTRIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
    : COUNTRIES;

  const filteredLanguages = query
    ? LANGUAGES.filter(l => l.name.toLowerCase().includes(query.toLowerCase()))
    : LANGUAGES;

  const filteredCurrencies = query
    ? CURRENCIES.filter(c => c.code.toLowerCase().includes(query.toLowerCase()) || c.name.toLowerCase().includes(query.toLowerCase()))
    : CURRENCIES;

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
      value: `${flagEmoji(country.code)} ${country.name}`,
      description: 'Determines nearby listings and where your ads appear.',
    },
    {
      key: 'currency' as SheetType,
      icon: DollarSign,
      title: 'Currency',
      value: `${currency.symbol} ${currency.code}`,
      description: 'Used for prices when viewing and posting listings.',
    },
  ];

  const sheetTitle: Record<string, string> = {
    language: 'Select Language',
    country: 'Select Country',
    currency: 'Select Currency',
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">Preferences</h1>
          <div className="w-11" />
        </div>
        <p className="text-sm text-theme-muted mb-6 text-center">Manage how the app works for you</p>

        <div className="space-y-3">
          {preferences.map(({ key, icon: Icon, title, value, description }) => (
            <button
              key={key}
              onClick={() => { setOpenSheet(key); setQuery(''); }}
              className="w-full bg-surface border border-theme rounded-2xl p-4 flex items-start gap-4 hover:bg-elevated transition-colors text-left"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-theme-primary">{title}</span>
                  <span className="text-sm font-medium text-theme-secondary truncate">{value}</span>
                  <ChevronRight className="w-4 h-4 text-theme-muted ml-auto flex-shrink-0" />
                </div>
                <p className="text-xs text-theme-muted mt-1 leading-relaxed">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Sheet */}
      {openSheet && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setOpenSheet(null); setQuery(''); }} />
          <div className="relative bg-surface rounded-t-3xl md:rounded-3xl w-full max-w-md flex flex-col" style={{ maxHeight: '85dvh' }}>
            <div className="p-5 flex-shrink-0">
              <div className="w-10 h-1 bg-theme rounded-full mx-auto mb-4 md:hidden" />
              <h3 className="text-base font-semibold text-theme-primary mb-3">{sheetTitle[openSheet]}</h3>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted pointer-events-none" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={`Search ${openSheet}...`}
                  className="w-full bg-elevated border border-theme rounded-xl py-2.5 pl-9 pr-9 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary transition-colors"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-muted">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto flex-1 px-2 pb-6">
              {openSheet === 'language' && filteredLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.name)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${lang.name === language ? 'bg-primary/10 text-primary' : 'hover:bg-elevated text-theme-primary'}`}
                >
                  <span className="font-medium">{lang.name}</span>
                  {lang.name === language && <Check className="w-4 h-4" />}
                </button>
              ))}

              {openSheet === 'country' && filteredCountries.map(c => (
                <button
                  key={c.code}
                  onClick={() => handleCountrySelect(c.code, c.name)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${c.code === country.code ? 'bg-primary/10 text-primary' : 'hover:bg-elevated text-theme-primary'}`}
                >
                  <span className="text-xl w-7 text-center">{flagEmoji(c.code)}</span>
                  <span className="flex-1 font-medium text-sm text-left">{c.name}</span>
                  {c.code === country.code && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              ))}

              {openSheet === 'currency' && filteredCurrencies.map(cur => (
                <button
                  key={cur.code}
                  onClick={() => handleCurrencySelect(cur.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${cur.code === currency.code ? 'bg-primary/10 text-primary' : 'hover:bg-elevated text-theme-primary'}`}
                >
                  <span className="w-10 text-sm font-bold text-center flex-shrink-0">{cur.symbol}</span>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{cur.name}</p>
                    <p className="text-xs text-theme-muted">{cur.code}</p>
                  </div>
                  {cur.code === currency.code && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              ))}
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
