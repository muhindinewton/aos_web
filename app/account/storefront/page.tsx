'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/protected-route';
import {
  ChevronLeft,
  BadgeCheck,
  Eye,
  ThumbsUp,
  Users,
  Palette,
  Monitor,
  Plus,
  MoreVertical,
  Image,
  Radio,
  BarChart2,
  Share2,
  MessageCircle,
  TrendingUp,
  Edit3,
  Trash2,
  X,
} from 'lucide-react';

type Post = {
  title: string;
  thumbnail: string;
  type: 'video' | 'live' | 'photo';
  views: number;
  likes: number;
  comments: number;
  shares: number;
  duration?: string;
  postedAt: string;
};

const initialPosts: Post[] = [
  {
    title: 'iPhone 14 Pro Max Unboxing',
    thumbnail: 'A',
    type: 'video',
    views: 12500,
    likes: 890,
    comments: 145,
    shares: 67,
    duration: '02:45',
    postedAt: '2 days ago',
  },
  {
    title: 'Flash Sale Live Stream',
    thumbnail: 'B',
    type: 'live',
    views: 8700,
    likes: 1200,
    comments: 534,
    shares: 89,
    duration: '45:30',
    postedAt: '1 week ago',
  },
  {
    title: 'MacBook Pro M2 Review',
    thumbnail: 'C',
    type: 'video',
    views: 5600,
    likes: 445,
    comments: 78,
    shares: 34,
    duration: '08:15',
    postedAt: '2 weeks ago',
  },
  {
    title: 'New Arrivals Showcase',
    thumbnail: 'D',
    type: 'video',
    views: 3200,
    likes: 267,
    comments: 45,
    shares: 21,
    duration: '03:20',
    postedAt: '3 weeks ago',
  },
  {
    title: 'Latest iPhone Collection',
    thumbnail: 'E',
    type: 'photo',
    views: 4500,
    likes: 380,
    comments: 56,
    shares: 28,
    postedAt: '1 month ago',
  },
];

const thumbnailColors: Record<string, string> = {
  A: 'from-blue-500 to-indigo-600',
  B: 'from-red-500 to-orange-500',
  C: 'from-slate-500 to-gray-700',
  D: 'from-emerald-500 to-teal-600',
  E: 'from-purple-500 to-pink-500',
};

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function MyStorefrontPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'analytics'>('posts');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [optionsPost, setOptionsPost] = useState<Post | null>(null);
  const [analyticsPost, setAnalyticsPost] = useState<Post | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);

  const totalViews = posts.reduce((s, p) => s + p.views, 0);
  const totalLikes = posts.reduce((s, p) => s + p.likes, 0);
  const totalShares = posts.reduce((s, p) => s + p.shares, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments, 0);

  const handleDelete = (post: Post) => {
    setPosts((prev) => prev.filter((p) => p.title !== post.title));
    setDeletePost(null);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">
            My Storefront
          </h1>
          <div className="w-10" />
        </div>

        {/* Profile Card */}
        <div className="bg-surface border border-theme rounded-2xl p-5 mb-4 shadow-soft">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-4">
            <div className="p-0.5 rounded-full bg-gradient-to-br from-primary to-red-400 mb-3">
              <div className="w-20 h-20 rounded-full bg-elevated border-2 border-surface flex items-center justify-center">
                <span className="text-3xl font-bold text-theme-muted">T</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-theme-primary">TechHub Kenya</span>
              <BadgeCheck className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center bg-elevated rounded-xl py-3 px-4 mb-4">
            <QuickStat value="30K" label="Views" />
            <div className="w-px h-8 bg-theme mx-auto" />
            <QuickStat value="2.8K" label="Likes" />
            <div className="w-px h-8 bg-theme mx-auto" />
            <QuickStat value="1.2K" label="Followers" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Link
              href="/account/storefront/customize"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-elevated border border-theme text-theme-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
            >
              <Palette className="w-4 h-4" />
              Customize
            </Link>
            <Link
              href="/seller/1"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-elevated border border-theme text-theme-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
            >
              <Monitor className="w-4 h-4" />
              Preview
            </Link>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-surface border border-theme rounded-2xl p-4 shadow-soft">
          {/* Tab Bar */}
          <div className="flex bg-elevated rounded-xl p-1 mb-4">
            {(['posts', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                {tab === 'posts' ? 'My Posts' : 'Analytics'}
              </button>
            ))}
          </div>

          {activeTab === 'posts' && (
            <PostsTab
              posts={posts}
              onOptions={setOptionsPost}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab
              posts={posts}
              totalViews={totalViews}
              totalLikes={totalLikes}
              totalShares={totalShares}
              totalComments={totalComments}
            />
          )}
        </div>

        <div className="h-20" />
      </div>

      {/* Post Options Sheet */}
      {optionsPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOptionsPost(null)} />
          <div className="relative bg-surface rounded-t-3xl w-full max-w-md p-5 animate-slide-up">
            <div className="w-10 h-1 bg-theme rounded-full mx-auto mb-4" />
            <h3 className="text-base font-semibold text-theme-primary text-center mb-4 truncate">
              {optionsPost.title}
            </h3>
            <div className="space-y-1">
              <OptionTile
                icon={BarChart2}
                label="View Analytics"
                onClick={() => {
                  setAnalyticsPost(optionsPost);
                  setOptionsPost(null);
                }}
              />
              <OptionTile icon={Edit3} label="Edit Post" onClick={() => setOptionsPost(null)} />
              <OptionTile icon={Share2} label="Share Post" onClick={() => setOptionsPost(null)} />
              <OptionTile
                icon={Trash2}
                label="Delete Post"
                destructive
                onClick={() => {
                  setDeletePost(optionsPost);
                  setOptionsPost(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Analytics Sheet */}
      {analyticsPost && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAnalyticsPost(null)} />
          <div className="relative bg-surface rounded-t-3xl w-full max-w-md p-5 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-theme rounded-full mx-auto mb-4" />
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-theme-primary">Post Analytics</span>
            </div>
            <p className="text-sm text-theme-muted mb-5">{analyticsPost.title}</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <AnalyticItem icon={Eye} label="Views" value={formatNumber(analyticsPost.views)} change="+12%" />
              <AnalyticItem icon={ThumbsUp} label="Likes" value={formatNumber(analyticsPost.likes)} change="+8%" />
              <AnalyticItem icon={MessageCircle} label="Comments" value={formatNumber(analyticsPost.comments)} change="+5%" />
              <AnalyticItem icon={Share2} label="Shares" value={formatNumber(analyticsPost.shares)} change="+3%" />
              <AnalyticItem
                icon={TrendingUp}
                label="Engagement"
                value={`${(((analyticsPost.likes + analyticsPost.comments + analyticsPost.shares) / analyticsPost.views) * 100).toFixed(1)}%`}
              />
            </div>
            <p className="text-xs text-theme-muted">Posted {analyticsPost.postedAt}</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeletePost(null)} />
          <div className="relative bg-surface rounded-2xl w-full max-w-sm p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-theme-primary mb-2">Delete Post?</h3>
            <p className="text-sm text-theme-muted mb-6">
              Are you sure you want to delete &quot;{deletePost.title}&quot;? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletePost(null)}
                className="flex-1 py-2.5 rounded-xl border border-theme text-theme-primary font-medium hover:bg-elevated transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletePost)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function MyStorefrontPageWrapper() {
  return <ProtectedRoute><MyStorefrontPage /></ProtectedRoute>;
}

function QuickStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <span className="text-base font-bold text-theme-primary">{value}</span>
      <span className="text-xs text-theme-muted">{label}</span>
    </div>
  );
}

function PostsTab({ posts, onOptions }: { posts: Post[]; onOptions: (p: Post) => void }) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-theme-primary">My Posts ({posts.length})</span>
        <Link
          href="/sell/post"
          className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Post
        </Link>
      </div>
      <div className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.title} post={post} onOptions={onOptions} />
        ))}
      </div>
    </>
  );
}

function PostCard({ post, onOptions }: { post: Post; onOptions: (p: Post) => void }) {
  const gradient = thumbnailColors[post.thumbnail] ?? 'from-gray-400 to-gray-600';
  return (
    <div className="flex gap-3 p-3 bg-elevated rounded-xl">
      {/* Thumbnail */}
      <div className="relative flex-shrink-0">
        <div
          className={`w-24 h-[72px] rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
        >
          <span className="text-white text-xl font-bold">{post.thumbnail}</span>
        </div>
        {post.duration && (
          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
            {post.duration}
          </span>
        )}
        {post.type === 'live' && (
          <span className="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            LIVE
          </span>
        )}
        {post.type === 'photo' && (
          <span className="absolute top-1 left-1 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
            <Image className="w-2.5 h-2.5" />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-theme-primary truncate">{post.title}</p>
        <p className="text-xs text-theme-muted mb-1.5">{post.postedAt}</p>
        <div className="flex items-center gap-3">
          <MiniStat icon={Eye} value={formatNumber(post.views)} />
          <MiniStat icon={ThumbsUp} value={formatNumber(post.likes)} />
          <MiniStat icon={Share2} value={String(post.shares)} />
        </div>
      </div>

      <button
        onClick={() => onOptions(post)}
        className="p-1 text-theme-muted hover:text-theme-primary transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>
  );
}

function MiniStat({ icon: Icon, value }: { icon: React.ElementType; value: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-theme-muted">
      <Icon className="w-3 h-3" />
      {value}
    </span>
  );
}

function AnalyticsTab({
  posts,
  totalViews,
  totalLikes,
  totalShares,
  totalComments,
}: {
  posts: Post[];
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
}) {
  const topPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 3);
  return (
    <>
      <p className="text-sm font-semibold text-theme-primary mb-4">Performance Overview</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <MetricCard icon={Eye} value={formatNumber(totalViews)} label="Total Views" change="+12%" />
        <MetricCard icon={ThumbsUp} value={formatNumber(totalLikes)} label="Total Likes" change="+8%" />
        <MetricCard icon={Share2} value={formatNumber(totalShares)} label="Total Shares" change="+15%" />
        <MetricCard icon={MessageCircle} value={formatNumber(totalComments)} label="Comments" change="+10%" />
      </div>

      <p className="text-sm font-semibold text-theme-primary mb-3">Top Performing Posts</p>
      <div className="space-y-2">
        {topPosts.map((post) => {
          const gradient = thumbnailColors[post.thumbnail] ?? 'from-gray-400 to-gray-600';
          return (
            <div key={post.title} className="flex items-center gap-3 p-3 bg-elevated rounded-xl">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-white font-bold">{post.thumbnail}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-theme-primary truncate">{post.title}</p>
                <p className="text-xs text-theme-muted">{formatNumber(post.views)} views</p>
              </div>
              <span className="text-sm font-semibold text-primary">{post.shares} shares</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function MetricCard({
  icon: Icon,
  value,
  label,
  change,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  change?: string;
}) {
  return (
    <div className="bg-elevated rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-primary" />
        {change && (
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/15 px-1.5 py-0.5 rounded">
            {change}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-theme-primary">{value}</p>
      <p className="text-xs text-theme-muted">{label}</p>
    </div>
  );
}

function AnalyticItem({
  icon: Icon,
  label,
  value,
  change,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <div className="bg-elevated rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-theme-muted" />
        {change && (
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/15 px-1.5 py-0.5 rounded">
            {change}
          </span>
        )}
      </div>
      <p className="text-xl font-bold text-theme-primary">{value}</p>
      <p className="text-xs text-theme-muted">{label}</p>
    </div>
  );
}

function OptionTile({
  icon: Icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
        destructive ? 'hover:bg-red-500/10' : 'hover:bg-elevated'
      }`}
    >
      <Icon className={`w-5 h-5 ${destructive ? 'text-red-500' : 'text-theme-primary'}`} />
      <span
        className={`font-medium text-sm ${destructive ? 'text-red-500' : 'text-theme-primary'}`}
      >
        {label}
      </span>
    </button>
  );
}
