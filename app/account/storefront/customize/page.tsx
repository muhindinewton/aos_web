'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Camera,
  Image as ImageIcon,
  Type as TypeIcon,
  Clock,
} from 'lucide-react';

type DaySchedule = { open: string; close: string; enabled: boolean };

const DAYS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Monday'    },
  { key: 'tue', label: 'Tuesday'   },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday'  },
  { key: 'fri', label: 'Friday'    },
  { key: 'sat', label: 'Saturday'  },
  { key: 'sun', label: 'Sunday'    },
];

const DEFAULT_HOURS: Record<string, DaySchedule> = {
  mon: { open: '09:00', close: '18:00', enabled: true  },
  tue: { open: '09:00', close: '18:00', enabled: true  },
  wed: { open: '09:00', close: '18:00', enabled: true  },
  thu: { open: '09:00', close: '18:00', enabled: true  },
  fri: { open: '09:00', close: '18:00', enabled: true  },
  sat: { open: '10:00', close: '16:00', enabled: true  },
  sun: { open: '',      close: '',      enabled: false },
};

const DEFAULT_DESCRIPTION =
  'TechHub Kenya is your trusted source for premium electronics and tech accessories. ' +
  'We offer authentic products with warranty and excellent customer service.';

export default function StorefrontCustomizePage() {
  const router = useRouter();
  const [logo, setLogo]               = useState<string | null>(null);
  const [description, setDescription] = useState(DEFAULT_DESCRIPTION);
  const [hours, setHours]             = useState<Record<string, DaySchedule>>(DEFAULT_HOURS);
  const [saved, setSaved]             = useState(false);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const updateDay = (key: string, patch: Partial<DaySchedule>) => {
    setHours(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => router.back(), 900);
  };

  return (
    <div className="max-w-2xl mx-auto pb-24">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-30 bg-theme">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-lg bg-surface border border-theme flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-theme-primary" />
          </button>
          <p className="flex-1 text-center text-theme-primary font-semibold text-lg">Store Customization</p>
          <button
            onClick={save}
            className="px-4 py-1.5 text-primary font-semibold text-sm hover:bg-primary/10 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <div className="px-5 pt-2 space-y-7">

        {/* ── Logo ── */}
        <Section icon={<ImageIcon className="w-4 h-4" />} title="Store Logo">
          <div className="flex flex-col items-center gap-3">
            <label className="relative cursor-pointer">
              <div
                className="w-[120px] h-[120px] rounded-full bg-elevated border-2 border-dashed border-theme flex items-center justify-center overflow-hidden"
                style={{ borderColor: logo ? 'var(--primary)' : 'var(--border)', borderStyle: logo ? 'solid' : 'dashed' }}
              >
                {logo
                  ? <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                  : <Camera className="w-9 h-9 text-theme-muted" />
                }
              </div>
              {logo && (
                <span className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-primary border-[2.5px] border-[var(--bg)] flex items-center justify-center">
                  <Camera className="w-4 h-4 text-white" />
                </span>
              )}
              <input type="file" accept="image/*" className="sr-only" onChange={handleLogo} />
            </label>
            <p className="text-xs text-theme-muted">{logo ? 'Tap to change logo' : 'Upload a square logo (PNG/JPG)'}</p>
          </div>
        </Section>

        {/* ── Description ── */}
        <Section icon={<TypeIcon className="w-4 h-4" />} title="Store Description">
          <div className="bg-surface border border-theme rounded-xl p-3">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 500))}
              rows={5}
              placeholder="Tell buyers what makes your store special"
              className="w-full bg-transparent text-sm text-theme-primary placeholder:text-theme-muted outline-none resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className="text-[11px] text-theme-muted">{description.length} / 500</span>
            </div>
          </div>
        </Section>

        {/* ── Operating hours ── */}
        <Section icon={<Clock className="w-4 h-4" />} title="Operating Hours">
          <div className="bg-surface border border-theme rounded-xl divide-y divide-[var(--border)]">
            {DAYS.map(({ key, label }) => {
              const day = hours[key];
              return (
                <div key={key} className="flex items-center gap-3 px-4 py-3">
                  <button
                    onClick={() => updateDay(key, { enabled: !day.enabled })}
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{
                      backgroundColor: day.enabled ? 'var(--primary)' : 'transparent',
                      border: day.enabled ? 'none' : '1.5px solid var(--border)',
                    }}
                  >
                    {day.enabled && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.704 5.296a1 1 0 010 1.414l-7.5 7.5a1 1 0 01-1.414 0L3.296 9.717a1 1 0 011.414-1.414l3.787 3.787 6.793-6.793a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </button>
                  <span className={`flex-1 text-sm font-semibold ${day.enabled ? 'text-theme-primary' : 'text-theme-muted'}`}>
                    {label}
                  </span>
                  {day.enabled ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input
                        type="time"
                        value={day.open}
                        onChange={e => updateDay(key, { open: e.target.value })}
                        className="bg-elevated border border-theme rounded-md px-2 py-1 text-xs text-theme-primary outline-none focus:border-primary"
                      />
                      <span className="text-xs text-theme-muted">to</span>
                      <input
                        type="time"
                        value={day.close}
                        onChange={e => updateDay(key, { close: e.target.value })}
                        className="bg-elevated border border-theme rounded-md px-2 py-1 text-xs text-theme-primary outline-none focus:border-primary"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-theme-muted">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* ── Save (bottom, mirrors mobile) ── */}
        <button
          onClick={save}
          className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm tracking-wide hover:bg-primary-hover transition-colors"
        >
          SAVE CHANGES
        </button>
      </div>

      {/* ── Toast ── */}
      {saved && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg z-50">
          Store customization saved
        </div>
      )}
    </div>
  );
}

function Section({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-primary">{icon}</span>
        <span className="text-sm font-semibold text-theme-primary">{title}</span>
      </div>
      {children}
    </div>
  );
}
