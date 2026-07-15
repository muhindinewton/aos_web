'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft, Lightbulb, TrendingUp, Camera,
  Star, ShieldCheck, ThumbsUp, RefreshCw, Zap, Tag, ImageIcon, LayoutGrid,
  Share2, Megaphone, Percent, Package, Clock, RotateCcw, Users, BarChart2,
  Sun, Square, Box, ZoomIn, Minus, Crop, SlidersHorizontal, Smartphone,
} from 'lucide-react';

type Tip = { title: string; description: string; Icon: LucideIcon; color: string };

type TipsConfig = {
  slug: string;
  title: string;
  subtitle: string;
  gradient: string;
  HeaderIcon: LucideIcon;
  tips: Tip[];
};

const TIPS_DATA: TipsConfig[] = [
  {
    slug: 'ranking',
    title: 'Ranking Tips',
    subtitle: 'Boost your visibility and sales',
    gradient: 'from-amber-500 to-yellow-600',
    HeaderIcon: Lightbulb,
    tips: [
      { title: 'Complete Your Profile', description: 'Add a profile photo, verify your phone number, and fill in all details. Complete profiles rank 40% higher in search results.', Icon: Star, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
      { title: 'Get Verified', description: 'Verify your identity and business. Verified sellers get a trust badge and appear higher in listings.', Icon: ShieldCheck, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
      { title: 'Collect Positive Reviews', description: 'Deliver great service to earn 5-star reviews. Sellers with more positive reviews rank higher.', Icon: ThumbsUp, color: 'text-green-500 bg-green-50 dark:bg-green-500/10' },
      { title: 'Keep Listings Fresh', description: 'Update your ads regularly. Fresh listings get priority in search results and category pages.', Icon: RefreshCw, color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
      { title: 'Respond Quickly', description: 'Fast response times improve your seller score. Aim to reply within 1 hour during business hours.', Icon: Zap, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
      { title: 'Price Competitively', description: 'Well-priced items get more views and engagement. Research similar listings before setting your price.', Icon: Tag, color: 'text-teal-500 bg-teal-50 dark:bg-teal-500/10' },
      { title: 'Use Quality Images', description: 'Listings with 5+ high-quality photos get 3x more views. Show all angles and details clearly.', Icon: ImageIcon, color: 'text-pink-500 bg-pink-50 dark:bg-pink-500/10' },
      { title: 'Choose Correct Categories', description: 'Place items in the right category and subcategory. Miscategorized items rank lower in search.', Icon: LayoutGrid, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
    ],
  },
  {
    slug: 'marketing',
    title: 'Marketing Tips',
    subtitle: 'Grow your sales and reach',
    gradient: 'from-green-500 to-emerald-600',
    HeaderIcon: TrendingUp,
    tips: [
      { title: 'Share on Social Media', description: 'Share your listings on WhatsApp, Facebook, and Instagram. Social sharing can increase views by 5x.', Icon: Share2, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
      { title: 'Use Promoted Listings', description: 'Boost your ads to appear at the top of search results. Promoted listings get 10x more visibility.', Icon: Megaphone, color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
      { title: 'Offer Discounts', description: 'Create limited-time offers to create urgency. Items with discounts sell 2x faster.', Icon: Percent, color: 'text-green-500 bg-green-50 dark:bg-green-500/10' },
      { title: 'Bundle Products', description: 'Offer package deals to increase average order value. Bundles attract buyers looking for value.', Icon: Package, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
      { title: 'Time Your Posts', description: 'Post during peak hours (6–9 PM weekdays, weekends). Timing can increase engagement by 40%.', Icon: Clock, color: 'text-teal-500 bg-teal-50 dark:bg-teal-500/10' },
      { title: 'Repost Regularly', description: 'Refresh your listings every few days. Regular updates keep your items visible and relevant.', Icon: RotateCcw, color: 'text-pink-500 bg-pink-50 dark:bg-pink-500/10' },
      { title: 'Build Your Following', description: 'Encourage buyers to follow your store. Followers get notified when you post new items.', Icon: Users, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
      { title: 'Track Performance', description: 'Monitor your listing views and messages. Use insights to optimize your selling strategy.', Icon: BarChart2, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
    ],
  },
  {
    slug: 'photography',
    title: 'Photography Tips',
    subtitle: 'Take photos that sell',
    gradient: 'from-blue-500 to-indigo-600',
    HeaderIcon: Camera,
    tips: [
      { title: 'Use Natural Light', description: 'Photograph near windows during daylight. Natural light makes colors accurate and products look professional.', Icon: Sun, color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
      { title: 'Clean Background', description: 'Use a plain white or neutral background. Cluttered backgrounds distract from your product.', Icon: Square, color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
      { title: 'Show All Angles', description: 'Take photos from front, back, sides, and top. Include at least 5 photos per listing.', Icon: Box, color: 'text-green-500 bg-green-50 dark:bg-green-500/10' },
      { title: 'Capture Details', description: 'Zoom in on important features, labels, and any defects. Transparency builds buyer trust.', Icon: ZoomIn, color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
      { title: 'Keep It Steady', description: 'Use a tripod or rest your phone on a stable surface. Blurry photos reduce buyer confidence.', Icon: Minus, color: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
      { title: 'Right Dimensions', description: 'Use square (1:1) or 4:3 ratio photos. Consistent sizing looks professional in listings.', Icon: Crop, color: 'text-teal-500 bg-teal-50 dark:bg-teal-500/10' },
      { title: 'Minimal Editing', description: 'Adjust brightness if needed, but avoid heavy filters. Photos should represent the actual item.', Icon: SlidersHorizontal, color: 'text-pink-500 bg-pink-50 dark:bg-pink-500/10' },
      { title: 'Clean Your Lens', description: 'Wipe your phone camera lens before shooting. Smudges cause blurry and hazy photos.', Icon: Smartphone, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' },
    ],
  },
];

export default function TipsPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const config = TIPS_DATA.find(t => t.slug === slug);

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-theme-muted">
        <p className="text-lg font-semibold">Tips page not found</p>
        <Link href="/" className="text-primary underline">Go home</Link>
      </div>
    );
  }

  const { title, subtitle, gradient, HeaderIcon, tips } = config;

  return (
    <div className="bg-theme min-h-screen pb-16 lg:pb-6">

      {/* ── Hero Header ── */}
      <div className={`bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-white/10" />
        <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col items-center text-center relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <HeaderIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">{title}</h1>
          <p className="text-white/80 mt-1 text-sm md:text-base">{subtitle}</p>
          <Link
            href="/"
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* ── Tips List ── */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 space-y-4">
        {tips.map((tip, i) => {
          const Icon = tip.Icon;
          return (
            <div
              key={i}
              className="bg-surface border border-theme rounded-2xl p-4 flex items-start gap-4 shadow-sm hover:shadow-card transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${tip.color.split(' ').slice(1).join(' ')}`}>
                <Icon className={`w-6 h-6 ${tip.color.split(' ')[0]}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-theme-primary text-[15px] leading-snug">{tip.title}</h3>
                <p className="text-theme-secondary text-sm mt-1 leading-relaxed">{tip.description}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
