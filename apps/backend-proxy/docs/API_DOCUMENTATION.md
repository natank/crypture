# API Documentation Guide

## 📚 Overview

The Crypture Backend Proxy API is documented using Swagger/OpenAPI 3.0 specification. The interactive documentation is available at `/api-docs` and provides comprehensive information about all available endpoints.

## 🚀 Quick Start

### Access Documentation
```bash
# Start the development server
npm run dev

# Open API documentation in browser
npm run docs:open

# Or navigate manually to:
open http://localhost:3000/api-docs
```

### Documentation Features
- **Interactive API Explorer** - Test endpoints directly from the browser
- **Comprehensive Schema Documentation** - Detailed request/response schemas
- **Environment-Aware Configuration** - Different servers for dev/prod
- **Real-time Validation** - Request/response validation
- **Code Examples** - Multiple language examples

## 📋 Available Endpoints

### Health Endpoints

#### GET /api/health
**Description:** Returns the current health status of the backend service.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-17T15:15:38.715Z",
  "uptime": 10.47629825,
  "environment": "development",
  "version": "1.0.0",
  "memory": {
    "used": 12.31,
    "total": 30.09
  },
  "services": {
    "database": "not_implemented",
    "cache": "not_implemented",
    "external_apis": "not_implemented"
  }
}
```

#### GET /api/health/detailed
**Description:** Returns detailed health status including system information and configuration.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-17T15:15:38.715Z",
  "uptime": 10.47629825,
  "environment": "development",
  "version": "1.0.0",
  "memory": {
    "used": 12.31,
    "total": 30.09
  },
  "services": {
    "database": "not_implemented",
    "cache": "not_implemented",
    "external_apis": "not_implemented"
  },
  "system": {
    "platform": "darwin",
    "arch": "x64",
    "nodeVersion": "v20.11.0",
    "pid": 40995
  },
  "configuration": {
    "port": 3000,
    "host": "localhost",
    "corsOrigin": "http://localhost:5173",
    "logLevel": "debug"
  }
}
```

### System Endpoints

#### GET /
**Description:** Returns basic service information and available endpoints.

**Response:**
```json
{
  "message": "Crypture Backend Proxy Service",
  "version": "1.0.0",
  "environment": "development",
  "timestamp": "2026-01-17T15:15:40.698Z",
  "documentation": "/api-docs",
  "health": "/api/health"
}
```

## 🔧 Configuration

### Swagger Configuration
The API documentation is configured in `src/config/swagger.ts`:

```typescript
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crypture Backend Proxy API',
      version: '1.0.0',
      description: 'Crypture cryptocurrency portfolio tracking backend API documentation'
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.crypture.app' 
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/**/*.ts']
};
```

### Environment-Specific Servers
- **Development:** `http://localhost:3000`
- **Production:** `https://api.crypture.app`

## 📝 Adding API Documentation

### 1. Route Annotations
Add Swagger annotations to your route handlers:

```typescript
/**
 * @swagger
 * /api/your-endpoint:
 *   get:
 *     summary: Get your resource
 *     description: Returns your resource data
 *     tags: [YourTag]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/YourSchema'
 */
router.get('/', (req, res) => {
  // Your implementation
});
```

### 2. Schema Definitions
Define schemas in the Swagger configuration:

```typescript
schemas: {
  YourSchema: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Resource ID'
      },
      name: {
        type: 'string',
        description: 'Resource name'
      }
    }
  }
}
```

### 3. Tag Organization
Organize endpoints using tags:

```typescript
tags: [
  {
    name: 'Health',
    description: 'Health check and monitoring endpoints'
  },
  {
    name: 'YourTag',
    description: 'Your resource endpoints'
  }
]
```

## 🛠️ Development Scripts

### Documentation Scripts
```bash
npm run docs:serve      # Start server with documentation
npm run docs:build      # Build and start server
npm run docs:open       # Open documentation in browser
npm run docs:json       # Export Swagger JSON
npm run docs:validate   # Validate Swagger specification
```

### Usage Examples
```bash
# Start development server with documentation
npm run docs:serve

# Open documentation in browser (after server is running)
npm run docs:open

# Export Swagger specification
npm run docs:json

# Validate specification (requires swagger-cli)
npm install -g swagger-cli
npm run docs:validate
```

## 🔍 Testing with Swagger UI

### Interactive Testing
1. Navigate to `/api-docs`
2. Click on any endpoint
3. Click "Try it out"
4. Fill in parameters (if any)
5. Click "Execute"

### Example: Testing Health Endpoint
1. Open `/api-docs`
2. Expand "Health" section
3. Click on "GET /api/health"
4. Click "Try it out"
5. Click "Execute"
6. View the response

## 📊 Response Schemas

### Standard Response Format
All endpoints follow a consistent response format:

#### Success Response
```json
{
  "data": { /* Response data */ },
  "timestamp": "2026-01-17T15:15:38.715Z",
  "requestId": "abc123"
}
```

#### Error Response
```json
{
  "error": "ErrorType",
  "message": "Error description",
  "timestamp": "2026-01-17T15:15:38.715Z",
  "requestId": "abc123"
}
```

#### Not Found Response
```json
{
  "error": "Not Found",
  "message": "Route /non-existent not found",
  "timestamp": "2026-01-17T15:15:38.715Z"
}
```

## 🔒 Authentication

### API Key Authentication
When implemented, API endpoints will support API key authentication:

```typescript
components: {
  securitySchemes: {
    ApiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization'
    }
  }
}
```

### Usage
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     http://localhost:3000/api/protected-endpoint
```

## 🌐 CORS Configuration

### Development CORS
- **Permissive:** Allows all origins in development
- **Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers:** All headers allowed

### Production CORS
- **Restricted:** Whitelist origins only
- **Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers:** Specific headers only

## 📱 Mobile & Frontend Integration

### Frontend Integration
```javascript
// Using fetch
const response = await fetch('http://localhost:3000/api/health');
const data = await response.json();

// Using axios
const response = await axios.get('http://localhost:3000/api/health');
const data = response.data;
```

### CORS Headers
The API automatically handles CORS preflight requests:

```http
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
```

## 🚀 Production Deployment

### Documentation in Production
- **URL:** `https://api.crypture.app/api-docs`
- **Security:** May be restricted in production
- **Performance:** Optimized for production serving

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
CORS_ORIGIN=https://crypture.app
```

## 🔧 Troubleshooting

### Common Issues

#### Documentation Not Loading
```bash
# Check if server is running
curl http://localhost:3000/api-docs

# Check server logs
npm run dev

# Verify Swagger configuration
cat src/config/swagger.ts
```

#### Schema Validation Errors
```bash
# Validate Swagger specification
npm run docs:validate

# Check for syntax errors in annotations
grep -r "@swagger" src/
```

#### CORS Issues
```bash
# Check CORS configuration
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     http://localhost:3000/api/health
```

### Debug Mode
```bash
# Start with verbose logging
npm run dev:verbose

# Check environment variables
echo $NODE_ENV
echo $PORT
```

## 📚 Additional Resources

### Swagger/OpenAPI Resources
- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger UI Documentation](https://swagger.io/tools/swagger-ui/)
- [Swagger-jsdoc Documentation](https://github.com/Surnet/swagger-jsdoc)

### API Design Best Practices
- [RESTful API Design Guide](https://restfulapi.net/)
- [API Design Guidelines](https://github.com/microsoft/api-guidelines)

### Testing Resources
- [Postman API Testing](https://www.postman.com/api-testing/)
- [Insomnia REST Client](https://insomnia.rest/)
