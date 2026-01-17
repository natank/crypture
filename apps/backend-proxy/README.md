# Crypture Backend Proxy Service

Containerized Node.js/Express.js backend service for the Crypture application.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### Container Development

#### Using Podman (Primary)
```bash
# Build container
npm run container:build

# Run container
npm run container:run

# Or use compose for full setup
npm run container:up
```

#### Using Docker (Alternative)
```bash
# If Docker is available, scripts will work with Docker CLI
# All container scripts use Podman commands but are Docker-compatible
```

#### Development with Hot Reload
```bash
# Build development container
npm run container:build:dev

# Run with hot reload
npm run container:up:dev

# View logs
npm run container:logs:dev
```

## 🐳 Container Configuration

### Production Container
- **Base Image:** `node:20-alpine`
- **User:** Non-root user (nodejs:1001)
- **Port:** 3000
- **Health Check:** `/api/health` endpoint

### Development Container
- **Base Image:** `node:20-alpine`
- **Hot Reload:** Nodemon for development
- **Volume Mounts:** Source code mounted
- **Debug Mode:** Enabled

## 📋 Available Scripts

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server

### Testing
- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:coverage` - Run tests with coverage

### Container Management (Podman)
- `npm run container:build` - Build production container with Podman
- `npm run container:build:dev` - Build development container with Podman
- `npm run container:up` - Start containers with Podman Compose
- `npm run container:up:dev` - Start development containers with Podman Compose
- `npm run container:down` - Stop containers with Podman Compose
- `npm run container:logs` - View container logs from Podman Compose
- `npm run container:exec` - Execute shell in Podman container

**Note:** All `container:*` scripts use Podman commands but are compatible with Docker CLI if Docker is available.

## 🔧 Environment Variables

Create a `.env` file based on `.env.example`:

```bash
NODE_ENV=development
PORT=3000
HOST=localhost
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

## 🏥 Health Endpoints

- **Basic Health:** `GET /api/health`
- **Detailed Health:** `GET /api/health/detailed`

## 🧪 Testing

The service includes comprehensive test coverage:

- **Unit Tests:** 9 tests for router logic
- **Integration Tests:** 10 tests for full application
- **Total Coverage:** 100% for health endpoints

## 📊 Container Validation

Run the container validation script:

```bash
./scripts/validate-containers.sh
```

## 🔒 Security Features

- **Non-root container user**
- **Alpine Linux base image**
- **Minimal attack surface**
- **Health checks enabled**
- **Environment variable validation**

## 🚦 Deployment

### Production
```bash
# Build and deploy
npm run container:build
npm run container:up
```

### Development
```bash
# Start development environment
npm run container:up:dev
```

## 📝 Development Notes

- **Hot Reload:** Available in development container
- **Volume Mounts:** Source code mounted for live changes
- **Port Mapping:** 3000:3000 (host:container)
- **Network:** Custom bridge network for isolation

## 🐛 Troubleshooting

### Container Issues
```bash
# Check container logs
npm run container:logs

# Execute into container
npm run container:exec

# Rebuild container
npm run container:build
```

### Port Conflicts
```bash
# Check port usage
lsof -i :3000

# Kill process on port
kill -9 <PID>
```

### Permission Issues
```bash
# Fix volume permissions
sudo chown -R 1001:1001 .
```
