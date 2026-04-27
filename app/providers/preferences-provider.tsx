'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  rateFromKES: number;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'KES', symbol: 'KSh',  name: 'Kenyan Shilling',         rateFromKES: 1       },
  { code: 'USD', symbol: '$',    name: 'US Dollar',               rateFromKES: 0.0077  },
  { code: 'EUR', symbol: '€',    name: 'Euro',                    rateFromKES: 0.0071  },
  { code: 'GBP', symbol: '£',    name: 'British Pound',           rateFromKES: 0.0061  },
  { code: 'NGN', symbol: '₦',    name: 'Nigerian Naira',          rateFromKES: 12.3    },
  { code: 'GHS', symbol: 'GH₵',  name: 'Ghanaian Cedi',           rateFromKES: 0.047   },
  { code: 'ZAR', symbol: 'R',    name: 'South African Rand',      rateFromKES: 0.14    },
  { code: 'TZS', symbol: 'TSh',  name: 'Tanzanian Shilling',      rateFromKES: 20.3    },
  { code: 'UGX', symbol: 'USh',  name: 'Ugandan Shilling',        rateFromKES: 28.5    },
  { code: 'RWF', symbol: 'RF',   name: 'Rwandan Franc',           rateFromKES: 10.8    },
  { code: 'ETB', symbol: 'Br',   name: 'Ethiopian Birr',          rateFromKES: 0.43    },
  { code: 'EGP', symbol: 'E£',   name: 'Egyptian Pound',          rateFromKES: 0.37    },
  { code: 'MAD', symbol: 'MAD',  name: 'Moroccan Dirham',         rateFromKES: 0.076   },
  { code: 'XOF', symbol: 'CFA',  name: 'West African CFA Franc',  rateFromKES: 4.65    },
  { code: 'AED', symbol: 'AED',  name: 'UAE Dirham',              rateFromKES: 0.028   },
  { code: 'SAR', symbol: 'SAR',  name: 'Saudi Riyal',             rateFromKES: 0.029   },
  { code: 'ZMW', symbol: 'ZK',   name: 'Zambian Kwacha',          rateFromKES: 0.20    },
  { code: 'MZN', symbol: 'MT',   name: 'Mozambican Metical',      rateFromKES: 0.49    },
  { code: 'BIF', symbol: 'Fr',   name: 'Burundian Franc',         rateFromKES: 27.9    },
  { code: 'CAD', symbol: 'CA$',  name: 'Canadian Dollar',         rateFromKES: 0.0105  },
  { code: 'AUD', symbol: 'A$',   name: 'Australian Dollar',       rateFromKES: 0.0118  },
  { code: 'CNY', symbol: '¥',    name: 'Chinese Yuan',            rateFromKES: 0.056   },
  { code: 'INR', symbol: '₹',    name: 'Indian Rupee',            rateFromKES: 0.64    },
];

export const LANGUAGES = [
  { code: 'en', name: 'English',    dir: 'ltr' as const },
  { code: 'sw', name: 'Swahili',    dir: 'ltr' as const },
  { code: 'fr', name: 'French',     dir: 'ltr' as const },
  { code: 'ar', name: 'Arabic',     dir: 'rtl' as const },
  { code: 'pt', name: 'Portuguese', dir: 'ltr' as const },
  { code: 'ha', name: 'Hausa',      dir: 'ltr' as const },
  { code: 'yo', name: 'Yoruba',     dir: 'ltr' as const },
  { code: 'ig', name: 'Igbo',       dir: 'ltr' as const },
  { code: 'am', name: 'Amharic',    dir: 'ltr' as const },
  { code: 'so', name: 'Somali',     dir: 'ltr' as const },
  { code: 'zu', name: 'Zulu',       dir: 'ltr' as const },
  { code: 'xh', name: 'Xhosa',      dir: 'ltr' as const },
  { code: 'rw', name: 'Kinyarwanda',dir: 'ltr' as const },
  { code: 'es', name: 'Spanish',    dir: 'ltr' as const },
  { code: 'de', name: 'German',     dir: 'ltr' as const },
  { code: 'zh', name: 'Chinese',    dir: 'ltr' as const },
];

export const COUNTRY_DEFAULT_CURRENCY: Record<string, string> = {
  KE: 'KES', UG: 'UGX', TZ: 'TZS', NG: 'NGN', GH: 'GHS', ZA: 'ZAR',
  ET: 'ETB', EG: 'EGP', MA: 'MAD', SN: 'XOF', CI: 'XOF', BJ: 'XOF',
  TG: 'XOF', BF: 'XOF', ML: 'XOF', NE: 'XOF', GN: 'XOF', AE: 'AED',
  SA: 'SAR', ZM: 'ZMW', MZ: 'MZN', RW: 'RWF', BI: 'BIF', US: 'USD',
  GB: 'GBP', CA: 'CAD', AU: 'AUD', IN: 'INR', CN: 'CNY', DE: 'EUR',
  FR: 'EUR', ES: 'EUR',
};

export function parseKES(priceStr: string): number {
  const cleaned = (priceStr || '').replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

interface PreferencesContextValue {
  language: string;
  setLanguage: (lang: string) => void;
  currency: CurrencyInfo;
  setCurrencyCode: (code: string) => void;
  formatPrice: (kesStr: string) => string;
}

const DEFAULT_CURRENCY = CURRENCIES[0];

const PreferencesContext = createContext<PreferencesContextValue>({
  language: 'English',
  setLanguage: () => {},
  currency: DEFAULT_CURRENCY,
  setCurrencyCode: () => {},
  formatPrice: (s) => s,
});

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('English');
  const [currency, setCurrencyState] = useState<CurrencyInfo>(DEFAULT_CURRENCY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('aos_language');
    if (storedLang) setLanguageState(storedLang);
    const storedCur = localStorage.getItem('aos_currency');
    if (storedCur) {
      const found = CURRENCIES.find(c => c.code === storedCur);
      if (found) setCurrencyState(found);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const lang = LANGUAGES.find(l => l.name === language);
    if (lang) {
      document.documentElement.lang = lang.code;
      document.documentElement.dir = lang.dir;
    }
  }, [language, mounted]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('aos_language', lang);
  };

  const setCurrencyCode = (code: string) => {
    const found = CURRENCIES.find(c => c.code === code);
    if (found) {
      setCurrencyState(found);
      localStorage.setItem('aos_currency', code);
    }
  };

  const formatPrice = (kesStr: string): string => {
    if (!kesStr) return '';
    const num = parseKES(kesStr);
    if (num === 0) return kesStr;
    const converted = num * currency.rateFromKES;
    const formatted = converted.toLocaleString(undefined, { maximumFractionDigits: 0 });
    return `${currency.symbol} ${formatted}`;
  };

  return (
    <PreferencesContext.Provider value={{ language, setLanguage, currency, setCurrencyCode, formatPrice }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}
