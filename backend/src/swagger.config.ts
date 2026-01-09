import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Incident Management API',
      version: '1.0.0',
      description: 'API để quản lý báo cáo sự cố - Hệ thống báo cáo sự cố. Swagger này tự động cập nhật từ JSDoc comments trong code.',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local development server'
      },
      {
        url: 'https://api.production.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'General',
        description: 'General endpoints for health check and info'
      },
      {
        name: 'Incidents',
        description: 'Incident management endpoints'
      },
      {
        name: 'Audit',
        description: 'Audit log endpoints'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Error message'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Incident: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000'
            },
            imageUrl: {
              type: 'string',
              example: '/uploads/incident-123.jpg'
            },
            type: {
              type: 'string',
              example: 'flood'
            },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number', example: 10.762622 },
                lng: { type: 'number', example: 106.660172 },
                address: { type: 'string', example: 'TP. Hồ Chí Minh' }
              }
            },
            description: {
              type: 'string',
              example: 'Ngập nặng tại khu vực này'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'resolved', 'rejected'],
              example: 'pending'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  // Tìm tất cả file routes để scan JSDoc comments
  apis: [
    './src/routes/*.ts',
    './src/index.ts',
    './dist/routes/*.js',
    './dist/index.js'
  ]
};

export const swaggerSpec = swaggerJsdoc(options);
