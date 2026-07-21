'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Eye, Heart, PlayCircle, Radio, Search, UserPlus, Star,
  MessageCircle, Tag, Activity as ActivityIcon, Trash2,
} from 'lucide-react';
import ProtectedRoute from '../../components/protected-route';
import { usePageLoad, SkeletonList, AppErrorView } from '../../components/app-state-views';
import { creatorSlug } from '../../feed/feed-data';

// Web port of mobile's activity_center_screen.dart + activity_service.dart.
// Types, seed data, category mapping, date bucketing, relative-time formatting
// and per-row navigation all mirror the Flutter screen.

type ActivityType =
  | 'productView' | 'wishlist' | 'shortWatch' | 'liveJoin'
  | 'search' | 'follow' | 'review' | 'contact' | 'listing';

type Category = 'products' | 'shorts' | 'searches' | 'social' | 'selling';

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  createdAt: Date;
  imageSeed?: string;
}

// Row label, icon and accent per type. Mobile tints the icon tile with
// color.withAlpha(28) — 28/255, i.e. the `1C` alpha suffix below, NOT 28%.
const META: Record<ActivityType, { label: string; Icon: React.ElementType; color: string }> = {
  productView: { label: 'Viewed',    Icon: Eye,           color: '#C1121F' },
  wishlist:    { label: 'Saved',     Icon: Heart,         color: '#C1121F' },
  shortWatch:  { label: 'Watched',   Icon: PlayCircle,    color: '#8E44AD' },
  liveJoin:    { label: 'Live',      Icon: Radio,         color: '#FF4D4D' },
  search:      { label: 'Searched',  Icon: Search,        color: '#4DA3FF' },
  follow:      { label: 'Followed',  Icon: UserPlus,      color: '#4DA3FF' },
  review:      { label: 'Reviewed',  Icon: Star,          color: '#F5A623' },
  contact:     { label: 'Contacted', Icon: MessageCircle, color: '#2ECC71' },
  listing:     { label: 'Listed',    Icon: Tag,           color: '#E67E22' },
};

const CATEGORY_OF: Record<ActivityType, Category> = {
  productView: 'products', wishlist: 'products',
  shortWatch:  'shorts',   liveJoin: 'shorts',
  search:      'searches',
  follow:      'social',   review:   'social', contact: 'social',
  listing:     'selling',
};

const FILTERS: { label: string; key: Category | null }[] = [
  { label: 'All',      key: null },
  { label: 'Products', key: 'products' },
  { label: 'Shorts',   key: 'shorts' },
  { label: 'Searches', key: 'searches' },
  { label: 'Social',   key: 'social' },
  { label: 'Selling',  key: 'selling' },
];

// Mirrors ActivityService._seed() — same entries, order and minute offsets.
const SEED: [number, ActivityType, string, string, string?][] = [
  [8,    'productView', 'iPhone 14 Pro Max 256GB', 'Nairobi, Westlands',            'iphone-14-pro'],
  [24,   'shortWatch',  'ACEHOLO Official',        'This hologram fan is INSANE!'],
  [40,   'search',      'Nike Air Max',            'Search'],
  [70,   'wishlist',    '4pcs Ladies Bag Set',     'Saved to wishlist',             'ladies-bag-set'],
  [240,  'liveJoin',    'Fashion Hub',             'LIVE: Fashion collection drop'],
  [1560, 'follow',      'TechHub Kenya',           'Followed seller'],
  [1680, 'productView', 'Samsung Galaxy S24 Ultra','Mombasa, Kenya',                'galaxy-s24'],
  [1800, 'contact',     'Electronics Plus',        'Messaged about an item'],
  [3120, 'review',      'Dumbbell Set 50kg',       'You left a 5-star review'],
  [4440, 'search',      'Office chair',            'Search'],
  [6000, 'listing',     'Vintage Leather Jacket',  'You posted a listing'],
];

const buildSeed = (): Activity[] => {
  const now = Date.now();
  return SEED.map(([mins, type, title, subtitle, imageSeed]) => ({
    id: `seed-${mins}`,
    type,
    title,
    subtitle,
    createdAt: new Date(now - mins * 60_000),
    imageSeed,
  }));
};

const dateOnly = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// Same buckets as mobile's _buildTimeline: "This Week" starts strictly after
// Monday of the current week, so an item landing exactly on Monday reads as
// "Earlier" — matching the Flutter behaviour rather than correcting it.
function bucketOf(t: Date, now: Date): string {
  const today = dateOnly(now);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const isoWeekday = now.getDay() === 0 ? 7 : now.getDay();
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - (isoWeekday - 1));

  const d = dateOnly(t);
  if (d >= today) return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  if (d > weekStart) return 'This Week';
  return 'Earlier';
}

// Mirrors _ago(): Just now / Xm / Xh / Xd, then non-padded d/m/yyyy.
function ago(t: Date, now: Date): string {
  const mins = Math.floor((now.getTime() - t.getTime()) / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${t.getDate()}/${t.getMonth() + 1}/${t.getFullYear()}`;
}

const GROUP_ORDER = ['Today', 'Yesterday', 'This Week', 'Earlier'];

function ActivityCenterPage() {
  const router = useRouter();
  // Seeded on the client only: the offsets are relative to "now", so building
  // them during SSR would render times that disagree with the client's.
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [filter, setFilter] = useState<Category | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const { loading, error, retry, forceEmpty } = usePageLoad();

  useEffect(() => {
    setNow(new Date());
    setActivities(buildSeed());
  }, []);

  const visible = useMemo(() => {
    if (!activities) return [];
    const list = forceEmpty ? [] : activities;
    return filter ? list.filter(a => CATEGORY_OF[a.type] === filter) : list;
  }, [activities, filter, forceEmpty]);

  const groups = useMemo(() => {
    if (!now) return {} as Record<string, Activity[]>;
    return visible.reduce<Record<string, Activity[]>>((acc, a) => {
      (acc[bucketOf(a.createdAt, now)] ??= []).push(a);
      return acc;
    }, {});
  }, [visible, now]);

  // Per-type destinations, matching _openActivity().
  const open = (a: Activity) => {
    switch (a.type) {
      case 'productView':
      case 'wishlist':
      case 'review':     router.push('/product/1'); break;
      case 'shortWatch':
      case 'liveJoin':   router.push('/feed'); break;
      case 'search':     router.push(`/search?q=${encodeURIComponent(a.title)}`); break;
      case 'follow':     router.push(`/feed/creator/${creatorSlug(a.title)}`); break;
      case 'contact':    router.push('/chat/1'); break;
      case 'listing':    router.push('/sell/listings'); break;
    }
  };

  const remove = (id: string) => setActivities(prev => (prev ?? []).filter(a => a.id !== id));

  const isLoading = loading || !activities || !now;
  // Mobile gates the Clear button on the UNFILTERED list, so it stays visible
  // when a filter is empty but history exists.
  const hasAny = (activities?.length ?? 0) > 0 && !forceEmpty;

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-24 lg:pb-10">
      {/* App bar */}
      <div className="relative flex items-center justify-center mb-4">
        <button
          onClick={() => router.back()}
          className="absolute left-0 w-11 h-11 rounded-2xl bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.07)] flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-theme-primary" />
        </button>
        <h1 className="text-[18px] font-semibold text-theme-primary">Activity Center</h1>
        {!isLoading && !error && hasAny && (
          <button
            onClick={() => setConfirmClear(true)}
            className="absolute right-0 px-3 py-2 rounded-full text-sm font-semibold text-[#FF4D4D] hover:bg-[#FF4D4D]/10 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4">
        {FILTERS.map(f => {
          const active = filter === f.key;
          return (
            <button
              key={f.label}
              onClick={() => setFilter(f.key)}
              className={`px-4 h-9 rounded-full text-[13px] font-medium whitespace-nowrap border transition-colors ${
                active
                  ? 'bg-primary border-primary text-white'
                  : 'bg-surface border-theme text-theme-secondary hover:border-primary/40 hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {isLoading ? (
        <SkeletonList rows={9} />
      ) : error ? (
        <AppErrorView onRetry={retry} />
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center text-center px-8 py-16">
          <div className="w-[88px] h-[88px] rounded-full bg-elevated flex items-center justify-center">
            <ActivityIcon className="w-10 h-10 text-theme-muted" />
          </div>
          <h2 className="mt-5 text-[17px] font-semibold text-theme-primary">
            {filter === null ? 'No activity yet' : 'Nothing here yet'}
          </h2>
          <p className="mt-2 text-[13.5px] text-theme-secondary max-w-xs leading-relaxed">
            {filter === null
              ? 'As you browse ads, watch shorts and search, your activity shows up here.'
              : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        GROUP_ORDER.filter(g => groups[g]?.length).map((group, gi) => (
          <div key={group}>
            <h3 className={`text-sm font-semibold text-theme-muted pb-2.5 ${gi === 0 ? 'pt-2' : 'pt-5'}`}>
              {group}
            </h3>
            {groups[group].map(a => {
              const meta = META[a.type];
              const { Icon } = meta;
              return (
                <div
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => open(a)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(a); } }}
                  className="group relative flex items-center gap-3 mb-2 p-3 bg-surface border border-theme rounded-[14px] cursor-pointer hover:border-primary/40 transition-colors"
                >
                  {/* Product rows carry a real thumbnail; everything else gets
                      the tinted type icon. */}
                  {a.imageSeed ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://picsum.photos/seed/${encodeURIComponent(a.imageSeed)}/96/96`}
                      alt=""
                      className="w-12 h-12 rounded-[10px] object-cover flex-shrink-0 bg-elevated"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${meta.color}1C` }}
                    >
                      <Icon className="w-[22px] h-[22px]" style={{ color: meta.color }} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold" style={{ color: meta.color }}>
                        {meta.label}
                      </span>
                      <span className="ml-auto text-[11px] text-theme-muted whitespace-nowrap">
                        {ago(a.createdAt, now)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-theme-primary truncate">{a.title}</p>
                    {a.subtitle && (
                      <p className="text-xs text-theme-secondary truncate">{a.subtitle}</p>
                    )}
                  </div>

                  {/* Web stand-in for mobile's swipe-to-delete. */}
                  <button
                    onClick={e => { e.stopPropagation(); remove(a.id); }}
                    aria-label={`Remove ${a.title} from activity`}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center bg-[#FF4D4D] text-white opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:ring-2 focus-visible:ring-[#FF4D4D]/50 transition-opacity"
                  >
                    <Trash2 className="w-[18px] h-[18px]" />
                  </button>
                </div>
              );
            })}
          </div>
        ))
      )}

      {/* Clear confirmation */}
      {confirmClear && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setConfirmClear(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-activity-title"
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-surface rounded-[20px] p-6 shadow-2xl"
          >
            <h3 id="clear-activity-title" className="text-base font-bold text-theme-primary">Clear activity?</h3>
            <p className="text-sm text-theme-secondary mt-2">
              This removes your entire activity history. This can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmClear(false)}
                className="px-4 py-2 rounded-full text-sm font-medium text-theme-muted hover:bg-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { setActivities([]); setConfirmClear(false); }}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-[#FF4D4D] text-white hover:brightness-110 transition-all"
              >
                Clear
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ActivityCenterPageWrapper() {
  return <ProtectedRoute><ActivityCenterPage /></ProtectedRoute>;
}
