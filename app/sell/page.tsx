'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Video, Radio, List, ChevronRight, ImagePlus, Lightbulb, DollarSign, TrendingUp, ShieldCheck, Clock } from 'lucide-react';

export default function SellPage() {
  const sellingOptions = [
    { icon: Camera, title: 'Post an Item', desc: 'Create a standard photo listing', color: 'bg-blue-500', href: '/sell/post' },
    { icon: Video, title: 'Short Video', desc: 'Record a 60s video of your product', color: 'bg-purple-500', href: '/feed' },
    { icon: Radio, title: 'Go Live', desc: 'Stream live to your followers', color: 'bg-red-500', badge: 'LIVE', href: '/feed' },
  ];

  const sellingTips = [
    { icon: ImagePlus, title: 'Take Great Photos', desc: 'Use good lighting and show multiple angles' },
    { icon: Lightbulb, title: 'Clear Descriptions', desc: 'Include size, condition, and key features' },
    { icon: DollarSign, title: 'Price Competitively', desc: 'Research similar items to set fair prices' },
  ];

  const benefits = [
    { icon: TrendingUp, title: 'Reach Millions', desc: 'Access buyers across Africa' },
    { icon: ShieldCheck, title: 'Secure Platform', desc: 'Safe and verified transactions' },
    { icon: Clock, title: 'Quick Listing', desc: 'Post your ad in under 5 minutes' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-theme-primary">Start Selling</h1>
          <p className="text-sm text-theme-muted mt-1">Turn your items into cash today</p>
        </div>
        <Link 
          href="/sell/listings"
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-theme rounded-lg text-sm font-medium text-theme-secondary hover:bg-elevated hover:text-theme-primary transition-colors"
        >
          <List className="w-4 h-4" /> My Listings
        </Link>
      </div>

      {/* Selling Options */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {sellingOptions.map((opt) => (
          <Link 
            key={opt.title} 
            href={opt.href}
            className="bg-surface border border-theme rounded-xl p-6 text-left hover:shadow-card hover:border-primary/30 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl ${opt.color} flex items-center justify-center mb-4`}>
              <opt.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-theme-primary group-hover:text-primary transition-colors">{opt.title}</h3>
              {opt.badge && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full animate-pulse">{opt.badge}</span>}
            </div>
            <p className="text-sm text-theme-muted">{opt.desc}</p>
            <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Get Started <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Why Sell on AOS */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-theme-primary mb-4">Why Sell on AOS?</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-theme-primary text-sm">{benefit.title}</h4>
                <p className="text-xs text-theme-secondary mt-0.5">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selling Tips */}
      <h2 className="text-lg font-bold text-theme-primary mb-4">Selling Tips</h2>
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {sellingTips.map((tip) => (
          <div key={tip.title} className="bg-surface border border-theme rounded-xl p-4 hover:shadow-sm transition-shadow">
            <tip.icon className="w-5 h-5 text-primary mb-2" />
            <h4 className="font-semibold text-theme-primary text-sm mb-1">{tip.title}</h4>
            <p className="text-xs text-theme-secondary">{tip.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center py-8 bg-surface border border-theme rounded-2xl">
        <h3 className="text-xl font-bold text-theme-primary mb-2">Ready to sell?</h3>
        <p className="text-theme-secondary mb-4">Create your first listing in just a few minutes</p>
        <Link
          href="/sell/post"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-hover transition-colors"
        >
          <Camera className="w-5 h-5" />
          Post Your First Ad
        </Link>
      </div>
    </div>
  );
}
