import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ATM Executive Dashboard',
  description: 'Premium dashboard for ATM and Branch monitoring',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
