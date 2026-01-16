export const formatLargeNumber = (num: number): string => {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e12) return `${sign}$${(absNum / 1e12).toFixed(2)}T`;
  if (absNum >= 1e9) return `${sign}$${(absNum / 1e9).toFixed(2)}B`;
  if (absNum >= 1e6) return `${sign}$${(absNum / 1e6).toFixed(2)}M`;
  if (absNum >= 1e3) return `${sign}$${(absNum / 1e3).toFixed(2)}K`;
  return `${sign}$${absNum.toFixed(2)}`;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
};

export const formatPercentage = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return '0.00%';
  return `${num.toFixed(2)}%`;
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};
