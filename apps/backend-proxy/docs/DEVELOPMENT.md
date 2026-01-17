# Development Environment Guide

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Start with debugging
npm run dev:debug

# Start with verbose logging
npm run dev:verbose
```

### Container Development
```bash
# Start development container
npm run container:up:dev

# View container logs
npm run container:logs:dev

# Execute into container
npm run container:exec:dev
```

## 🔧 Development Features

### Hot Reloading
- **Automatic restart** on file changes
- **TypeScript compilation** on the fly
- **Configuration:** `nodemon.json`
- **Watch files:** `src/**/*.ts`
- **Ignored files:** `src/**/*.test.ts`, `src/**/*.spec.ts`

### Enhanced Logging
- **Request ID tracking** for request correlation
- **Duration tracking** for performance monitoring
- **API request details** in development mode
- **CORS request logging**
- **Error tracking** with stack traces

### CORS Configuration
- **Development:** Permissive (allows all origins)
- **Production:** Strict (whitelist origins)
- **Health endpoints:** Always accessible
- **API endpoints:** Environment-aware

## 📝 Environment Configuration

### Development Environment (`.env.development`)
```bash
NODE_ENV=development
PORT=3000
HOST=localhost
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
HOT_RELOAD=true
DEBUG_MODE=true
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Environment mode |
| `PORT` | `3000` | Server port |
| `HOST` | `localhost` | Server host |
| `CORS_ORIGIN` | `http://localhost:5173` | Frontend origin |
| `LOG_LEVEL` | `info` | Logging level |
| `HOT_RELOAD` | `true` | Enable hot reload |

## 🛠️ Development Scripts

### Core Scripts
```bash
npm run dev              # Start development server
npm run dev:debug        # Start with debugging enabled
npm run dev:verbose      # Start with verbose logging
npm run dev:clean        # Clean build and start dev
npm run dev:build        # Build and start dev
```

### Testing Scripts
```bash
npm run dev:test         # Run unit tests in watch mode
npm run dev:lint         # Run linting in watch mode
npm run test             # Run all tests
npm run test:unit        # Run unit tests only
```

### Logging Scripts
```bash
npm run logs:dev         # Tail development logs
npm run logs:app         # View application logs
```

### Environment Scripts
```bash
npm run start:dev        # Start in development mode
npm run start:prod       # Start in production mode
```

## 🔍 Debugging

### VS Code Debugging
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Backend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/main.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "protocol": "inspector"
    }
  ]
}
```

### Chrome DevTools Debugging
```bash
# Start with debugging enabled
npm run dev:debug

# Open Chrome DevTools
# Navigate to chrome://inspect
# Click "Open dedicated DevTools for Node"
```

## 📊 Logging Examples

### Development Mode Output
```
🚀 [lxzz8mbq11] GET /api/health - Request started
🔍 [lxzz8mbq11] 2026-01-17T14:53:58.908Z - API Request:
   Method: GET
   URL: /health
   Headers: {"host": "localhost:3000", "user-agent": "curl/8.7.1"}
📝 GET /api/health 200 265 - 1.640 ms (3ms total) [lxzz8mbq11]
✅ [lxzz8mbq11] GET /api/health - 200 (3ms)
```

### Production Mode Output
```
::1 - - [17/Jan/2026:14:53:58 +0000] "GET /api/health HTTP/1.1" 200 265
```

## 🌐 CORS Testing

### Test CORS Headers
```bash
# Test preflight request
curl -X OPTIONS http://localhost:3000/api/health \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test actual request
curl http://localhost:3000/api/health \
  -H "Origin: http://localhost:5173" \
  -v
```

### Expected CORS Headers
```http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
```

## 🔧 Hot Reload Configuration

### Nodemon Configuration (`nodemon.json`)
```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "ignore": ["src/**/*.spec.ts", "src/**/*.test.ts"],
  "exec": "ts-node src/main.ts",
  "env": {
    "NODE_ENV": "development",
    "PORT": "3000",
    "HOST": "localhost",
    "CORS_ORIGIN": "http://localhost:5173",
    "LOG_LEVEL": "debug"
  },
  "delay": "1000",
  "restartable": "rs"
}
```

### Hot Reload Events
- **Start:** Server starting message
- **Restart:** Server restarting message  
- **Crash:** Server crash detection and restart

## 🚨 Troubleshooting

### Common Issues

#### Hot Reload Not Working
```bash
# Check nodemon configuration
cat nodemon.json

# Restart development server
npm run dev:clean

# Check file permissions
ls -la src/
```

#### CORS Issues
```bash
# Check CORS origin
echo $CORS_ORIGIN

# Check environment mode
echo $NODE_ENV

# Test with different origin
curl -H "Origin: http://localhost:8080" http://localhost:3000/api/health
```

#### Logging Issues
```bash
# Check log level
echo $LOG_LEVEL

# Enable verbose logging
npm run dev:verbose

# Check environment variables
npm run dev:debug
```

### Port Conflicts
```bash
# Check port usage
lsof -i :3000

# Kill process on port
kill -9 $(lsof -t -i :3000)

# Use different port
PORT=3001 npm run dev
```

## 📱 Development Workflow

### 1. Setup
```bash
# Clone repository
git clone <repository-url>
cd crypture/apps/backend-proxy

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.development

# Start development server
npm run dev
```

### 2. Development
```bash
# Make changes to source code
# Hot reload automatically restarts server

# Run tests
npm run dev:test

# Check logs
npm run logs:dev

# Test endpoints
curl http://localhost:3000/api/health
```

### 3. Debugging
```bash
# Start with debugging
npm run dev:debug

# Or use VS Code debugger
# Set breakpoints in VS Code
# Start debugging session
```

### 4. Before Commit
```bash
# Run tests
npm test

# Check types
npm run typecheck

# Lint code
npm run lint

# Build project
npm run build
```

## 🎯 Best Practices

### Development
- **Use environment files** for configuration
- **Enable hot reload** for faster development
- **Use debugging tools** for troubleshooting
- **Test CORS** with different origins
- **Monitor logs** for request tracking

### Code Quality
- **Run tests** before committing
- **Check TypeScript** compilation
- **Lint code** for consistency
- **Use meaningful** commit messages
- **Document changes** in README

### Performance
- **Monitor request duration** in logs
- **Use request IDs** for tracking
- **Optimize logging** for production
- **Test with different** load levels
