/**
 * Swagger Common Utilities and Helpers
 * Reusable Swagger documentation helpers for consistent API documentation
 */

/**
 * Common Swagger response schemas
 */
export const swaggerResponses = {
  validationError: {
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
  rateLimitError: {
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
  notFoundError: {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },
  internalServerError: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
      },
    },
  },
  externalServiceError: {
    description: 'External service error',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse',
        },
        example: {
          success: false,
          error: 'ExternalServiceError',
          message: 'Azure Speech service failed',
          statusCode: 502,
          requestId: '550e8400-e29b-41d4-a716-446655440000',
        },
      },
    },
  },
};

/**
 * Common Swagger tags
 */
export const swaggerTags = {
  transcription: {
    name: 'Transcription',
    description: 'Transcription endpoints for audio file processing',
  },
  health: {
    name: 'Health',
    description: 'Health check and API information endpoints',
  },
};

/**
 * Helper function to generate Swagger path documentation
 * Note: This is a utility for programmatic Swagger generation if needed
 */
export const createSwaggerPath = (config: {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  summary: string;
  description?: string;
  tag: string;
  requestBody?: {
    required?: boolean;
    schema: string;
    example?: Record<string, unknown>;
  };
  responses: {
    [statusCode: string]: {
      description: string;
      schema?: string;
      example?: Record<string, unknown>;
    };
  };
  parameters?: Array<{
    name: string;
    in: 'query' | 'path' | 'header';
    required?: boolean;
    schema: {
      type: string;
      example?: string | number;
    };
    description?: string;
  }>;
}): Record<string, Record<string, Record<string, unknown>>> => {
  const methodDoc: Record<string, unknown> = {
    summary: config.summary,
    description: config.description || config.summary,
    tags: [config.tag],
    responses: {} as Record<string, unknown>,
  };

  // Add request body if provided
  if (config.requestBody) {
    methodDoc.requestBody = {
      required: config.requestBody.required ?? true,
      content: {
        'application/json': {
          schema: {
            $ref: config.requestBody.schema,
          },
          ...(config.requestBody.example ? { example: config.requestBody.example } : {}),
        },
      },
    };
  }

  // Add parameters if provided
  if (config.parameters && config.parameters.length > 0) {
    methodDoc.parameters = config.parameters.map((param) => ({
      name: param.name,
      in: param.in,
      required: param.required ?? false,
      schema: param.schema,
      description: param.description,
    }));
  }

  // Add responses
  Object.entries(config.responses).forEach(([statusCode, response]) => {
    const responseObj: Record<string, unknown> = {
      description: response.description,
    };

    if (response.schema) {
      responseObj.content = {
        'application/json': {
          schema: {
            $ref: response.schema,
          },
          ...(response.example ? { example: response.example } : {}),
        },
      };
    }

    (methodDoc.responses as Record<string, unknown>)[statusCode] = responseObj;
  });

  return {
    [config.path]: {
      [config.method]: methodDoc,
    },
  };
};

/**
 * Generate Swagger JSDoc comment from path config
 * Utility function for programmatic Swagger comment generation
 */
export const generateSwaggerComment = (config: {
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  path: string;
  summary: string;
  description?: string;
  tag: string;
  requestBody?: {
    required?: boolean;
    schema: string;
    example?: Record<string, unknown>;
  };
  responses: {
    [statusCode: string]: {
      description: string;
      schema?: string;
      example?: Record<string, unknown>;
      ref?: string;
    };
  };
  parameters?: Array<{
    name: string;
    in: 'query' | 'path' | 'header';
    required?: boolean;
    schema: {
      type: string;
      example?: string | number;
    };
    description?: string;
  }>;
}): string => {
  let comment = `/**\n * @swagger\n * ${config.path}:\n *   ${config.method}:\n`;
  comment += ` *     summary: ${config.summary}\n`;
  
  if (config.description) {
    comment += ` *     description: ${config.description}\n`;
  }
  
  comment += ` *     tags: [${config.tag}]\n`;

  // Add request body
  if (config.requestBody) {
    comment += ` *     requestBody:\n`;
    comment += ` *       required: ${config.requestBody.required ?? true}\n`;
    comment += ` *       content:\n`;
    comment += ` *         application/json:\n`;
    comment += ` *           schema:\n`;
    comment += ` *             $ref: '${config.requestBody.schema}'\n`;
    if (config.requestBody.example) {
      comment += ` *           example:\n`;
      const exampleStr = JSON.stringify(config.requestBody.example, null, 14);
      comment += ` *             ${exampleStr.replace(/\n/g, '\n * ')}\n`;
    }
  }

  // Add parameters
  if (config.parameters && config.parameters.length > 0) {
    comment += ` *     parameters:\n`;
    config.parameters.forEach((param) => {
      comment += ` *       - name: ${param.name}\n`;
      comment += ` *         in: ${param.in}\n`;
      comment += ` *         required: ${param.required ?? false}\n`;
      comment += ` *         schema:\n`;
      comment += ` *           type: ${param.schema.type}\n`;
      if (param.schema.example !== undefined) {
        comment += ` *           example: ${param.schema.example}\n`;
      }
      if (param.description) {
        comment += ` *         description: ${param.description}\n`;
      }
    });
  }

  // Add responses
  comment += ` *     responses:\n`;
  Object.entries(config.responses).forEach(([statusCode, response]) => {
    comment += ` *       ${statusCode}:\n`;
    comment += ` *         description: ${response.description}\n`;
    
    if (response.ref) {
      comment += ` *         $ref: '${response.ref}'\n`;
    } else if (response.schema) {
      comment += ` *         content:\n`;
      comment += ` *           application/json:\n`;
      comment += ` *             schema:\n`;
      comment += ` *               $ref: '${response.schema}'\n`;
      if (response.example) {
        comment += ` *             example:\n`;
        const exampleStr = JSON.stringify(response.example, null, 16);
        comment += ` *               ${exampleStr.replace(/\n/g, '\n * ')}\n`;
      }
    }
  });

  comment += ` */`;
  return comment;
};

/**
 * Common Swagger examples
 */
export const swaggerExamples = {
  transcriptionRequest: {
    audioUrl: 'https://example.com/sample.mp3',
  },
  azureTranscriptionRequest: {
    audioUrl: 'https://example.com/sample.mp3',
    language: 'en-US',
  },
  transcriptionResponse: {
    success: true,
    message: 'Transcription created successfully',
    data: {
      id: '507f1f77bcf86cd799439011',
      audioUrl: 'https://example.com/sample.mp3',
      transcription: 'transcribed text',
      createdAt: '2024-01-15T10:30:00.000Z',
    },
  },
  azureTranscriptionResponse: {
    success: true,
    message: 'Azure transcription created successfully',
    data: {
      id: '507f1f77bcf86cd799439013',
      audioUrl: 'https://example.com/sample.mp3',
      transcription: '[Mock] Transcribed text from https://example.com/sample.mp3',
      source: 'azure',
      createdAt: '2024-01-15T10:30:00.000Z',
    },
  },
  transcriptionsListResponse: {
    success: true,
    message: 'Transcriptions fetched successfully',
    data: {
      count: 2,
      transcriptions: [
        {
          _id: '507f1f77bcf86cd799439011',
          audioUrl: 'https://example.com/sample1.mp3',
          transcription: 'transcribed text',
          source: 'mock',
          createdAt: '2024-01-15T10:30:00.000Z',
        },
        {
          _id: '507f1f77bcf86cd799439012',
          audioUrl: 'https://example.com/sample2.mp3',
          transcription: 'Azure transcribed text',
          source: 'azure',
          createdAt: '2024-01-14T09:20:00.000Z',
        },
      ],
    },
  },
};

