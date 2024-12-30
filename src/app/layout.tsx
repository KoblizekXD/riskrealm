import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  weight: 'variable',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Risk Realm',
  description:
    'Place your bets online and win big! Risk Realm is the best online casino and CS:GO gambling site.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
