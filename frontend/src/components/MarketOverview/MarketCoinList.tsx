import React from 'react';
import { MarketCoin } from '../../types/market';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface MarketCoinListProps {
    coins: MarketCoin[];
    isLoading: boolean;
}

export const MarketCoinList: React.FC<MarketCoinListProps> = ({ coins, isLoading }) => {
    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg" />
                ))}
            </div>
        );
    }

    if (coins.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No coins found for this category.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Coin
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            24h %
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Market Cap
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {coins.map((coin) => (
                        <tr key={coin.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {coin.market_cap_rank}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img className="h-8 w-8 rounded-full" src={coin.image} alt={coin.name} />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{coin.name}</div>
                                        <div className="text-sm text-gray-500 uppercase">{coin.symbol}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                {formatCurrency(coin.current_price)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {formatPercentage(coin.price_change_percentage_24h)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right hidden sm:table-cell">
                                {formatCurrency(coin.market_cap)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
