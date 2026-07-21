import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './providers/auth-provider';
import { ThemeProvider } from './providers/theme-provider';
import { ToastProvider } from './providers/toast-provider';
import { LocationProvider } from './providers/location-provider';
import { PreferencesProvider } from './providers/preferences-provider';
import { Navbar } from './components/bottom-nav';
import { Footer } from './components/footer';
import { AppWrapper } from './components/app-wrapper';
import { OfflineBanner } from './components/offline-banner';
import { PageShell } from './components/page-shell';

export const metadata: Metadata = {
  title: 'AOS - Africa Online Space',
  description: 'Buy and sell anything in Africa',
  manifest: '/icons/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/icons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:wght@800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-theme text-theme-primary">
        <ThemeProvider>
          <LocationProvider>
          <PreferencesProvider>
          <AuthProvider>
            <ToastProvider>
              <AppWrapper>
                <OfflineBanner />
                <Navbar />
                <PageShell>{children}</PageShell>
                <div className="hidden lg:block"><Footer /></div>
              </AppWrapper>
            </ToastProvider>
          </AuthProvider>
          </PreferencesProvider>
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
