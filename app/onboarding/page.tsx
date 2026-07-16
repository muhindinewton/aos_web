'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Languages,
  MapPin,
  Coins,
  ChevronDown,
  Search,
  Check,
  Crosshair,
  X,
  Store,
  ShieldCheck,
  Car,
  Smartphone,
  Home as HomeIcon,
  Monitor,
  Shirt,
  Sofa,
} from 'lucide-react';
import { usePreferences, LANGUAGES, CURRENCIES, CurrencyInfo, COUNTRY_DEFAULT_CURRENCY } from '@/app/providers/preferences-provider';
import { useLocation, COUNTRIES, Country } from '@/app/providers/location-provider';

// 'KE' → '🇰🇪'  (regional-indicator codepoints)
const flagOf = (code: string) =>
  code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));

type Step = 'welcome' | 'language' | 'country' | 'currency';
const ORDER: Step[] = ['welcome', 'language', 'country', 'currency'];

export default function OnboardingPage() {
  const router = useRouter();
  const { language, setLanguage, currency, setCurrencyCode } = usePreferences();
  const { country, setCountry } = useLocation();

  const [step, setStep] = useState<Step>('welcome');
  const [openSheet, setOpenSheet] = useState<'language' | 'country' | 'currency' | null>(null);

  // Deep-link a specific step (?step=language|country|currency) — used by the
  // screenshot harness and handy for QA.
  React.useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('step') as Step | null;
    if (wanted && ORDER.includes(wanted)) setStep(wanted);
  }, []);

  const currentIdx = ORDER.indexOf(step);
  const back  = () => setStep(ORDER[Math.max(0, currentIdx - 1)]);
  const next  = () => setStep(ORDER[Math.min(ORDER.length - 1, currentIdx + 1)]);

  const finish = () => {
    try { localStorage.setItem('aos_onboarded', '1'); } catch {}
    router.push('/');
  };

  // ── Welcome step ─────────────────────────────────────────
  if (step === 'welcome') {
    return (
      <div className="fixed inset-0 z-50 bg-theme">
        {/* Phone: full-bleed photo with the bottom card (mobile design) */}
        <div className="md:hidden h-full flex flex-col">
          <div
            className="flex-1 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://picsum.photos/seed/aos-welcome/900/1200)' }}
          />
          <div className="bg-surface rounded-t-[32px] -mt-8 px-6 pt-10 pb-12 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
            <h1 className="text-center text-2xl font-bold text-theme-primary leading-snug">
              Buy, Sell, and Discover Worldwide
            </h1>
            <p className="text-center text-sm text-theme-secondary mt-3 leading-relaxed">
              Welcome to AOS. Join millions of users around the globe trading
              electronics, cars, real estate, fashion, and everyday essentials.
            </p>
            <button
              onClick={next}
              className="w-full mt-7 py-4 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={finish}
              className="w-full mt-2 py-2 text-theme-muted text-sm hover:text-theme-primary transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* Tablet & desktop: split screen — brand panel + focused content */}
        <div className="hidden md:flex h-full">
          <BrandPanel />

          {/* Content panel */}
          <div className="flex-1 flex items-center justify-center p-10 lg:p-16">
            <div className="w-full max-w-md">
              <h1 className="text-3xl lg:text-4xl font-bold text-theme-primary leading-tight [text-wrap:balance]">
                Buy, Sell, and Discover Worldwide
              </h1>
              <p className="text-[15px] text-theme-secondary mt-4 leading-relaxed">
                Welcome to AOS. Join millions of users around the globe trading
                electronics, cars, real estate, fashion, and everyday essentials.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  'Chat, call and negotiate with sellers directly',
                  'Sell in minutes with photos or short videos',
                  'Local prices in your currency and language',
                ].map(line => (
                  <li key={line} className="flex items-start gap-3 text-sm text-theme-primary">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>
              <button
                onClick={next}
                className="w-full lg:w-auto lg:px-14 mt-9 py-4 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={finish}
                className="block w-full lg:w-auto lg:px-6 mt-3 py-2 text-theme-muted text-sm hover:text-theme-primary transition-colors text-center lg:text-left"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-theme flex">
      {/* Brand panel stays put through the whole flow on md+ */}
      <BrandPanel />

      <div className="flex-1 flex flex-col min-w-0">
      {/* Top bar */}
      <div className="px-6 pt-6 pb-2 flex items-center gap-3 max-w-xl w-full mx-auto">
        <button
          onClick={back}
          className="w-10 h-10 rounded-xl bg-surface border border-theme flex items-center justify-center"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-theme-primary" />
        </button>
        <div className="flex-1 flex gap-2">
          {ORDER.slice(1).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 rounded-full"
              style={{ backgroundColor: i <= currentIdx - 1 ? 'var(--primary)' : 'var(--border)' }}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 pt-6 pb-4 overflow-y-auto max-w-xl w-full mx-auto md:flex md:flex-col md:justify-center">
        {step === 'language' && (() => {
          const selectedLang = LANGUAGES.find(l => l.name === language);
          return (
            <StepShell
              icon={<Languages className="w-12 h-12 text-primary" />}
              title="Choose Your Language"
              subtitle="The app will display in your selected language"
              selector={
                <SelectorButton
                  leading={
                    selectedLang
                      ? <span className="text-2xl">{flagOf(selectedLang.flag)}</span>
                      : <Languages className="w-5 h-5 text-theme-muted" />
                  }
                  label={selectedLang && selectedLang.nativeName !== selectedLang.name
                    ? `${selectedLang.name} · ${selectedLang.nativeName}`
                    : language}
                  onClick={() => setOpenSheet('language')}
                />
              }
            />
          );
        })()}
        {step === 'country' && (
          <StepShell
            icon={<MapPin className="w-12 h-12 text-primary" />}
            title="Set Your Country"
            subtitle="We'll show you products and sellers near you"
            selector={
              <>
                <SelectorButton
                  leading={<span className="text-2xl">{flagOf(country.code)}</span>}
                  label={country.name}
                  onClick={() => setOpenSheet('country')}
                />
                <button
                  onClick={() => setCountry({ code: 'KE', name: 'Kenya' })}
                  className="w-full mt-3 py-3 rounded-xl border border-theme flex items-center justify-center gap-2 text-primary font-medium text-sm hover:bg-primary/5 transition-colors"
                >
                  <Crosshair className="w-4 h-4" />
                  Use current location
                </button>
              </>
            }
          />
        )}
        {step === 'currency' && (
          <StepShell
            icon={<Coins className="w-12 h-12 text-primary" />}
            title="Choose Your Currency"
            subtitle="We'll show prices in your preferred currency"
            selector={
              <SelectorButton
                leading={
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-sm font-bold">{currency.symbol}</span>
                  </div>
                }
                label={`${currency.name} (${currency.code})`}
                onClick={() => setOpenSheet('currency')}
              />
            }
          />
        )}
      </div>

      {/* Continue */}
      <div className="px-6 pb-8 max-w-xl w-full mx-auto">
        <button
          onClick={step === 'currency' ? finish : next}
          className="w-full py-4 rounded-full bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
        >
          {step === 'currency' ? 'Finish Setup' : 'Continue'}
        </button>
      </div>

      {/* Picker sheets */}
      {openSheet === 'language' && (
        <PickerSheet
          title="Choose Language"
          items={LANGUAGES.map(l => ({
            key: l.name,
            label: l.name,
            sub: l.nativeName !== l.name ? l.nativeName : l.code.toUpperCase(),
            leading: flagOf(l.flag),
          }))}
          selectedKey={language}
          onSelect={key => { setLanguage(key); setOpenSheet(null); }}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === 'country' && (
        <PickerSheet
          title="Choose Country"
          items={COUNTRIES.map(c => ({ key: c.code, label: c.name, leading: flagOf(c.code) }))}
          selectedKey={country.code}
          onSelect={key => {
            const c = COUNTRIES.find(x => x.code === key);
            if (c) {
              setCountry(c);
              // Sync currency to the country's typical currency, mirroring mobile
              const defaultCurrencyCode = COUNTRY_DEFAULT_CURRENCY[c.code];
              if (defaultCurrencyCode) setCurrencyCode(defaultCurrencyCode);
            }
            setOpenSheet(null);
          }}
          onClose={() => setOpenSheet(null)}
        />
      )}
      {openSheet === 'currency' && (
        <PickerSheet
          title="Choose Currency"
          items={CURRENCIES.map((c: CurrencyInfo) => ({
            key: c.code,
            label: c.name,
            sub: c.code,
            leading: c.symbol,
          }))}
          selectedKey={currency.code}
          onSelect={key => { setCurrencyCode(key); setOpenSheet(null); }}
          onClose={() => setOpenSheet(null)}
        />
      )}
      </div>
    </div>
  );
}

// ── Brand panel (left half on md+, shared by every step) ──
function BrandPanel() {
  return (
    <div className="hidden md:flex relative w-1/2 lg:w-[55%] overflow-hidden bg-gradient-to-br from-primary via-[#A50F1A] to-[#6E0A11] text-white flex-col justify-between p-10 lg:p-14">
      {/* Soft light accents */}
      <div className="absolute -top-32 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 right-0 w-[28rem] h-[28rem] rounded-full bg-black/20 blur-3xl" aria-hidden />

      {/* Wordmark */}
      <div className="relative flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-[#17181C] border border-white/15 flex items-center justify-center p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/aos-logo.png" alt="AOS logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <p className="text-lg font-bold leading-tight">AOS</p>
          <p className="text-[10px] tracking-[0.22em] uppercase text-white/70 font-medium">Africa Online Space</p>
        </div>
      </div>

      {/* Headline + category tiles */}
      <div className="relative">
        <h2 className="text-3xl lg:text-[40px] font-bold leading-tight max-w-md [text-wrap:balance]">
          Africa&apos;s marketplace, open to the world.
        </h2>
        <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
          {[
            { icon: Car, label: 'Vehicles' },
            { icon: Smartphone, label: 'Phones' },
            { icon: HomeIcon, label: 'Property' },
            { icon: Monitor, label: 'Electronics' },
            { icon: Shirt, label: 'Fashion' },
            { icon: Sofa, label: 'Furniture' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm py-4"
            >
              <Icon className="w-5 h-5 text-white" />
              <span className="text-xs font-medium text-white/85">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust row */}
      <div className="relative flex items-center gap-6 text-xs text-white/75">
        <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> 1M+ listings</span>
        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Buyer Protection</span>
        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> 54 countries</span>
      </div>
    </div>
  );
}

// ── Step shell ─────────────────────────────────────────────
function StepShell({
  icon, title, subtitle, selector,
}: { icon: React.ReactNode; title: string; subtitle: string; selector: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <div className="self-center w-[100px] h-[100px] rounded-full bg-primary/10 flex items-center justify-center mt-2">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-theme-primary mt-10">{title}</h2>
      <p className="text-sm text-theme-secondary mt-2">{subtitle}</p>
      <div className="mt-8">{selector}</div>
    </div>
  );
}

function SelectorButton({
  leading, label, onClick,
}: { leading: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-surface border border-theme hover:border-primary transition-colors"
    >
      {leading}
      <span className="flex-1 text-left text-sm text-theme-primary font-medium">{label}</span>
      <ChevronDown className="w-4 h-4 text-theme-muted" />
    </button>
  );
}

// ── Picker bottom-sheet ────────────────────────────────────
interface PickerItem { key: string; label: string; sub?: string; leading?: React.ReactNode }

function PickerSheet({
  title, items, selectedKey, onSelect, onClose,
}: {
  title: string;
  items: PickerItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(i =>
      i.label.toLowerCase().includes(needle) || i.sub?.toLowerCase().includes(needle)
    );
  }, [items, q]);

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-surface rounded-t-2xl w-full max-w-xl mx-auto flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-elevated" />
        </div>
        <div className="px-5 py-2 flex items-center gap-2 border-b border-theme">
          <p className="flex-1 font-semibold text-theme-primary">{title}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-elevated flex items-center justify-center">
            <X className="w-4 h-4 text-theme-muted" />
          </button>
        </div>
        <div className="p-3 border-b border-theme">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search…"
              autoFocus
              className="w-full bg-elevated border border-theme rounded-full py-2 pl-9 pr-3 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="overflow-y-auto flex-1 hide-scrollbar">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-theme-muted py-10">No results</p>
          ) : filtered.map(i => {
            const selected = i.key === selectedKey;
            return (
              <button
                key={i.key}
                onClick={() => onSelect(i.key)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-elevated transition-colors border-b border-theme last:border-0 ${selected ? 'bg-primary/5' : ''}`}
              >
                {i.leading && (
                  <span className="text-2xl flex items-center justify-center w-8 h-8 flex-shrink-0">
                    {i.leading}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-theme-primary">{i.label}</p>
                  {i.sub && <p className="text-xs text-theme-muted">{i.sub}</p>}
                </div>
                {selected && (
                  <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
