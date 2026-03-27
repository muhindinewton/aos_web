'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Video, Radio, List, ChevronRight, ImagePlus, Lightbulb, DollarSign } from 'lucide-react';

export default function SellPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-theme-primary">Start Selling</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-theme rounded-lg text-sm font-medium text-theme-secondary hover:bg-elevated transition-colors">
          <List className="w-4 h-4" /> My Listings
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Camera, title: 'Post an Item', desc: 'Create a standard photo listing', color: 'bg-blue-500' },
          { icon: Video, title: 'Short Video', desc: 'Record a 60s video of your product', color: 'bg-purple-500' },
          { icon: Radio, title: 'Go Live', desc: 'Stream live to your followers', color: 'bg-red-500', badge: 'LIVE' },
        ].map((opt) => (
          <button key={opt.title} className="bg-surface border border-theme rounded-xl p-6 text-left hover:shadow-card hover:border-primary/30 transition-all group">
            <div className={`w-12 h-12 rounded-xl ${opt.color} flex items-center justify-center mb-4`}>
              <opt.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-theme-primary group-hover:text-primary transition-colors">{opt.title}</h3>
              {opt.badge && <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{opt.badge}</span>}
            </div>
            <p className="text-sm text-theme-muted">{opt.desc}</p>
          </button>
        ))}
      </div>

      <h2 className="text-lg font-bold text-theme-primary mb-4">Selling Tips</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: ImagePlus, title: 'Take Great Photos', desc: 'Use good lighting and show multiple angles' },
          { icon: Lightbulb, title: 'Clear Descriptions', desc: 'Include size, condition, and key features' },
          { icon: DollarSign, title: 'Price Competitively', desc: 'Research similar items to set fair prices' },
        ].map((tip) => (
          <div key={tip.title} className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <tip.icon className="w-5 h-5 text-primary mb-2" />
            <h4 className="font-semibold text-primary text-sm mb-1">{tip.title}</h4>
            <p className="text-xs text-theme-secondary">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
