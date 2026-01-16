import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from 'react-hot-toast';

interface LandingLayoutProps {
  children: ReactNode;
  className?: string;
}

export function LandingLayout({
  children,
  className = '',
}: LandingLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
}

export default LandingLayout;
