# Netlify Deployment Configuration

This project uses a single `netlify.toml` file to deploy two separate apps (frontend and investor-presentation) to different Netlify sites using environment variables.

## Setup Instructions

### 1. Create Two Netlify Sites

Create separate Netlify sites for each app:
- **Frontend Site**: For the main Crypture application
- **Investor Presentation Site**: For the investor presentation page

### 2. Configure Environment Variables

In each Netlify site's **Site settings → Build & deploy → Environment variables**, add:

#### Frontend Site
```
DEPLOY_TARGET=frontend
```

#### Investor Presentation Site
```
DEPLOY_TARGET=investor-presentation
```

### 3. Build Settings

Both sites use the same build settings (configured in `netlify.toml`):

| Setting | Value |
|---------|-------|
| Base directory | `/` |
| Build command | `npm ci && npx nx build ${DEPLOY_TARGET} --configuration=ci` |
| Publish directory | `dist/apps/${DEPLOY_TARGET}` |

The `${DEPLOY_TARGET}` variable is replaced at build time based on the environment variable you set.

## How It Works

The `netlify.toml` uses variable substitution:

```toml
[build]
  publish = "dist/apps/${DEPLOY_TARGET}"
  command = "npm ci && npx nx build ${DEPLOY_TARGET} --configuration=ci"
```

- When `DEPLOY_TARGET=frontend` → builds and publishes `apps/frontend`
- When `DEPLOY_TARGET=investor-presentation` → builds and publishes `apps/investor-presentation`

## Deploy Previews

For pull requests, the build command detects which app has changed files:
- If `apps/investor-presentation/` files changed → builds investor-presentation
- If `apps/frontend/` files changed → builds frontend
- Otherwise → falls back to `DEPLOY_TARGET` or defaults to `frontend`

## Troubleshooting

**Issue**: Site shows wrong app
- **Solution**: Verify `DEPLOY_TARGET` environment variable is set correctly in Netlify site settings

**Issue**: Build fails with "undefined" in path
- **Solution**: Ensure `DEPLOY_TARGET` environment variable is set before building

## File Locations

| App | Source | Build Output |
|-----|--------|--------------|
| Frontend | `apps/frontend/` | `dist/apps/frontend/` |
| Investor Presentation | `apps/investor-presentation/` | `dist/apps/investor-presentation/` |
