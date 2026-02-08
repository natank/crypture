import React from 'react';
import { MarketOverview } from '@components/MarketOverview';
import PortfolioHeader from '@components/PortfolioHeader';
import { Footer } from '@components/Layout/Footer';

export const MarketPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PortfolioHeader className="flex items-center justify-between mb-4" />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <MarketOverview />
        </div>
      </main>
      <Footer />
    </div>
  );
};
