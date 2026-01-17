import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crypture Backend Proxy API',
      version: '1.0.0',
      description: 'Crypture cryptocurrency portfolio tracking backend API documentation',
      contact: {
        name: 'Crypture Team',
        email: 'support@crypture.app'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.crypture.app' 
          : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === 'production' 
          ? 'Production server' 
          : 'Development server'
      },
      {
        url: 'http://localhost:3000',
        description: 'Local development server'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization'
        }
      },
      schemas: {
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'unhealthy'],
              description: 'Service health status'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            },
            uptime: {
              type: 'number',
              description: 'Service uptime in seconds'
            },
            environment: {
              type: 'string',
              description: 'Current environment'
            },
            version: {
              type: 'string',
              description: 'API version'
            },
            memory: {
              type: 'object',
              properties: {
                used: {
                  type: 'number',
                  description: 'Memory usage in MB'
                },
                total: {
                  type: 'number',
                  description: 'Total memory in MB'
                }
              }
            },
            services: {
              type: 'object',
              properties: {
                database: {
                  type: 'string',
                  description: 'Database service status'
                },
                cache: {
                  type: 'string',
                  description: 'Cache service status'
                },
                external_apis: {
                  type: 'string',
                  description: 'External API service status'
                }
              }
            }
          }
        },
        DetailedHealthResponse: {
          allOf: [
            { $ref: '#/components/schemas/HealthResponse' },
            {
              type: 'object',
              properties: {
                system: {
                  type: 'object',
                  properties: {
                    platform: {
                      type: 'string',
                      description: 'Operating system platform'
                    },
                    arch: {
                      type: 'string',
                      description: 'System architecture'
                    },
                    nodeVersion: {
                      type: 'string',
                      description: 'Node.js version'
                    },
                    cpuCount: {
                      type: 'number',
                      description: 'Number of CPU cores'
                    }
                  }
                },
                configuration: {
                  type: 'object',
                  properties: {
                    port: {
                      type: 'number',
                      description: 'Server port'
                    },
                    host: {
                      type: 'string',
                      description: 'Server host'
                    },
                    corsOrigin: {
                      type: 'string',
                      description: 'CORS origin configuration'
                    },
                    logLevel: {
                      type: 'string',
                      description: 'Logging level'
                    }
                  }
                }
              }
            }
          ]
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp'
            },
            requestId: {
              type: 'string',
              description: 'Request ID for tracking'
            }
          }
        },
        NotFoundResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check and monitoring endpoints'
      },
      {
        name: 'System',
        description: 'System information and configuration'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/**/*.ts'], // Paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
