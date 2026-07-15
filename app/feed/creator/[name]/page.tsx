'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Share2,
  Grid3x3,
  Heart,
  Check,
  UserPlus,
  MessageCircle,
  BadgeCheck,
  Play,
} from 'lucide-react';
import {
  FeedItem,
  SEED_FEED,
  creatorSlug,
  creatorUsername,
  fmt,
} from '../../feed-data';

type StatTab = 'following' | 'followers';

const fmtCompact = fmt;

export default function CreatorProfilePage() {
  const params = useParams<{ name: string }>();
  const router = useRouter();
  const slug = params?.name ?? '';

  const posts = useMemo(
    () => SEED_FEED.filter(i => creatorSlug(i.creatorName) === slug),
    [slug]
  );
  const creator = posts[0]; // canonical post supplies avatar / verified / name

  const [tab, setTab] = useState<'posts' | 'liked'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  if (!creator) {
    return (
      <div className="min-h-screen bg-theme flex flex-col items-center justify-center px-6 text-center">
        <p className="text-theme-primary font-semibold text-lg">Creator not found</p>
        <p className="text-theme-muted text-sm mt-2">We couldn&apos;t find a creator matching this URL.</p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold"
        >
          Go back
        </button>
      </div>
    );
  }

  const totalLikes = posts.reduce((sum, i) => sum + i.likeCount, 0);
  const followers  = Math.round(totalLikes * 0.8);
  const following  = 142;
  const username   = creatorUsername(creator.creatorName);

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
          <p className="flex-1 text-center text-theme-primary font-bold">{creator.creatorName}</p>
          <button className="w-9 h-9 rounded-full bg-elevated border border-theme flex items-center justify-center">
            <Share2 className="w-4 h-4 text-theme-primary" />
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto pb-24">
        {/* ── Header ── */}
        <div className="flex flex-col items-center pt-5 pb-4 px-6">
          {/* Avatar */}
          <div
            className="w-[90px] h-[90px] rounded-full flex items-center justify-center"
            style={{
              border: '2.5px solid var(--primary)',
              background: 'linear-gradient(135deg, rgba(193,18,31,0.15), var(--elevated))',
            }}
          >
            <span className="text-primary text-4xl font-bold">{creator.creatorAvatar}</span>
          </div>

          {/* Name + verified */}
          <div className="flex items-center gap-1.5 mt-3">
            <p className="text-theme-primary font-bold text-lg">{creator.creatorName}</p>
            {creator.isVerified && <BadgeCheck className="w-5 h-5 text-blue-500" />}
          </div>
          <p className="text-theme-muted text-xs mt-0.5">{username}</p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-0 mt-4">
            <Stat label="Following" value={fmtCompact(following)} href={`/feed/followers/${slug}?tab=following`} />
            <div className="w-px h-7 bg-[var(--border)]" />
            <Stat label="Followers" value={fmtCompact(followers)} href={`/feed/followers/${slug}?tab=followers`} />
            <div className="w-px h-7 bg-[var(--border)]" />
            <Stat label="Likes" value={fmtCompact(totalLikes)} />
          </div>

          {/* Bio */}
          <p className="text-theme-secondary text-sm text-center mt-3 leading-relaxed">
            Content creator on AOS Africa
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full mt-4 px-2">
            <button
              onClick={() => setIsFollowing(f => !f)}
              className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 transition-colors"
              style={{
                background: isFollowing ? 'var(--elevated)' : 'var(--primary)',
                border: isFollowing ? '1px solid var(--border)' : 'none',
                color: isFollowing ? 'var(--text-primary)' : 'white',
              }}
            >
              {isFollowing ? <Check className="w-[18px] h-[18px]" /> : <UserPlus className="w-[18px] h-[18px]" />}
              <span className="font-semibold text-[15px]">{isFollowing ? 'Following' : 'Follow'}</span>
            </button>
            <Link
              href={`/chat/${creatorSlug(creator.creatorName)}`}
              className="flex-1 h-11 rounded-xl bg-elevated border border-theme flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 text-theme-primary" />
            </Link>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="sticky top-[60px] bg-theme border-b border-theme z-20">
          <div className="flex">
            {([
              ['posts', 'Posts', <Grid3x3 key="p" className="w-5 h-5" />],
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
        {tab === 'posts'
          ? <PostsGrid posts={posts} />
          : <EmptyTab icon={<Heart className="w-14 h-14 opacity-30" />} message="Liked posts are private" />
        }
      </div>
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

function PostsGrid({ posts }: { posts: FeedItem[] }) {
  if (posts.length === 0) {
    return <EmptyTab icon={<Grid3x3 className="w-14 h-14 opacity-30" />} message="No posts yet" />;
  }
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-[2px] mt-1">
      {posts.map(p => (
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
            {fmtCompact(p.likeCount)}
            <span className="ml-auto text-white/70 font-normal">{p.duration ?? ''}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function EmptyTab({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
      {icon}
      <p className="text-sm mt-3">{message}</p>
    </div>
  );
}
