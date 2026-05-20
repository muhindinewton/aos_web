'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, X } from 'lucide-react';
import { SEED_FEED, creatorSlug, creatorUsername } from '../../feed-data';

type Tab = 'following' | 'followers' | 'suggested';
const TABS: { key: Tab; label: string }[] = [
  { key: 'following', label: 'Following' },
  { key: 'followers', label: 'Followers' },
  { key: 'suggested', label: 'Suggested' },
];

interface UserRow {
  name: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
}

export default function FollowersFollowingPage() {
  const router = useRouter();
  const params = useParams<{ name: string }>();
  const sp = useSearchParams();
  const slug = params?.name ?? '';
  const initialTab = (sp.get('tab') as Tab) || 'following';

  const [tab, setTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState('');
  const [followState, setFollowState] = useState<Record<string, boolean>>({});

  // Resolve the profile owner's display name from the slug, or fall back to the slug
  const owner = useMemo(() => {
    const match = SEED_FEED.find(i => creatorSlug(i.creatorName) === slug);
    return match?.creatorName || slug;
  }, [slug]);

  // Derive a roster of users from the feed creators, then slice into three lists
  // to mirror mobile (following=all creators, followers=subset+a few buyers,
  // suggested=mix of new names + creators).
  const { following, followers, suggested } = useMemo(() => {
    const seen = new Map<string, UserRow>();
    for (const item of SEED_FEED) {
      if (seen.has(item.creatorName) || creatorSlug(item.creatorName) === slug) continue;
      seen.set(item.creatorName, {
        name: item.creatorName,
        username: creatorUsername(item.creatorName),
        avatar: item.creatorAvatar,
        isFollowing: true,
      });
    }
    const creators = Array.from(seen.values());

    const buyers: UserRow[] = [
      { name: 'Nairobi Styles',  username: '@nairobi_styles',  avatar: 'N', isFollowing: false },
      { name: 'Kenya Deals',     username: '@kenya_deals',     avatar: 'K', isFollowing: false },
      { name: 'TrendyKE',        username: '@trendyke',        avatar: 'T', isFollowing: false },
      { name: 'StyleQueen254',   username: '@stylequeen254',   avatar: 'S', isFollowing: false },
      { name: 'DealHunter',      username: '@dealhunter',      avatar: 'D', isFollowing: false },
      { name: 'MombasaBuyer',    username: '@mombasabuyer',    avatar: 'M', isFollowing: false },
      { name: 'FashionLover',    username: '@fashionlover',    avatar: 'F', isFollowing: false },
    ];

    return {
      following: creators,
      followers: [...creators.slice(0, 5), ...buyers.slice(0, 2)],
      suggested: [...buyers.slice(2), ...creators.slice(3)],
    };
  }, [slug]);

  const counts = { following: following.length, followers: followers.length, suggested: suggested.length };

  const activeList: UserRow[] =
    tab === 'following' ? following :
    tab === 'followers' ? followers :
                          suggested;

  const q = search.trim().toLowerCase();
  const filtered = !q ? activeList : activeList.filter(u =>
    u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
  );

  const isFollowing = (u: UserRow) => followState[u.name] ?? u.isFollowing;
  const toggleFollow = (name: string, current: boolean) =>
    setFollowState(prev => ({ ...prev, [name]: !current }));

  return (
    <div className="min-h-screen bg-theme">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-30 bg-theme">
        <div className="flex items-center px-4 py-3 max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full bg-elevated border border-theme flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-theme-primary" />
          </button>
          <p className="flex-1 text-center text-theme-primary font-bold truncate px-3">
            {creatorUsername(owner)}
          </p>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-24">
        {/* ── Tabs ── */}
        <div className="sticky top-[60px] bg-theme border-b border-theme z-20">
          <div className="flex">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-3 text-sm font-semibold border-b-[2.5px] transition-colors ${
                  tab === key ? 'border-primary text-primary' : 'border-transparent text-theme-muted'
                }`}
              >
                {label}{key !== 'suggested' && ` ${counts[key]}`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Search ── */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full bg-elevated border border-theme rounded-full py-2.5 pl-10 pr-10 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-theme-muted/20 flex items-center justify-center"
              >
                <X className="w-3 h-3 text-theme-muted" />
              </button>
            )}
          </div>
        </div>

        {/* ── User list ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
            <Search className="w-14 h-14 opacity-30" />
            <p className="text-sm mt-3">
              {search ? `No users matching "${search}"` : 'No users here yet'}
            </p>
          </div>
        ) : (
          <div className="px-2 pt-1">
            {filtered.map(user => {
              const followingNow = isFollowing(user);
              return (
                <div key={user.name} className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface rounded-xl transition-colors">
                  <Link
                    href={`/feed/creator/${creatorSlug(user.name)}`}
                    className="w-[52px] h-[52px] rounded-full bg-elevated border border-theme flex items-center justify-center flex-shrink-0"
                  >
                    <span className="text-theme-primary font-bold text-xl">{user.avatar}</span>
                  </Link>
                  <Link href={`/feed/creator/${creatorSlug(user.name)}`} className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-theme-primary truncate">{user.name}</p>
                    <p className="text-xs text-theme-muted truncate">{user.username}</p>
                  </Link>
                  <button
                    onClick={() => toggleFollow(user.name, followingNow)}
                    className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{
                      backgroundColor: followingNow ? 'var(--elevated)' : 'var(--primary)',
                      border:          followingNow ? '1px solid var(--border)' : 'none',
                      color:           followingNow ? 'var(--text-primary)' : 'white',
                    }}
                  >
                    {followingNow ? 'Following' : 'Follow'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
