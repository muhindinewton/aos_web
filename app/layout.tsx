import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './providers/auth-provider';
import { ThemeProvider } from './providers/theme-provider';
import { Navbar } from './components/bottom-nav';
import { Footer } from './components/footer';

export const metadata: Metadata = {
  title: 'AOS - Africa Online Stores',
  description: 'Buy and sell anything in Africa',
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
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-theme text-theme-primary">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="pb-20 md:pb-0">{children}</main>
            <div className="hidden md:block"><Footer /></div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
