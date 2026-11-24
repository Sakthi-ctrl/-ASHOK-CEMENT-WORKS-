import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ashok Cement Works – Smart Invoice Generator',
  description:
    'Smart mobile-first invoice generator for Ashok Cement Works - Readymade Compound Wall. Enter measurements, calculate square feet and amounts, customize optional charges, and download high-resolution A4 invoices.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ashok Cement',
  },
  icons: {
    icon: [
      { url: '/brand-logo.png', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/brand-logo.png' }],
  },
};

export const viewport: Viewport = {
  themeColor: '#0866B5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/logo.svg" type="image/svg+xml" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-[#F5F8FC] text-[#14233B]">
        {children}
      </body>
    </html>
  );
}
