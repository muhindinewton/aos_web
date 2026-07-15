'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  AlertTriangle,
  FileText,
  Ban,
  ShieldAlert,
  Flag,
  Tag,
  Copy,
  MoreHorizontal,
  CheckCircle,
  Info,
} from 'lucide-react';
import { products } from '../../../lib/data';

const REPORT_REASONS = [
  { icon: AlertTriangle, title: 'Counterfeit or Fake Product' },
  { icon: FileText,      title: 'Misleading or Inaccurate Description' },
  { icon: Ban,           title: 'Prohibited or Restricted Item' },
  { icon: ShieldAlert,   title: 'Suspected Scam or Fraud' },
  { icon: Flag,          title: 'Inappropriate Content' },
  { icon: Tag,           title: 'Wrong Category or Pricing' },
  { icon: Copy,          title: 'Duplicate Listing' },
  { icon: MoreHorizontal,title: 'Other' },
];

const MAX_DETAIL = 500;

export default function ReportProductPage() {
  const params = useParams();
  const productId = Array.isArray(params.id) ? params.id[0] : params.id;
  const product = products.find((p) => p.id === productId) || products[0];

  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isOther = selectedIdx === REPORT_REASONS.length - 1;
  const canSubmit = selectedIdx !== -1 && (!isOther || detail.trim().length > 0);

  const handleSubmit = () => {
    if (selectedIdx === -1) { setError('Please select a reason for reporting.'); return; }
    if (isOther && !detail.trim()) { setError('Please describe the issue in the details field.'); return; }
    setError('');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-theme flex items-center justify-center px-4">
        <div className="bg-surface border border-theme rounded-3xl p-10 max-w-sm w-full text-center shadow-soft">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-theme-primary mb-2">Report Submitted</h2>
          <p className="text-sm text-theme-muted mb-6 leading-relaxed">
            Thank you for reporting this listing. Our team will review it and take appropriate action.
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
    <div className="min-h-screen bg-theme pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href={`/product/${productId}`}
            className="p-2 rounded-xl border border-theme hover:bg-elevated transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-theme-primary" />
          </Link>
          <h1 className="text-xl font-bold text-theme-primary">Report Listing</h1>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 mb-6">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-theme-secondary leading-relaxed">
            Help us keep AOS safe. Select the reason that best describes the issue with this listing.
          </p>
        </div>

        {/* Product snapshot */}
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl px-4 py-3 mb-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Reason selection */}
        <p className="font-semibold text-theme-primary mb-3 text-sm px-1">Select a reason</p>
        <div className="bg-surface border border-theme rounded-2xl overflow-hidden mb-6">
          {REPORT_REASONS.map(({ icon: Icon, title }, idx) => {
            const isSelected = selectedIdx === idx;
            const isLast = idx === REPORT_REASONS.length - 1;
            return (
              <button
                key={title}
                onClick={() => { setSelectedIdx(idx); setError(''); }}
                className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors ${
                  isSelected ? 'bg-primary/5' : 'hover:bg-elevated'
                } ${!isLast ? 'border-b border-theme' : ''}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-theme-muted'}`} />
                <span className={`flex-1 text-sm ${isSelected ? 'font-semibold text-theme-primary' : 'text-theme-secondary'}`}>
                  {title}
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'border-primary bg-primary' : 'border-theme'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Additional detail */}
        <div className="bg-surface border border-theme rounded-2xl p-5 mb-6">
          <label className="block font-semibold text-theme-primary mb-1 text-sm">
            {isOther ? 'Please describe the issue' : 'Additional details'}{' '}
            <span className="font-normal text-theme-muted">{isOther ? '' : '(optional)'}</span>
            {isOther && <span className="text-primary"> *</span>}
          </label>
          <p className="text-xs text-theme-muted mb-3">
            Provide any information that will help us review this report.
          </p>
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value.slice(0, MAX_DETAIL))}
            placeholder="Describe the issue in detail..."
            rows={5}
            className="w-full bg-elevated border border-theme rounded-xl px-4 py-3 text-sm text-theme-primary placeholder:text-theme-muted outline-none focus:border-primary transition-colors resize-none"
          />
          <p className="text-xs text-theme-muted text-right mt-1">{detail.length}/{MAX_DETAIL}</p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-primary text-white font-semibold py-4 rounded-2xl hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          Submit Report
        </button>
      </div>
    </div>
  );
}
