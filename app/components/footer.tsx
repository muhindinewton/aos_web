import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-theme mt-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-primary mb-3">Africa Online Space</h3>
            <p className="text-sm text-theme-muted leading-relaxed">
              Buy and sell anything across Africa. The largest marketplace for new and used items.
            </p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-elevated border border-theme flex items-center justify-center text-theme-muted hover:text-primary hover:border-primary transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-theme-primary text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Shop', href: '/shop' },
                { label: 'Categories', href: '/categories' },
                { label: 'Sell on AOS', href: '/sell' },
                { label: 'Flash Sales', href: '/shop?filter=flash' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-theme-muted hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-theme-primary text-sm mb-3">Support</h4>
            <ul className="space-y-2">
              {[
                { label: 'Help Center', href: '/help' },
                { label: 'Safety Tips', href: '/help' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Terms of Use', href: '/help' },
                { label: 'Privacy Policy', href: '/help' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-theme-muted hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-theme-primary text-sm mb-3">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-theme-muted">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2 text-sm text-theme-muted">
                <Phone className="w-4 h-4 flex-shrink-0" />+254 700 000 000
              </li>
              <li className="flex items-center gap-2 text-sm text-theme-muted">
                <Mail className="w-4 h-4 flex-shrink-0" />support@aos.africa
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-theme mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-theme-muted">&copy; {new Date().getFullYear()} Africa Online Space. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/help" className="text-xs text-theme-muted hover:text-primary">Terms</Link>
            <Link href="/help" className="text-xs text-theme-muted hover:text-primary">Privacy</Link>
            <Link href="/help" className="text-xs text-theme-muted hover:text-primary">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
