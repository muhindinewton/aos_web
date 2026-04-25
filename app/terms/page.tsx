'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const sections = [
  {
    heading: '1. Acceptance of Terms',
    content:
      'By accessing or using AOS (Africa Online Stores), you agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our platform. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.',
  },
  {
    heading: '2. Use of the Platform',
    content:
      'AOS provides a marketplace for buyers and sellers across Africa. You agree to use the platform only for lawful purposes and in accordance with these terms. You must not use the platform in any way that is unlawful, harmful, fraudulent, or deceptive.',
  },
  {
    heading: '3. User Accounts',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate our policies.',
  },
  {
    heading: '4. Listings and Transactions',
    content:
      'Sellers are responsible for the accuracy of their listings. AOS does not guarantee the quality, safety, or legality of items listed. Buyers are encouraged to review seller ratings and verify item details before completing transactions.',
  },
  {
    heading: '5. Intellectual Property',
    content:
      'All content on AOS, including logos, text, graphics, and software, is the property of AOS or its licensors. You may not reproduce, distribute, or create derivative works without our prior written consent.',
  },
  {
    heading: '6. Limitation of Liability',
    content:
      'AOS shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount paid by you for the specific transaction giving rise to the claim.',
  },
  {
    heading: '7. Contact Us',
    content:
      'If you have any questions about these Terms & Conditions, please contact us at support@aosmarketplace.com or visit our Help Centre for assistance.',
  },
];

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-11 h-11 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">
          Terms &amp; Conditions
        </h1>
        <div className="w-11" />
      </div>

      {/* Intro */}
      <p className="text-sm text-theme-muted leading-relaxed mb-7">
        At AOS (Africa Online Stores), we are committed to providing a safe and transparent
        marketplace. These Terms &amp; Conditions explain your rights and obligations when using our
        platform. By accessing or using AOS, you agree to the practices described in this document.
      </p>

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((s) => (
          <div key={s.heading}>
            <h2 className="text-sm font-semibold text-theme-primary mb-2">{s.heading}</h2>
            <p className="text-sm text-theme-muted leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
      <div className="h-16" />
    </div>
  );
}
