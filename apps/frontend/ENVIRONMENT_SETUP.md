# Frontend Environment Configuration

## Environment Variables

### Development (.env.development)
```
VITE_API_URL=http://localhost:3000
```

### Production (.env.production)
```
VITE_API_URL=https://crypture-tau.vercel.app
```

### Template (.env.example)
```
# API Configuration
# Development: Uses local backend proxy
VITE_API_URL=http://localhost:3000

# Production: Uses Vercel-deployed backend proxy
# VITE_API_URL=https://crypture-tau.vercel.app
```

## Setup Instructions

1. Copy the appropriate environment file:
   ```bash
   # For development
   cp .env.development .env
   
   # For production
   cp .env.production .env
   ```

2. The frontend will automatically use the correct API URL based on the environment.

## Integration Status

✅ **T3.3 COMPLETED**: Frontend successfully integrated with production backend proxy

- Frontend uses `@crypture/api-client` library
- Environment-aware configuration via `VITE_API_URL`
- Production URL: `https://crypture-tau.vercel.app`
- All API endpoints tested and working
- SSL/TLS confirmed
- Zero API key exposure (handled by backend)

## Testing

Test the integration:
```bash
# Test production endpoint
curl https://crypture-tau.vercel.app/api/health

# Test API proxy
curl https://crypture-tau.vercel.app/api/coingecko/ping
```
