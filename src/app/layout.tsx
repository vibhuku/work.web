import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Westside Loyalty | Retail Customer Loyalty Management',
  description: 'Shop in-store, earn loyalty points, and unlock exclusive rewards with Westside Loyalty.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F8F7F4] text-[#0D0D0D] font-sans antialiased selection:bg-[#159028] selection:text-white">
        <AppProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AppProvider>
      </body>
    </html>
  );
}
