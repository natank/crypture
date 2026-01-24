import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

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
        },
        CoinGeckoSimplePrice: {
          type: 'object',
          description: 'Simple price data from CoinGecko API',
          example: {
            bitcoin: {
              usd: 43250.50,
              usd_market_cap: 845000000000,
              usd_24h_vol: 12345678900,
              usd_24h_change: 2.5,
              last_updated_at: 1642694400
            }
          }
        },
        CoinGeckoMarketData: {
          type: 'array',
          description: 'Market data for multiple coins',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Coin identifier' },
              symbol: { type: 'string', description: 'Coin symbol' },
              name: { type: 'string', description: 'Coin name' },
              current_price: { type: 'number', description: 'Current price in USD' },
              market_cap: { type: 'number', description: 'Market capitalization' },
              market_cap_rank: { type: 'number', description: 'Market cap rank' },
              price_change_24h: { type: 'number', description: '24h price change' },
              price_change_percentage_24h: { type: 'number', description: '24h price change percentage' }
            }
          }
        },
        CoinGeckoSearchResponse: {
          type: 'object',
          description: 'Search results from CoinGecko API',
          properties: {
            coins: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', description: 'Coin identifier' },
                  name: { type: 'string', description: 'Coin name' },
                  symbol: { type: 'string', description: 'Coin symbol' },
                  market_cap_rank: { type: 'number', description: 'Market cap rank' },
                  thumb: { type: 'string', description: 'Thumbnail image URL' }
                }
              }
            }
          }
        },
        CoinGeckoTrendingResponse: {
          type: 'object',
          description: 'Trending coins from CoinGecko API',
          properties: {
            coins: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  item: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', description: 'Coin identifier' },
                      name: { type: 'string', description: 'Coin name' },
                      symbol: { type: 'string', description: 'Coin symbol' },
                      market_cap_rank: { type: 'number', description: 'Market cap rank' },
                      price_btc: { type: 'number', description: 'Price in BTC' },
                      score: { type: 'number', description: 'Trending score' }
                    }
                  }
                }
              }
            }
          }
        },
        CoinGeckoGlobalResponse: {
          type: 'object',
          description: 'Global cryptocurrency market data',
          properties: {
            data: {
              type: 'object',
              properties: {
                active_cryptocurrencies: { type: 'number', description: 'Number of active cryptocurrencies' },
                markets: { type: 'number', description: 'Number of markets' },
                total_market_cap: {
                  type: 'object',
                  properties: {
                    usd: { type: 'number', description: 'Total market cap in USD' }
                  }
                },
                total_volume: {
                  type: 'object',
                  properties: {
                    usd: { type: 'number', description: 'Total volume in USD' }
                  }
                },
                market_cap_change_percentage_24h_usd: { type: 'number', description: '24h market cap change percentage' }
              }
            }
          }
        },
        CoinGeckoRateLimitResponse: {
          type: 'object',
          description: 'Rate limit information',
          properties: {
            rateLimit: { type: 'number', description: 'Total rate limit' },
            remaining: { type: 'number', description: 'Remaining requests' },
            usage: { type: 'number', description: 'Used requests' },
            percentage: { type: 'number', description: 'Usage percentage' }
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
      },
      {
        name: 'CoinGecko',
        description: 'CoinGecko API proxy endpoints for cryptocurrency data'
      }
    ]
  },
  apis: process.env.NODE_ENV === 'production'
    ? [path.join(__dirname, '../routes/*.js'), path.join(__dirname, '../**/*.js')]
    : ['./src/routes/*.ts', './src/**/*.ts'],
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
