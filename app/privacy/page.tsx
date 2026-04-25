'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const sections = [
  {
    heading: '1. Information We Collect',
    content:
      'We collect information you provide directly, such as your name, email address, phone number, and payment details. We also collect usage data, device information, and location data to improve our services and personalize your experience.',
  },
  {
    heading: '2. How We Use Your Information',
    content:
      'We use your information to operate and improve the AOS platform, process transactions, communicate with you, and provide customer support. We may also use your data to send promotional offers and updates, which you can opt out of at any time.',
  },
  {
    heading: '3. Data Sharing and Disclosure',
    content:
      'We do not sell your personal information to third parties. We may share your information with trusted service providers who assist in operating our platform, subject to strict confidentiality agreements. We may disclose information when required by law.',
  },
  {
    heading: '4. Data Security',
    content:
      'We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and protect your account credentials.',
  },
  {
    heading: '5. Your Rights',
    content:
      'You have the right to access, correct, or delete your personal information at any time. You may also request that we restrict the processing of your data. To exercise these rights, contact our support team or visit your account settings.',
  },
  {
    heading: '6. Cookies',
    content:
      'We use cookies and similar tracking technologies to enhance your experience on the AOS platform. You can control cookie settings through your browser. Disabling cookies may affect some features of the platform.',
  },
  {
    heading: '7. Contact Us',
    content:
      'If you have any questions about this Privacy Policy or how we handle your data, please contact our Privacy Team at privacy@aosmarketplace.com or visit our Help Centre.',
  },
];

export default function PrivacyPage() {
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
          Privacy &amp; Policy
        </h1>
        <div className="w-11" />
      </div>

      {/* Intro */}
      <p className="text-sm text-theme-muted leading-relaxed mb-7">
        At AOS, we value your privacy and are committed to protecting your personal information.
        This Privacy Policy explains how we collect, use, and protect your data when you use our
        platform. By accessing or using AOS, you agree to the practices described in this policy.
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
