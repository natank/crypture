# CoinGecko API Key Setup

## Problem

Some CoinGecko API endpoints require a Pro API key:

- ✅ `/coins/markets` - Free tier (works)
- ❌ `/coins/{id}/market_chart` - Pro tier (requires API key)

## Solution Options

### Option 1: Get a CoinGecko Pro API Key (Recommended)

1. **Sign up for CoinGecko Pro**: https://www.coingecko.com/en/api/pricing
2. **Choose a plan**:
   - **Free Plan**: 10-50 requests/minute, limited endpoints
   - **Starter Plan** ($79/month): 100 requests/minute, all endpoints
   - **Grow Plan** ($149/month): 500 requests/minute, all endpoints
   - **Enterprise Plan** ($499/month): 2,000 requests/minute, all endpoints

3. **Get your API key** from the CoinGecko dashboard

4. **Add API key to Vercel**:
   - Go to your Vercel project settings
   - Add environment variable: `COINGECKO_API_KEY`
   - Value: Your CoinGecko API key
   - Redeploy the application

### Option 2: Use Free Tier Only (Limited Functionality)

Modify the frontend to avoid endpoints that require API keys:

- Use `/coins/markets` for basic market data ✅
- Use `/simple/price` for current prices ✅
- Avoid `/coins/{id}/market_chart` ❌
- Avoid detailed coin data ❌

### Option 3: Mock Market Chart Data (Development)

For development, you can mock the market chart data:

```typescript
// In the frontend service
const getMarketChart = async (id: string, days: number) => {
  if (process.env.NODE_ENV === 'development') {
    return mockMarketChartData;
  }
  // Real API call for production
  return api.get(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
};
```

## Testing

After adding the API key:

```bash
# Test the failing endpoint
curl "https://crypture-tau.vercel.app/api/coingecko/coins/bitcoin/market_chart?vs_currency=usd&days=1"

# Should return data instead of 401 Unauthorized
```

## Rate Limits

- **Free**: 10-50 requests/minute
- **Starter**: 100 requests/minute
- **Grow**: 500 requests/minute
- **Enterprise**: 2,000 requests/minute

## Cost Considerations

For a portfolio tracking app:

- **Starter Plan** ($79/month) should be sufficient for moderate usage
- Consider implementing client-side caching to reduce API calls
- Monitor usage to avoid rate limits
