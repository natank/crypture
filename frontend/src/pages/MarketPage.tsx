import React from 'react';
import { MarketOverview } from '../components/MarketOverview';
import PortfolioHeader from '../components/PortfolioHeader';

export const MarketPage: React.FC = () => {
    return (
        <>
            <PortfolioHeader className="flex items-center justify-between mb-4" />
            <div className="container mx-auto px-4 py-8">
                <MarketOverview />
            </div>
        </>
    );
};
