import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PersonaChat - AI Companion Platform',
  description: 'Chat with 22+ unique AI characters',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
