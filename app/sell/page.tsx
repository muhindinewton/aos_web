'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, ImagePlus, Radio, List, ChevronRight } from 'lucide-react';

export default function SellPage() {
  const sellingOptions = [
    { 
      icon: Camera, 
      title: 'Post an Item', 
      desc: 'Create a standard photo listing.', 
      iconBg: 'bg-elevated', 
      iconColor: 'text-theme-primary',
      href: '/sell/post' 
    },
    { 
      icon: ImagePlus, 
      title: 'Create a Post', 
      desc: 'Share shorts or go live with your audience.', 
      iconBg: 'bg-primary/10', 
      iconColor: 'text-primary',
      href: '/sell/video' 
    },
    { 
      icon: Radio, 
      title: 'Go Live', 
      desc: 'Stream live and sell in real-time.', 
      iconBg: 'bg-red-500/10', 
      iconColor: 'text-red-500',
      href: '/sell/live' 
    },
  ];

  return (
    <div className="min-h-screen bg-theme">
      <div className="max-w-xl mx-auto px-5 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-theme-primary">Start Selling</h1>
          <Link 
            href="/sell/listings"
            className="flex items-center gap-2 px-4 py-2 bg-surface border border-theme rounded-full text-sm font-medium text-theme-primary hover:bg-elevated transition-colors"
          >
            <List className="w-4 h-4" />
            My Listings
          </Link>
        </div>

        {/* Selling Options - horizontal card layout matching mobile app */}
        <div className="flex flex-col gap-4">
          {sellingOptions.map((opt) => (
            <Link 
              key={opt.title} 
              href={opt.href}
              className="flex items-center gap-4 bg-surface border border-theme rounded-2xl p-5 hover:shadow-lg transition-all group"
            >
              {/* Icon */}
              <div className={`w-[52px] h-[52px] rounded-xl ${opt.iconBg} flex items-center justify-center flex-shrink-0`}>
                <opt.icon className={`w-6 h-6 ${opt.iconColor}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-[17px] font-semibold text-theme-primary group-hover:text-primary transition-colors">
                  {opt.title}
                </h3>
                <p className="text-[13px] text-theme-muted mt-1">{opt.desc}</p>
              </div>
              
              {/* Chevron */}
              <ChevronRight className="w-5 h-5 text-theme-muted flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
