'use client';

import React from 'react';
import Link from 'next/link';
import { Car, Smartphone, Monitor, Sofa, Shirt, Sparkles, Wrench, Baby, Cat, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { categories } from '../lib/data';

const iconMap: Record<string, React.ElementType> = {
  Vehicles: Car, Property: HomeIcon, Phones: Smartphone, Electronics: Monitor,
  Furniture: Sofa, Fashion: Shirt, Beauty: Sparkles, Services: Wrench, Kids: Baby, Pets: Cat,
};

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
      <h1 className="text-2xl font-bold text-theme-primary mb-6">All Categories</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.slice(1).map((category) => {
          const Icon = iconMap[category.name] || Wrench;
          return (
            <div key={category.id} className="bg-surface border border-theme rounded-xl p-5 hover:shadow-card transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-theme-primary">{category.name}</h2>
                  <p className="text-sm text-theme-muted">{category.subcategories.length} subcategories</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/shop?category=${category.name}`}
                    className="text-xs bg-elevated border border-theme px-3 py-1.5 rounded-full text-theme-secondary hover:text-primary hover:border-primary transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
              <Link href={`/shop?category=${category.name}`} className="mt-4 flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                Browse {category.name} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
