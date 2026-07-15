'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  Star,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Filter,
  Image as ImageIcon,
  MessageSquarePlus,
  X,
} from 'lucide-react';
import { products } from '../../lib/data';
import { useHasContactedSeller } from '../../lib/contacted-sellers';

const reviews = [
  {
    id: '1',
    name: 'Grace Wanjiku',
    date: 'Jan 22, 2026',
    title: 'Excellent product!',
    detail: 'The product was exceptional. Very high quality and exactly as described. Would definitely recommend to anyone looking for this type of item.',
    rating: 5,
    hasPhoto: true,
    helpful: 24,
    notHelpful: 0,
  },
  {
    id: '2',
    name: 'James Kamau',
    date: 'Jan 20, 2026',
    title: 'Good quality',
    detail: 'Did a great job. Arrived on time and was exactly as shown in the pictures. The pricing was fair too.',
    rating: 4,
    hasPhoto: false,
    helpful: 18,
    notHelpful: 2,
  },
  {
    id: '3',
    name: 'Mary Njeri',
    date: 'Jan 18, 2026',
    title: 'Very satisfied',
    detail: 'Item was exactly as described. Seller was prompt and professional. Highly recommended!',
    rating: 5,
    hasPhoto: true,
    helpful: 15,
    notHelpful: 0,
  },
  {
    id: '4',
    name: 'Peter Ochieng',
    date: 'Jan 15, 2026',
    title: 'Great experience',
    detail: 'The product was good but took a bit longer than expected to arrive. Overall satisfied with the purchase.',
    rating: 4,
    hasPhoto: false,
    helpful: 12,
    notHelpful: 1,
  },
  {
    id: '5',
    name: 'Sarah Akinyi',
    date: 'Jan 12, 2026',
    title: 'Decent product',
    detail: 'The product was okay. Packaging could have been better but the item itself was good.',
    rating: 3,
    hasPhoto: false,
    helpful: 8,
    notHelpful: 3,
  },
  {
    id: '6',
    name: 'David Mwangi',
    date: 'Jan 10, 2026',
    title: 'Highly recommended',
    detail: 'One of the best purchases I have made. Very good quality and the seller was responsive.',
    rating: 5,
    hasPhoto: true,
    helpful: 32,
    notHelpful: 0,
  },
  {
    id: '7',
    name: 'Jane Wambui',
    date: 'Jan 8, 2026',
    title: 'Good but pricey',
    detail: 'Quality of the product was excellent but the pricing was a bit on the higher side compared to others.',
    rating: 4,
    hasPhoto: false,
    helpful: 10,
    notHelpful: 2,
  },
  {
    id: '8',
    name: 'Michael Otieno',
    date: 'Jan 5, 2026',
    title: 'Average experience',
    detail: 'The product was okay but there were some minor issues. Could improve on quality checks.',
    rating: 3,
    hasPhoto: false,
    helpful: 5,
    notHelpful: 4,
  },
];

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={`${sizeClass} ${
            value <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
          }`}
        />
      ))}
    </div>
  );
}

function RatingBar({ rating, count, total }: { rating: number; count: number; total: number }) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-theme-muted w-3">{rating}</span>
      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
      <div className="flex-1 h-2 bg-theme rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-theme-muted w-5 text-right">{count}</span>
    </div>
  );
}

export default function AllReviewsPage() {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = products.find(p => p.id === productId);
  const sellerId = product?.seller?.id;
  const canReview = useHasContactedSeller(sellerId);

  const [selectedTab, setSelectedTab] = useState<'all' | 'newest'>('all');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

  const ratingCounts = [5, 4, 3, 2, 1].reduce((acc, rating) => {
    acc[rating] = reviews.filter((r) => r.rating === rating).length;
    return acc;
  }, {} as Record<number, number>);

  const filteredReviews = reviews
    .filter((r) => selectedRating === null || r.rating === selectedRating)
    .sort((a, b) => {
      if (selectedTab === 'newest') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.helpful - a.helpful;
    });

  return (
    <>
      <div className="min-h-screen bg-theme pb-24 lg:pb-8">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href={`/product/${params.id}`}
              className="w-10 h-10 rounded-full bg-surface border border-theme flex items-center justify-center text-theme-secondary hover:bg-elevated transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-theme-primary">Reviews ({totalReviews})</h1>
          </div>

          {/* Rating Summary Card */}
          <div className="bg-surface rounded-2xl border border-theme p-5 mb-5 shadow-soft">
            <div className="flex gap-6">
              {/* Average Rating */}
              <div className="flex flex-col items-center justify-center pr-6 border-r border-theme">
                <span className="text-5xl font-bold text-theme-primary">{averageRating.toFixed(1)}</span>
                <div className="mt-2">
                  <StarRating rating={Math.round(averageRating)} size="md" />
                </div>
                <span className="text-sm text-theme-muted mt-1">{totalReviews} reviews</span>
              </div>

              {/* Rating Bars */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <RatingBar
                    key={rating}
                    rating={rating}
                    count={ratingCounts[rating]}
                    total={totalReviews}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => setSelectedTab('all')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium border transition-colors ${
                selectedTab === 'all'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-theme text-theme-secondary hover:border-theme-secondary'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setSelectedTab('newest')}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium border transition-colors ${
                selectedTab === 'newest'
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-theme text-theme-secondary hover:border-theme-secondary'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-medium border transition-colors flex items-center justify-center gap-1.5 ${
                selectedRating !== null
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-surface border-theme text-theme-secondary hover:border-theme-secondary'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Active Filter Badge */}
          {selectedRating !== null && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-theme-muted">Filtered by:</span>
              <button
                onClick={() => setSelectedRating(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full"
              >
                {selectedRating} Star
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquarePlus className="w-16 h-16 text-theme-muted mx-auto mb-4" />
              <p className="text-lg font-medium text-theme-muted">No reviews found</p>
              <p className="text-sm text-theme-muted mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-surface rounded-2xl border border-theme p-5 shadow-soft"
                >
                  {/* Review Header */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-semibold text-primary">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-theme-primary">{review.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-theme-muted">{review.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mt-3">
                    <h4 className="font-semibold text-theme-primary">{review.title}</h4>
                    <p className="text-sm text-theme-secondary mt-1.5 leading-relaxed">
                      {review.detail}
                    </p>
                  </div>

                  {/* Review Photo */}
                  {review.hasPhoto && (
                    <div className="mt-3">
                      <div className="w-24 h-24 rounded-xl bg-elevated border border-theme flex items-center justify-center overflow-hidden">
                        <img
                          src={`https://picsum.photos/seed/review${review.id}/200/200`}
                          alt="Review"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Helpful Section */}
                  <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-theme">
                    <span className="text-sm text-theme-muted">Helpful?</span>
                    <button className="flex items-center gap-1.5 text-theme-muted hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">({review.helpful})</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-theme-muted hover:text-primary transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">({review.notHelpful})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom CTA — gated on having contacted the seller */}
      {canReview && (
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-theme p-4 md:hidden">
          <Link
            href={`/reviews/${productId}/write`}
            className="w-full bg-primary hover:bg-primary-hover text-white py-3.5 rounded-full font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Write a Review
          </Link>
        </div>
      )}

      {/* Desktop Write Review Button — gated on having contacted the seller */}
      {canReview && (
        <div className="hidden md:block fixed bottom-8 right-8">
          <Link
            href={`/reviews/${productId}/write`}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <MessageSquarePlus className="w-5 h-5" />
            Write a Review
          </Link>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilterModal(false)} />
          <div className="relative bg-surface rounded-t-3xl md:rounded-3xl w-full max-w-md p-6 animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="w-6" />
              <h2 className="text-lg font-bold text-theme-primary">Filter by Rating</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center text-theme-secondary hover:text-theme-primary transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rating Options */}
            <div className="grid grid-cols-2 gap-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => {
                    setSelectedRating(rating);
                    setShowFilterModal(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                    selectedRating === rating
                      ? 'bg-primary/10 border-primary'
                      : 'bg-elevated border-theme hover:border-theme-secondary'
                  }`}
                >
                  <StarRating rating={rating} />
                  <span className="text-sm font-medium text-theme-primary">{rating} Star</span>
                </button>
              ))}
            </div>

            {/* Clear Filter */}
            {selectedRating !== null && (
              <button
                onClick={() => {
                  setSelectedRating(null);
                  setShowFilterModal(false);
                }}
                className="w-full mt-4 py-3 text-primary font-medium hover:bg-primary/5 rounded-xl transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
