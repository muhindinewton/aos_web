'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Grid3x3,
  Bookmark,
  Heart,
  Camera,
  User as UserIcon,
  Play,
} from 'lucide-react';
import { useAuth } from '@/app/providers/auth-provider';
import {
  FeedItem,
  LIKED_IDS_DEFAULT,
  SAVED_IDS_DEFAULT,
  SEED_FEED,
  fmt,
} from '../feed-data';

type Tab = 'posts' | 'saved' | 'liked';

export default function FeedProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('posts');
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const [bio, setBio] = useState<string>('Content creator on AOS Africa');

  const name = displayName || user?.displayName || 'My Account';
  const username = '@' + (user?.email?.split('@')[0]?.toLowerCase() || 'you');
  const initial = (displayName || user?.displayName || user?.email || '?')[0].toUpperCase();

  const myPosts  = useMemo(() => SEED_FEED.slice(0, 5), []);
  const saved    = useMemo(() => SEED_FEED.filter(i => SAVED_IDS_DEFAULT.has(i.id)), []);
  const liked    = useMemo(() => SEED_FEED.filter(i => LIKED_IDS_DEFAULT.has(i.id)), []);

  const stats = {
    following: 142,
    followers: Math.round(myPosts.reduce((s, i) => s + i.likeCount, 0) * 0.8),
    likes:     myPosts.reduce((s, i) => s + i.likeCount, 0),
  };

  const items = tab === 'posts' ? myPosts : tab === 'saved' ? saved : liked;
  const emptyMessage = tab === 'posts' ? 'No posts yet' : tab === 'saved' ? 'No saved posts' : 'No liked posts';
  const emptyIcon =
    tab === 'posts' ? <Grid3x3 className="w-14 h-14 opacity-30" /> :
    tab === 'saved' ? <Bookmark className="w-14 h-14 opacity-30" /> :
                      <Heart className="w-14 h-14 opacity-30" />;

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
          <p className="flex-1 text-center text-theme-primary font-bold">Me</p>
          <button className="w-9 h-9 rounded-full bg-elevated border border-theme flex items-center justify-center">
            <Share2 className="w-4 h-4 text-theme-primary" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-24">
        {/* ── Header ── */}
        <div className="flex flex-col items-center pt-5 pb-4 px-6">
          {/* Avatar with edit camera */}
          <div className="relative">
            <div
              className="w-[90px] h-[90px] rounded-full flex items-center justify-center"
              style={{
                border: '2.5px solid var(--primary)',
                background: 'var(--primary-soft)',
              }}
            >
              {user?.photoURL
                ? <img src={user.photoURL} alt={name} className="w-full h-full rounded-full object-cover" />
                : initial !== '?'
                  ? <span className="text-primary text-4xl font-bold">{initial}</span>
                  : <UserIcon className="w-12 h-12 text-primary" />
              }
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-[1.5px] border-white flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Name */}
          <p className="text-theme-primary font-bold text-lg mt-3">{name}</p>
          <p className="text-theme-muted text-xs mt-0.5">{username}</p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-0 mt-4">
            <Stat label="Following" value={fmt(stats.following)} href="/feed/followers/me?tab=following" />
            <div className="w-px h-7 bg-[var(--border)]" />
            <Stat label="Followers" value={fmt(stats.followers)} href="/feed/followers/me?tab=followers" />
            <div className="w-px h-7 bg-[var(--border)]" />
            <Stat label="Likes" value={fmt(stats.likes)} />
          </div>

          {/* Bio */}
          <p className="text-theme-secondary text-sm text-center mt-3 leading-relaxed">{bio}</p>

          {/* Edit profile button */}
          <button
            onClick={() => setEditing(true)}
            className="mt-4 w-full max-w-[300px] py-2.5 rounded-lg border border-theme text-theme-primary text-sm font-semibold"
          >
            Edit profile
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="sticky top-[60px] bg-theme border-b border-theme z-20">
          <div className="flex">
            {([
              ['posts', 'Posts', <Grid3x3 key="p" className="w-5 h-5" />],
              ['saved', 'Saved', <Bookmark key="s" className="w-5 h-5" />],
              ['liked', 'Liked', <Heart key="l" className="w-5 h-5" />],
            ] as const).map(([key, label, icon]) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-[2.5px] transition-colors ${
                  tab === key ? 'border-primary text-primary' : 'border-transparent text-theme-muted'
                }`}
              >
                {icon}
                <span className="text-[13px] font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        {items.length === 0
          ? <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
              {emptyIcon}
              <p className="text-sm mt-3">{emptyMessage}</p>
            </div>
          : <Grid items={items} />
        }
      </div>

      {editing && (
        <EditProfileSheet
          name={displayName || (user?.displayName ?? '')}
          bio={bio}
          onSave={(n, b) => { setDisplayName(n); setBio(b); setEditing(false); }}
          onClose={() => setEditing(false)}
        />
      )}
    </div>
  );
}

function Stat({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = (
    <>
      <span className="text-theme-primary font-bold text-lg">{value}</span>
      <span className="text-theme-muted text-xs">{label}</span>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="flex flex-col items-center px-5 hover:opacity-80 transition-opacity">
        {content}
      </Link>
    );
  }
  return <div className="flex flex-col items-center px-5">{content}</div>;
}

function Grid({ items }: { items: FeedItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-[2px] mt-1">
      {items.map(p => (
        <Link
          key={p.id}
          href="/feed"
          className="relative block bg-elevated overflow-hidden"
          style={{ aspectRatio: '9 / 16' }}
        >
          <img src={p.videoUrl} alt="" className="w-full h-full object-cover" />
          <div
            className="absolute inset-x-0 bottom-0 h-11"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}
          />
          {!p.isLive && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-7 h-7 text-white/60" fill="rgba(255,255,255,0.3)" />
            </div>
          )}
          {p.isLive && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-primary text-white text-[9px] font-bold tracking-wide">LIVE</span>
          )}
          <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center text-white text-[10px] font-semibold">
            <Heart className="w-3 h-3 mr-1" fill="white" />
            {fmt(p.likeCount)}
            <span className="ml-auto text-white/70 font-normal">{p.duration ?? ''}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function EditProfileSheet({
  name, bio, onSave, onClose,
}: { name: string; bio: string; onSave: (name: string, bio: string) => void; onClose: () => void }) {
  const [n, setN] = useState(name);
  const [b, setB] = useState(bio);
  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end bg-black/50" onClick={onClose}>
      <div
        className="bg-surface rounded-t-2xl w-full max-w-xl mx-auto pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-elevated" />
        </div>
        <div className="px-6 py-4">
          <p className="text-theme-primary font-bold text-lg mb-4">Edit profile</p>
          <label className="block text-theme-muted text-xs font-semibold mb-1.5">Display name</label>
          <input
            value={n}
            onChange={e => setN(e.target.value)}
            placeholder="Your name"
            className="w-full bg-elevated rounded-lg px-3 py-2.5 text-sm text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary mb-4"
          />
          <label className="block text-theme-muted text-xs font-semibold mb-1.5">Bio</label>
          <textarea
            value={b}
            onChange={e => setB(e.target.value)}
            placeholder="Tell people about yourself"
            rows={3}
            className="w-full bg-elevated rounded-lg px-3 py-2.5 text-sm text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary resize-none"
          />
          <div className="flex gap-3 mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-theme text-theme-primary text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(n.trim(), b.trim())}
              className="flex-1 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
