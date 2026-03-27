'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, HelpCircle, Shield, FileText, MessageCircle, Phone, Mail, BookOpen, AlertTriangle } from 'lucide-react';

const helpSections = [
  { icon: BookOpen, title: 'Getting Started', description: 'Learn the basics of buying and selling on AOS', items: ['How to create an account', 'Posting your first ad', 'Making a purchase', 'Payment methods'] },
  { icon: Shield, title: 'Safety Tips', description: 'Stay safe while buying and selling', items: ['Meet in public places', 'Verify items before paying', 'Use AOS secure payment', 'Report suspicious listings'] },
  { icon: FileText, title: 'Policies', description: 'Our terms, privacy and community guidelines', items: ['Terms of Service', 'Privacy Policy', 'Community Guidelines', 'Prohibited Items'] },
  { icon: AlertTriangle, title: 'Report an Issue', description: 'Let us know about problems or concerns', items: ['Report a scam', 'Report a fake listing', 'Account issues', 'Technical problems'] },
];

const faqs = [
  { q: 'How do I post an ad?', a: 'Tap the Sell button, choose your category, add photos and details, then publish your listing. It\'s free to post!' },
  { q: 'Is it safe to buy on AOS?', a: 'We recommend meeting in public places, verifying items before payment, and using our secure payment when available.' },
  { q: 'How do I contact a seller?', a: 'Click the "Chat Seller" button on any product page to start a conversation.' },
  { q: 'Can I edit my listing?', a: 'Yes, go to Account > My Listings, find the listing and tap Edit.' },
  { q: 'How do I delete my account?', a: 'Go to Account > Settings > Delete Account. This action is permanent.' },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6">
      <Link href="/account" className="inline-flex items-center gap-1 text-sm text-theme-muted hover:text-primary mb-4">
        <ChevronLeft className="w-4 h-4" /> Back to Account
      </Link>

      <h1 className="text-2xl font-bold text-theme-primary mb-1">Help & Support</h1>
      <p className="text-sm text-theme-muted mb-6">Find answers or contact our support team</p>

      {/* Contact Cards */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {[
          { icon: MessageCircle, title: 'Live Chat', desc: 'Chat with support', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
          { icon: Phone, title: 'Call Us', desc: '+254 700 000 000', color: 'text-green-500 bg-green-50 dark:bg-green-500/10' },
          { icon: Mail, title: 'Email', desc: 'support@aos.africa', color: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
        ].map((item) => (
          <button key={item.title} className="bg-surface border border-theme rounded-xl p-4 text-left hover:shadow-card transition-shadow">
            <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm text-theme-primary">{item.title}</h3>
            <p className="text-xs text-theme-muted mt-0.5">{item.desc}</p>
          </button>
        ))}
      </div>

      {/* Help Sections */}
      <h2 className="font-bold text-theme-primary mb-3">Help Topics</h2>
      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {helpSections.map((section) => (
          <div key={section.title} className="bg-surface border border-theme rounded-xl p-4 hover:shadow-card transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-theme-primary">{section.title}</h3>
                <p className="text-[11px] text-theme-muted">{section.description}</p>
              </div>
            </div>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item} className="flex items-center justify-between text-sm text-theme-secondary hover:text-primary cursor-pointer py-1">
                  {item} <ChevronRight className="w-3.5 h-3.5 text-theme-muted" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <h2 className="font-bold text-theme-primary mb-3">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <details key={i} className="bg-surface border border-theme rounded-xl group">
            <summary className="p-4 cursor-pointer font-medium text-sm text-theme-primary flex items-center justify-between list-none">
              {faq.q}
              <ChevronRight className="w-4 h-4 text-theme-muted group-open:rotate-90 transition-transform" />
            </summary>
            <div className="px-4 pb-4 text-sm text-theme-secondary leading-relaxed">{faq.a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
