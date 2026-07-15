'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Eye, Heart, PlayCircle, Radio, Search, UserPlus, Star,
  MessageCircle, Store, Activity as ActivityIcon,
} from 'lucide-react';
import ProtectedRoute from '../../components/protected-route';
import { usePageLoad, SkeletonList, AppErrorView } from '../../components/app-state-views';

// Web port of mobile's activity_center_screen.dart — a timeline of everything
// the user did in the app, filterable by category.

type Category = 'products' | 'shorts' | 'searches' | 'social' | 'selling';

interface Activity {
  id: string;
  category: Category;
  action: 'Viewed' | 'Saved' | 'Watched' | 'Live' | 'Searched' | 'Followed' | 'Reviewed' | 'Contacted' | 'Listed';
  title: string;
  subtitle: string;
  hoursAgo: number;
}

const ACTION_ICONS: Record<Activity['action'], React.ElementType> = {
  Viewed: Eye,
  Saved: Heart,
  Watched: PlayCircle,
  Live: Radio,
  Searched: Search,
  Followed: UserPlus,
  Reviewed: Star,
  Contacted: MessageCircle,
  Listed: Store,
};

const FILTERS: { label: string; key: Category | null }[] = [
  { label: 'All', key: null },
  { label: 'Products', key: 'products' },
  { label: 'Shorts', key: 'shorts' },
  { label: 'Searches', key: 'searches' },
  { label: 'Social', key: 'social' },
  { label: 'Selling', key: 'selling' },
];

const SEED_ACTIVITIES: Activity[] = [
  { id: '1',  category: 'products', action: 'Viewed',    title: 'iPhone 15 Pro Max',            subtitle: 'Apple Store KE · Ksh 185,000',        hoursAgo: 1 },
  { id: '2',  category: 'searches', action: 'Searched',  title: '"macbook m2"',                 subtitle: '24 results',                          hoursAgo: 2 },
  { id: '3',  category: 'products', action: 'Saved',     title: 'Sony WH-1000XM5 Headphones',   subtitle: 'Added to wishlist',                   hoursAgo: 3 },
  { id: '4',  category: 'shorts',   action: 'Watched',   title: 'iPhone 14 Pro Max Unboxing',   subtitle: 'TechHub Kenya · 2:45',                hoursAgo: 5 },
  { id: '5',  category: 'social',   action: 'Followed',  title: 'GlowUp Beauty',                subtitle: 'Now following',                       hoursAgo: 8 },
  { id: '6',  category: 'shorts',   action: 'Live',      title: 'Flash Sale Live Stream',       subtitle: 'SneakerHead KE · watched 12 min',     hoursAgo: 26 },
  { id: '7',  category: 'products', action: 'Contacted', title: 'AutoMart Kenya',               subtitle: 'About Toyota Axio 2015',              hoursAgo: 30 },
  { id: '8',  category: 'social',   action: 'Reviewed',  title: 'MacBook Pro M2',               subtitle: '5 stars · "Excellent condition"',     hoursAgo: 50 },
  { id: '9',  category: 'selling',  action: 'Listed',    title: 'Samsung Galaxy S24 Ultra',     subtitle: 'Ksh 145,000 · pending review',        hoursAgo: 76 },
  { id: '10', category: 'searches', action: 'Searched',  title: '"office chair"',               subtitle: '41 results',                          hoursAgo: 200 },
];

function groupLabel(hoursAgo: number): string {
  if (hoursAgo < 24) return 'Today';
  if (hoursAgo < 48) return 'Yesterday';
  if (hoursAgo < 24 * 7) return 'This Week';
  return 'Earlier';
}

function timeLabel(hoursAgo: number): string {
  if (hoursAgo < 1) return 'Just now';
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  return `${Math.floor(hoursAgo / 24)}d ago`;
}

const GROUP_ORDER = ['Today', 'Yesterday', 'This Week', 'Earlier'];

function ActivityCenterPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>(SEED_ACTIVITIES);
  const [filter, setFilter] = useState<Category | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const { loading, error, retry, forceEmpty } = usePageLoad();

  const filtered = forceEmpty ? [] : filter ? activities.filter(a => a.category === filter) : activities;

  const groups = filtered.reduce<Record<string, Activity[]>>((acc, a) => {
    (acc[groupLabel(a.hoursAgo)] ??= []).push(a);
    return acc;
  }, {});

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 pb-24 lg:pb-10">
      {/* App bar */}
      <div className="relative flex items-center justify-center mb-5">
        <button
          onClick={() => router.back()}
          className="absolute left-0 w-11 h-11 rounded-2xl bg-surface shadow-[0_2px_10px_rgba(0,0,0,0.07)] flex items-center justify-center hover:bg-elevated transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 text-theme-primary" />
        </button>
        <h1 className="text-xl font-bold text-theme-primary">Activity Center</h1>
        {activities.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="absolute right-0 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
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
              className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                active ? 'bg-primary/15 text-primary' : 'text-theme-secondary hover:text-theme-primary'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      {loading ? (
        <SkeletonList rows={7} />
      ) : error ? (
        <AppErrorView onRetry={retry} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center text-center px-8 py-16">
          <div className="w-[88px] h-[88px] rounded-full bg-elevated flex items-center justify-center">
            <ActivityIcon className="w-10 h-10 text-theme-muted" />
          </div>
          <h2 className="mt-5 text-[17px] font-semibold text-theme-primary">
            {forceEmpty || activities.length === 0 ? 'No activity yet' : 'Nothing here yet'}
          </h2>
          <p className="mt-2 text-[13.5px] text-theme-secondary max-w-xs leading-relaxed">
            {forceEmpty || activities.length === 0
              ? 'As you browse ads, watch shorts and search, your activity will show up here.'
              : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        GROUP_ORDER.filter(g => groups[g]?.length).map(group => (
          <div key={group} className="mb-5">
            <h3 className="text-sm font-semibold text-theme-muted mb-2">{group}</h3>
            <div className="bg-surface border border-theme rounded-2xl divide-y divide-[var(--border,#E8E8E8)] overflow-hidden">
              {groups[group].map(a => {
                const Icon = ACTION_ICONS[a.action];
                return (
                  <div key={a.id} className="flex items-center gap-3.5 px-4 py-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-theme-primary truncate">
                        <span className="font-semibold">{a.action}</span> · {a.title}
                      </p>
                      <p className="text-xs text-theme-muted truncate mt-0.5">{a.subtitle}</p>
                    </div>
                    <span className="text-xs text-theme-muted whitespace-nowrap flex-shrink-0">
                      {timeLabel(a.hoursAgo)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Clear confirmation */}
      {confirmClear && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setConfirmClear(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-sm bg-surface rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-theme-primary">Clear activity?</h3>
            <p className="text-sm text-theme-muted mt-2">
              This removes your entire activity history. This cannot be undone.
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
                className="px-5 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-hover transition-colors"
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
