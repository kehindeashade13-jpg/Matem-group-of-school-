import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles
import ConsoleShield from '@/components/ConsoleShield';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Matem Private School & Matem College',
  description: 'Nurturing Excellence from Nursery to Secondary. The official unified website of Matem Private School and Matem College in Ikoyi, Lagos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-900">
        <ConsoleShield />
        {children}
      </body>
    </html>
  );
}
