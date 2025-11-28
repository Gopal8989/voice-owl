/**
 * Swagger/OpenAPI Configuration
 */
import swaggerJsdoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'VoiceOwl API',
    version: '1.0.0',
    description: 'Audio Transcription API Service - Accepts audio file URLs, performs transcription (mock or Azure Speech-to-Text), and stores results in MongoDB.',
    contact: {
      name: 'VoiceOwl API Support',
    },
    license: {
      name: 'ISC',
    },
  },
  servers: [
    {
      url: 'http://localhost:7070',
      description: 'Development server',
    },
    {
      url: 'https://api.voiceowl.com',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Transcription',
      description: 'Transcription endpoints',
    },
    {
      name: 'Health',
      description: 'Health check and API information endpoints',
    },
  ],
  components: {
    schemas: {
      TranscriptionRequest: {
        type: 'object',
        required: ['audioUrl'],
        properties: {
          audioUrl: {
            type: 'string',
            format: 'uri',
            example: 'https://example.com/sample.mp3',
            description: 'URL of the audio file to transcribe',
          },
        },
      },
      AzureTranscriptionRequest: {
        type: 'object',
        required: ['audioUrl'],
        properties: {
          audioUrl: {
            type: 'string',
            format: 'uri',
            example: 'https://example.com/sample.mp3',
            description: 'URL of the audio file to transcribe',
          },
          language: {
            type: 'string',
            pattern: '^[a-z]{2}-[A-Z]{2}$',
            example: 'en-US',
            description: 'Language code in format xx-XX (e.g., en-US, fr-FR). Defaults to en-US',
            default: 'en-US',
          },
        },
      },
      TranscriptionResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
            description: 'Indicates if the request was successful',
          },
          message: {
            type: 'string',
            example: 'Transcription created successfully',
            description: 'Success message',
          },
          data: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: '507f1f77bcf86cd799439011',
                description: 'MongoDB document ID',
              },
              audioUrl: {
                type: 'string',
                example: 'https://example.com/sample.mp3',
              },
              transcription: {
                type: 'string',
                example: 'transcribed text',
              },
              source: {
                type: 'string',
                enum: ['mock', 'azure'],
                example: 'mock',
                description: 'Source of transcription',
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00.000Z',
              },
            },
          },
        },
      },
      TranscriptionsListResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
            description: 'Indicates if the request was successful',
          },
          message: {
            type: 'string',
            example: 'Transcriptions fetched successfully',
            description: 'Success message',
          },
          data: {
            type: 'object',
            properties: {
              count: {
                type: 'number',
                example: 2,
                description: 'Number of transcriptions returned',
              },
              transcriptions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    _id: {
                      type: 'string',
                      example: '507f1f77bcf86cd799439011',
                    },
                    audioUrl: {
                      type: 'string',
                      example: 'https://example.com/sample1.mp3',
                    },
                    transcription: {
                      type: 'string',
                      example: 'transcribed text',
                    },
                    source: {
                      type: 'string',
                      enum: ['mock', 'azure'],
                      example: 'mock',
                    },
                    createdAt: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-01-15T10:30:00.000Z',
                    },
                  },
                },
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
            description: 'Indicates if the request was successful (always false for errors)',
          },
          error: {
            type: 'string',
            example: 'ValidationError',
          },
          message: {
            type: 'string',
            example: 'audioUrl is required',
          },
          statusCode: {
            type: 'number',
            example: 400,
          },
          requestId: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
            description: 'Unique request ID for tracking',
          },
        },
      },
      HealthResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
            description: 'Indicates if the request was successful',
          },
          message: {
            type: 'string',
            example: 'Server is healthy',
            description: 'Status message',
          },
          data: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'ok',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                example: '2024-01-15T10:30:00.000Z',
              },
              uptime: {
                type: 'number',
                example: 3600.5,
                description: 'Server uptime in seconds',
              },
              database: {
                type: 'object',
                properties: {
                  connected: {
                    type: 'boolean',
                    example: true,
                  },
                  readyState: {
                    type: 'number',
                    example: 1,
                    description: 'MongoDB connection state (0=disconnected, 1=connected, 2=connecting, 3=disconnecting)',
                  },
                },
              },
              memory: {
                type: 'object',
                properties: {
                  used: {
                    type: 'number',
                    example: 45.23,
                    description: 'Used memory in MB',
                  },
                  total: {
                    type: 'number',
                    example: 128.5,
                    description: 'Total memory in MB',
                  },
                },
              },
              api: {
                type: 'object',
                properties: {
                  swagger: {
                    type: 'string',
                    example: 'http://localhost:7070/api-docs',
                    description: 'Swagger API documentation URL',
                  },
                  health: {
                    type: 'string',
                    example: 'http://localhost:7070/health',
                  },
                  transcription: {
                    type: 'string',
                    example: 'http://localhost:7070/api/transcription',
                  },
                  transcriptions: {
                    type: 'string',
                    example: 'http://localhost:7070/api/transcriptions',
                  },
                  azureTranscription: {
                    type: 'string',
                    example: 'http://localhost:7070/api/azure-transcription',
                  },
                },
              },
            },
          },
        },
      },
      ApiInfoResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
            description: 'Indicates if the request was successful',
          },
          message: {
            type: 'string',
            example: 'API information retrieved successfully',
            description: 'Success message',
          },
          data: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                example: 'VoiceOwl API',
              },
              version: {
                type: 'string',
                example: '1.0.0',
              },
              description: {
                type: 'string',
                example: 'Audio Transcription API Service',
              },
              swagger: {
                type: 'string',
                example: 'http://localhost:7070/api-docs',
                description: 'Swagger API documentation URL',
              },
              endpoints: {
                type: 'object',
                description: 'Available API endpoints',
                additionalProperties: true,
              },
            },
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              success: false,
              error: 'ValidationError',
              message: 'audioUrl is required',
              statusCode: 400,
              requestId: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
      },
      RateLimitError: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
            example: {
              success: false,
              error: 'RateLimitError',
              message: 'Rate limit exceeded. Maximum 10 requests per 60 seconds.',
              statusCode: 429,
              requestId: '550e8400-e29b-41d4-a716-446655440000',
            },
          },
        },
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ErrorResponse',
            },
          },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/app.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);

