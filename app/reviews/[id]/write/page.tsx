'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Star, Image as ImageIcon, X, CheckCircle } from 'lucide-react';
import { products } from '../../../lib/data';

export default function WriteReviewPage() {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = products.find((p) => p.id === productId) || products[0];

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const MAX = 200;
  const canSubmit = rating > 0 && detail.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center px-4">
        <div className="bg-surface border border-theme rounded-3xl p-10 max-w-sm w-full text-center shadow-soft">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-theme-primary mb-2">Review Submitted!</h2>
          <p className="text-sm text-theme-muted mb-6 leading-relaxed">
            Thank you for your feedback. Your review helps other buyers make informed decisions.
          </p>
          <Link
            href={`/product/${productId}`}
            className="block w-full bg-primary text-white text-sm font-semibold py-3 rounded-2xl hover:bg-primary-hover transition-colors"
          >
            Back to Product
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/reviews/${productId}`}
            className="p-2 rounded-xl border border-theme hover:bg-elevated transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-theme-primary" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-theme-primary">Write a Review</h1>
            <p className="text-xs text-theme-muted truncate max-w-xs">{product.title}</p>
          </div>
        </div>

        {/* Product Snapshot */}
        <div className="bg-surface border border-theme rounded-2xl p-4 flex items-center gap-3 mb-6">
          <img
            src={`https://picsum.photos/seed/p${product.id}-0/80/80`}
            alt={product.title}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-theme-primary truncate">{product.title}</p>
            <p className="text-xs text-theme-muted">{product.category} · {product.location}</p>
          </div>
        </div>

        {/* Overall Rating */}
        <div className="bg-surface border border-theme rounded-2xl p-5 mb-4">
          <p className="font-semibold text-theme-primary mb-1">Overall Rating <span className="text-primary">*</span></p>
          <p className="text-xs text-theme-muted mb-4">Tap a star to rate this product</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    star <= (hovered || rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm font-semibold text-theme-primary">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </span>
            )}
          </div>
        </div>

        {/* Review Title */}
        <div className="bg-surface border border-theme rounded-2xl p-5 mb-4">
          <label className="block font-semibold text-theme-primary mb-3 text-sm">
            Review Title <span className="text-theme-muted font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarise your experience in a line..."
            maxLength={80}
            className="w-full bg-elevated border border-theme rounded-xl px-4 py-3 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Review Detail */}
        <div className="bg-surface border border-theme rounded-2xl p-5 mb-4">
          <label className="block font-semibold text-theme-primary mb-3 text-sm">
            Your Review <span className="text-primary">*</span>
          </label>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value.slice(0, MAX))}
            placeholder="Describe your experience with this product — condition, accuracy of description, seller communication, etc."
            rows={5}
            className="w-full bg-elevated border border-theme rounded-xl px-4 py-3 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary transition-colors resize-none"
          />
          <p className="text-xs text-theme-muted text-right mt-1">{detail.length}/{MAX}</p>
        </div>

        {/* Add Photo */}
        <div className="bg-surface border border-theme rounded-2xl p-5 mb-6">
          <p className="font-semibold text-theme-primary mb-1 text-sm">Add Photo <span className="text-theme-muted font-normal">(optional)</span></p>
          <p className="text-xs text-theme-muted mb-4">Share a photo to help other buyers</p>
          {photo ? (
            <div className="relative inline-block">
              <img src={photo} alt="Review attachment" className="w-32 h-32 object-cover rounded-xl border border-theme" />
              <button
                onClick={() => setPhoto(null)}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-theme hover:border-primary hover:bg-primary/5 transition-colors text-sm text-theme-secondary cursor-pointer">
              <ImageIcon className="w-5 h-5 text-primary" />
              Choose from gallery
              <input type="file" accept="image/*" className="sr-only" onChange={handlePhoto} />
            </label>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-primary text-white font-semibold py-4 rounded-2xl hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
